import express, { type Express } from "express";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { type Server } from "http";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  // Lazy import vite and plugins only when needed (development mode)
  // This avoids pulling in dev dependencies in production builds
  const viteModule = await import("vite");
  const { nanoid } = await import("nanoid");
  
  // Dynamically import plugins (only available in dev)
  const reactPlugin = await import("@vitejs/plugin-react");
  const runtimeErrorOverlay = await import("@replit/vite-plugin-runtime-error-modal");
  const glslPlugin = await import("vite-plugin-glsl");
  
  const viteLogger = viteModule.createLogger();
  const serverOptions: viteModule.ServerOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true,
  };

  // Create inline config with dynamically imported plugins
  const vite = await viteModule.createServer({
    root: path.resolve(__dirname, "..", "client"),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "..", "client", "src"),
        "@shared": path.resolve(__dirname, "..", "shared"),
      },
    },
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
    plugins: [
      reactPlugin.default(),
      runtimeErrorOverlay.default(),
      glslPlugin.default(),
    ],
    assetsInclude: ["**/*.gltf", "**/*.glb", "**/*.mp3", "**/*.ogg", "**/*.wav"],
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        __dirname,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  // When bundled, __dirname will be 'dist', so 'dist/public' is correct
  // But we need to resolve from the app root, not relative to the bundled file
  // Try multiple possible paths
  const possiblePaths = [
    path.resolve(__dirname, "public"), // dist/public when bundled
    path.resolve(process.cwd(), "dist", "public"), // absolute from cwd
    path.resolve(__dirname, "..", "dist", "public"), // fallback
  ];

  let distPath: string | null = null;
  for (const possiblePath of possiblePaths) {
    if (fs.existsSync(possiblePath)) {
      distPath = possiblePath;
      break;
    }
  }

  if (!distPath) {
    log(`Could not find build directory. Tried: ${possiblePaths.join(", ")}`, "error");
    throw new Error(
      `Could not find the build directory. Tried: ${possiblePaths.join(", ")}`,
    );
  }

  log(`Serving static files from: ${distPath}`, "express");
  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    const indexPath = path.resolve(distPath!, "index.html");
    if (!fs.existsSync(indexPath)) {
      log(`index.html not found at: ${indexPath}`, "error");
      return res.status(500).send("index.html not found");
    }
    res.sendFile(indexPath);
  });
}

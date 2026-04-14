import { useEffect, useRef } from "react";

const N = 800;
const FOV = 300;
const BASE_SPEED = 0.18;
const BOOST_SPEED = BASE_SPEED * 20;
const BOOST_DURATION = 1800; // ms
const LERP_VP = 0.05; // vanishing-point lerp per frame

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    // Star buffers
    const x = new Float32Array(N);
    const y = new Float32Array(N);
    const z = new Float32Array(N);
    const px = new Float32Array(N); // previous projected x
    const py = new Float32Array(N); // previous projected y

    let W = 0, H = 0;
    let vpX = 0, vpY = 0;        // current vanishing point (screen coords)
    let targetVpX = 0, targetVpY = 0;
    let boostStart = -Infinity;

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      vpX = W / 2;
      vpY = H / 2;
      targetVpX = W / 2;
      targetVpY = H / 2;
    }

    function range(depth: number) {
      // World-space x/y extent so stars fill the canvas
      return (Math.max(W, H) / 2 / FOV + 1.2) * depth;
    }

    function spawnStar(i: number, far = true) {
      const d = far ? 0.8 + Math.random() * 0.2 : Math.random() * 0.95 + 0.05;
      z[i] = d;
      const r = range(d);
      x[i] = (Math.random() * 2 - 1) * r;
      y[i] = (Math.random() * 2 - 1) * r;
      // project immediately to avoid streak from origin
      px[i] = (x[i] / z[i]) * FOV + vpX;
      py[i] = (y[i] / z[i]) * FOV + vpY;
    }

    function init() {
      for (let i = 0; i < N; i++) {
        // seed z evenly so all brightness levels exist from frame one
        z[i] = (i + Math.random()) / N;
        const r = range(z[i]);
        x[i] = (Math.random() * 2 - 1) * r;
        y[i] = (Math.random() * 2 - 1) * r;
        px[i] = (x[i] / z[i]) * FOV + vpX;
        py[i] = (y[i] / z[i]) * FOV + vpY;
      }
    }

    let lastTime = performance.now();
    let rafId: number;

    function frame(now: number) {
      const dt = Math.min((now - lastTime) / 1000, 0.05); // cap at 50 ms
      lastTime = now;

      // Vanishing-point lerp
      vpX += (targetVpX - vpX) * LERP_VP;
      vpY += (targetVpY - vpY) * LERP_VP;

      // Speed (with boost)
      const elapsed = now - boostStart;
      let speed = BASE_SPEED;
      if (elapsed < BOOST_DURATION) {
        const t = elapsed / BOOST_DURATION;
        const ease = 1 - t * t; // quadratic ease-out
        speed = BASE_SPEED + (BOOST_SPEED - BASE_SPEED) * ease;
      }

      // Clear with near-black (not full black so screen blend looks natural)
      ctx.fillStyle = "#000008";
      ctx.fillRect(0, 0, W, H);

      for (let i = 0; i < N; i++) {
        z[i] -= speed * dt;

        // Project
        const sx = (x[i] / z[i]) * FOV + vpX;
        const sy = (y[i] / z[i]) * FOV + vpY;

        const brightness = 1 - z[i]; // 0 = far/dim, 1 = close/bright
        const size = Math.max(0.4, brightness * 2.2);
        const alpha = Math.min(1, brightness * 1.4);

        // Respawn if off-screen or past camera
        if (
          z[i] <= 0 ||
          sx < -20 || sx > W + 20 ||
          sy < -20 || sy > H + 20
        ) {
          spawnStar(i, true);
          continue;
        }

        // Streak from previous position
        if (brightness > 0.05) {
          ctx.beginPath();
          ctx.moveTo(px[i], py[i]);
          ctx.lineTo(sx, sy);
          ctx.strokeStyle = `rgba(180,200,255,${alpha * 0.6})`;
          ctx.lineWidth = size * 0.5;
          ctx.stroke();
        }

        // Dot at tip
        ctx.beginPath();
        ctx.arc(sx, sy, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220,235,255,${alpha})`;
        ctx.fill();

        px[i] = sx;
        py[i] = sy;
      }

      rafId = requestAnimationFrame(frame);
    }

    function onMouseMove(e: MouseEvent) {
      targetVpX = e.clientX;
      targetVpY = e.clientY;
    }

    function onClick() {
      boostStart = performance.now();
    }

    resize();
    init();
    rafId = requestAnimationFrame(frame);

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 201,
        pointerEvents: "none",
        mixBlendMode: "screen",
      }}
    />
  );
}

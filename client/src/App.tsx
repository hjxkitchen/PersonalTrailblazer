import { Suspense } from "react";
import "@fontsource/inter";
import Portfolio from "./components/Portfolio";
import StarField from "./components/StarField";

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <StarField />
      <Suspense fallback={
        <div className="flex items-center justify-center h-screen bg-slate-900 text-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
            <p>Loading the journey...</p>
          </div>
        </div>
      }>
        <Portfolio />
      </Suspense>
    </div>
  );
}

export default App;

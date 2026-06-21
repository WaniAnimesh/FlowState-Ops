import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

// Init Express App
const app = express();
const PORT = 3000;

app.use(express.json());

// API Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// -----------------------------------------------------------------------------
// VITE INTEGRATION / STATIC ROUTING
// -----------------------------------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development mode with Vite Dev Server Middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("[FlowState Ops] Running in Live Vite Development Mode");
  } else {
    // Production Mode: Serve built static files
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("[FlowState Ops] Running in Container Production Mode");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[FlowState Ops Server] Listening at http://0.0.0.0:${PORT}`);
  });
}

startServer();

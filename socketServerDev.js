import socketServer from "./socketServer.js";
import { createServer as createViteServer } from "vite";

async function createServer() {
    let v = await createViteServer({
        server: { middlewareMode: true },
        appType: 'custom'
    });

    socketServer(v.middlewares);
}

createServer();

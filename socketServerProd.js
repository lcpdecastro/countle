import socketServer from "./socketServer.js";
import { handler } from './build/handler.js';

socketServer(handler);

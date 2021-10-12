"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const livecycle_1 = require("./server/livecycle");
const ws_1 = __importDefault(require("ws"));
const http_1 = __importDefault(require("http"));
const custom_1 = require("./custom");
const port = process.env.PORT || 1234;
const server = http_1.default.createServer((request, response) => {
    var url = request.url;
    if (url === "/") {
        response.writeHead(200);
        response.end();
    }
    else {
        response.writeHead(403, { "Content-Type": "text/plain" });
        response.end("not authorized");
    }
});
const wss = new ws_1.default.Server({ noServer: true });
wss.on("connection", livecycle_1.setupWSConnection);
server.on("upgrade", (req, socket, head) => {
    wss.handleUpgrade(req, socket, head, (ws) => custom_1.handleAuth(ws, req, () => wss.emit("connection", ws, req)));
});
server.listen(port);
console.log(`running yjs websocket sorcer  on port ${port}`);

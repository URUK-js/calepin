import env from "dotenv";
env.config();
import { setupWSConnection } from "./server/livecycle";
import WebSocket from "ws";
import http, { IncomingMessage } from "http";
import { handleAuth } from "./custom";
const port = process.env.PORT || 1234;

const server = http.createServer((request: IncomingMessage, response: any) => {
  var url = request.url;
  if (url === "/") {
    response.writeHead(200);
    response.end();
  } else {
    response.writeHead(403, { "Content-Type": "text/plain" });
    response.end("not authorized");
  }
});
const wss = new WebSocket.Server({ noServer: true });
wss.on("connection", setupWSConnection);
server.on("upgrade", (req: IncomingMessage, socket: any, head: any) => {
  wss.handleUpgrade(req, socket, head, (ws) => handleAuth(ws, req, () => wss.emit("connection", ws, req)));
});

server.listen(port);

console.log(`running yjs websocket sorcer  on port ${port}`);

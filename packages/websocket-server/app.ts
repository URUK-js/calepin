import env from "dotenv";
env.config();
import { setupWSConnection } from "./livecycle";
import WebSocket from "ws";
import http, { IncomingMessage } from "http";
// import    jwt  from  "jsonwebtoken";

const host = process.env.HOST || "localhost";
const port = process.env.PORT || 1234;

const server = http.createServer((request: IncomingMessage, response: any) => {
  var url = request.url;
  if (url === "/health") {
    response.writeHead(200);
    response.end(); //end the response
  } else {
    response.writeHead(403, { "Content-Type": "text/plain" });
    response.end("not authorized");
  }
});

const wss = new WebSocket.Server({ noServer: true });

wss.on("connection", setupWSConnection);

server.on("upgrade", (req: IncomingMessage, socket: any, head: any) => {
  // You may check auth of request here..
  const handleAuth = (ws: any) => {
    const [token] = req.url?.split("=").reverse() as [string];
    console.log({ token, url: req.url });
    //        if (!token) {
    //          return res.end("Nothing to see here!");
    //        }
    //  const decodedToken = jwt.verify(token, process.env.SECRET, { algorithms: ["HS256"] });
    //          if (!decodedToken.sub) {
    //            return res.end("Nothing to see here!");
    //          }
    wss.emit("connection", ws, req);
  };

  wss.handleUpgrade(req, socket, head, handleAuth);
});

server.listen({ host, port });

console.log(`running at '${host}' on proutiprit ${port}`);

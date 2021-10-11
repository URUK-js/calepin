"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const livecycle_1 = require("./livecycle");
const ws_1 = __importDefault(require("ws"));
const http_1 = __importDefault(require("http"));
const port = process.env.PORT || 1234;
const server = http_1.default.createServer((request, response) => {
    var url = request.url;
    if (url === "/health") {
        response.writeHead(200);
        response.end(); //end the response
    }
    else {
        response.writeHead(403, { "Content-Type": "text/plain" });
        response.end("not authorized");
    }
});
const wss = new ws_1.default.Server({ noServer: true });
wss.on("connection", livecycle_1.setupWSConnection);
server.on("upgrade", (req, socket, head) => {
    // You may check auth of request here..
    const handleAuth = (ws) => {
        // const [token] = req.url?.split("=").reverse() as [string];
        // console.log({ token, url: req.url });
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
server.listen(port);
console.log(`running at  on proutiprit ${port}`);

"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupWSConnection = exports.closeConn = void 0;
const syncProtocol = __importStar(require("y-protocols/sync"));
const encoding = __importStar(require("lib0/encoding"));
const awarenessProtocol = __importStar(require("y-protocols/awareness"));
const messenger_1 = require("./messenger");
// import { persistence } from "./persistence";
const messenger_2 = require("./messenger");
const doc_1 = require("./doc");
const vars_1 = require("./vars");
exports.closeConn = (doc, conn) => {
    if (doc.conns.has(conn)) {
        const controlledIds = doc.conns.get(conn);
        doc.conns.delete(conn);
        awarenessProtocol.removeAwarenessStates(doc.awareness, Array.from(controlledIds), null);
        if (doc.conns.size === 0) {
            doc.destroy();
            vars_1.docs.delete(doc.name);
        }
    }
    conn.close();
};
exports.setupWSConnection = (conn, req) => {
    // console.log(doc.guid);
    const gc = true;
    const docName = req.url.slice(1).split("?")[0];
    console.log("setupWSConnection");
    conn.binaryType = "arraybuffer";
    const doc = doc_1.getYDoc(docName, gc);
    doc.conns.set(conn, new Set());
    // listen and reply to events
    conn.on("message", (message) => messenger_1.messageListener(conn, doc, new Uint8Array(message)));
    // Check if connection is still alive
    let pongReceived = true;
    const pingInterval = setInterval(() => {
        if (!pongReceived) {
            if (doc.conns.has(conn)) {
                exports.closeConn(doc, conn);
            }
            clearInterval(pingInterval);
        }
        else if (doc.conns.has(conn)) {
            pongReceived = false;
            try {
                conn.ping();
            }
            catch (e) {
                exports.closeConn(doc, conn);
                clearInterval(pingInterval);
            }
        }
    }, vars_1.pingTimeout);
    conn.on("close", () => {
        console.log("close");
        exports.closeConn(doc, conn);
        clearInterval(pingInterval);
    });
    conn.on("pong", () => {
        console.log("pong");
        pongReceived = true;
    });
    // put the following in a variables in a block so the interval handlers don't keep in in
    // scope
    {
        // send sync step 1
        const encoder = encoding.createEncoder();
        encoding.writeVarUint(encoder, vars_1.messageSync);
        //@ts-ignore
        syncProtocol.writeSyncStep1(encoder, doc);
        messenger_2.send(doc, conn, encoding.toUint8Array(encoder));
        const awarenessStates = doc.awareness.getStates();
        if (awarenessStates.size > 0) {
            const encoder = encoding.createEncoder();
            encoding.writeVarUint(encoder, vars_1.messageAwareness);
            encoding.writeVarUint8Array(encoder, awarenessProtocol.encodeAwarenessUpdate(doc.awareness, Array.from(awarenessStates.keys())));
            messenger_2.send(doc, conn, encoding.toUint8Array(encoder));
        }
    }
};

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
exports.messageListener = exports.send = void 0;
const syncProtocol = __importStar(require("y-protocols/sync"));
const encoding = __importStar(require("lib0/encoding"));
const decoding = __importStar(require("lib0/decoding"));
const awarenessProtocol = __importStar(require("y-protocols/awareness"));
const livecycle_1 = require("./livecycle");
const vars_1 = require("./vars");
exports.send = (doc, conn, message) => {
    // console.log(conn);
    if (conn.readyState !== vars_1.wsReadyStateConnecting && conn.readyState !== vars_1.wsReadyStateOpen) {
        livecycle_1.closeConn(doc, conn);
    }
    try {
        conn.send(message, (err) => {
            err != null && livecycle_1.closeConn(doc, conn);
        });
    }
    catch (e) {
        livecycle_1.closeConn(doc, conn);
    }
};
exports.messageListener = (conn, doc, message) => {
    const encoder = encoding.createEncoder();
    const decoder = decoding.createDecoder(message);
    const messageType = decoding.readVarUint(decoder);
    switch (messageType) {
        case vars_1.messageSync:
            encoding.writeVarUint(encoder, vars_1.messageSync);
            //@ts-ignore
            syncProtocol.readSyncMessage(decoder, encoder, doc, null);
            if (encoding.length(encoder) > 1) {
                exports.send(doc, conn, encoding.toUint8Array(encoder));
            }
            break;
        case vars_1.messageAwareness: {
            awarenessProtocol.applyAwarenessUpdate(doc.awareness, decoding.readVarUint8Array(decoder), conn);
            break;
        }
    }
};
exports.default = exports.messageListener;

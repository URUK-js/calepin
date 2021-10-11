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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getYDoc = exports.WSSharedDoc = void 0;
const syncProtocol = __importStar(require("y-protocols/sync"));
const encoding = __importStar(require("lib0/encoding"));
const awarenessProtocol = __importStar(require("y-protocols/awareness"));
const initialDocument_1 = require("./initialDocument");
const yjs_1 = require("yjs");
const mutex = __importStar(require("lib0/mutex"));
// import { get, pub, set, sub } from "./redis";
const messenger_1 = require("./messenger");
// import { nanoid } from "./utils";
// import debounce from "lodash/debounce";
const vars_1 = require("./vars");
// const saveDoc = (doc: WSSharedDoc) => {
//   const encoded = Y.encodeStateAsUpdateV2(doc);
//   const state = Buffer.from(encoded).toString("base64");
// };
const updateHandler = (update, origin, doc) => {
    // pub.publishBuffer(doc.name, Buffer.from(update)); // do not await
    const encoder = encoding.createEncoder();
    encoding.writeVarUint(encoder, vars_1.messageSync);
    syncProtocol.writeUpdate(encoder, update);
    const message = encoding.toUint8Array(encoder);
    doc.conns.forEach((_, conn) => (0, messenger_1.send)(doc, conn, message));
};
class WSSharedDoc extends yjs_1.Doc {
    constructor(name) {
        super({ gc: vars_1.gcEnabled });
        this.name = name;
        this.mux = mutex.createMutex();
        this.conns = new Map();
        //@ts-ignore
        this.awareness = new awarenessProtocol.Awareness(this);
        this.awareness.setLocalState(null);
        this.mount = false;
        const awarenessChangeHandler = ({ added, updated, removed }, conn) => {
            const changedClients = added.concat(updated, removed);
            if (conn !== null) {
                const connControlledIDs = /** @type {Set<number>} */ this.conns.get(conn);
                if (connControlledIDs !== undefined) {
                    added.forEach((clientID) => {
                        connControlledIDs.add(clientID);
                    });
                    removed.forEach((clientID) => {
                        connControlledIDs.delete(clientID);
                    });
                }
            }
            // broadcast awareness update
            const encoder = encoding.createEncoder();
            encoding.writeVarUint(encoder, vars_1.messageAwareness);
            encoding.writeVarUint8Array(encoder, awarenessProtocol.encodeAwarenessUpdate(this.awareness, changedClients));
            const buff = encoding.toUint8Array(encoder);
            this.conns.forEach((_, c) => {
                (0, messenger_1.send)(this, c, buff);
            });
            if (!this.mount) {
                this.mount = true;
                const array = this.getArray("children");
                array.insert(0, [
                    {
                        type: "heading",
                        content: [{ text: "Lorem ipsum dolor sit amet consectetur adipisicing elit" }]
                    },
                    {
                        type: "paragraph",
                        content: [{ text: "Lorem ipsum dolor sit amet consectetur adipisicing elit" }],
                        children: []
                    },
                    {
                        type: "paragraph",
                        content: [{ text: "Lorem ipsum dolor sit amet consectetur adipisicing elit" }],
                        children: []
                    },
                    {
                        type: "paragraph",
                        content: [{ text: "Lorem ipsum dolor sit amet consectetur adipisicing elit" }],
                        children: []
                    }
                ].map(initialDocument_1.getChildren));
            }
        };
        this.awareness.on("update", awarenessChangeHandler);
        this.on("update", updateHandler);
        // sub.subscribe(this.name).then(() => {
        //   sub.on("messageBuffer", (channel: string, update: ArrayBuffer) => {
        //     if (channel.toString() !== this.name) {
        //       return;
        //     }
        //     // update is a Buffer, Buffer is a subclass of Uint8Array, update can be applied
        //     // as an update directly
        //     //@ts-ignore
        //     Y.applyUpdate(this, update, sub);
        //   });
        // });
        this.on("update", () => {
            // saveDoc(this);
        });
        // this.on("update", this.debounceSave);
    }
    // debounceSave = debounce(save, 25000, { maxWait: 25000, trailing: true });
    destroy() {
        // this.debounceSave.cancel();
        // this.off("update", this.debounceSave);
        // save(null, null, this);
        super.destroy();
        // sub.unsubscribe(this.name);
    }
}
exports.WSSharedDoc = WSSharedDoc;
const getYDoc = (docname, gc = true) => {
    let memoryDoc = vars_1.docs.get(docname);
    console.log("getYDoc");
    if (memoryDoc === undefined) {
        const doc = new WSSharedDoc(docname);
        doc.gc = gc;
        vars_1.docs.set(docname, doc);
        return doc;
    }
    else {
        return memoryDoc;
    }
};
exports.getYDoc = getYDoc;

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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getYDoc = exports.WSSharedDoc = void 0;
const syncProtocol = __importStar(require("y-protocols/sync"));
const encoding = __importStar(require("lib0/encoding"));
const awarenessProtocol = __importStar(require("y-protocols/awareness"));
const yjs_1 = require("yjs");
const mutex = __importStar(require("lib0/mutex"));
// import { get, pub, set, sub } from "./redis";
const messenger_1 = require("./messenger");
const debounce_1 = __importDefault(require("lodash/debounce"));
const vars_1 = require("./vars");
const custom_1 = require("../custom");
const updateHandler = (update, origin, doc) => {
    // pub.publishBuffer(doc.name, Buffer.from(update)); // do not await
    const encoder = encoding.createEncoder();
    encoding.writeVarUint(encoder, vars_1.messageSync);
    syncProtocol.writeUpdate(encoder, update);
    const message = encoding.toUint8Array(encoder);
    doc.conns.forEach((_, conn) => messenger_1.send(doc, conn, message));
};
class WSSharedDoc extends yjs_1.Doc {
    constructor(name) {
        super({ gc: vars_1.gcEnabled });
        this.debounceSave = debounce_1.default(custom_1.onDebouncedSave, vars_1.CALLBACK_DEBOUNCE_WAIT, {
            maxWait: vars_1.CALLBACK_DEBOUNCE_MAXWAIT,
            trailing: true
        });
        this.name = name;
        this.mux = mutex.createMutex();
        this.conns = new Map();
        //@ts-ignore
        this.awareness = new awarenessProtocol.Awareness(this);
        this.awareness.setLocalState(null);
        this.mount = false;
        if (!this.mount) {
            this.mount = true;
            console.log("this mount");
            const array = this.getArray("children");
            array.insert(0, custom_1.emptyValue());
        }
        else {
        }
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
                messenger_1.send(this, c, buff);
            });
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
        this.on("update", this.debounceSave);
    }
    destroy() {
        this.debounceSave.cancel();
        this.off("update", this.debounceSave);
        custom_1.onDebouncedSave(null, null, this);
        super.destroy();
        // sub.unsubscribe(this.name);
    }
}
exports.WSSharedDoc = WSSharedDoc;
exports.getYDoc = (docname, gc = true) => {
    let memoryDoc = vars_1.docs.get(docname);
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

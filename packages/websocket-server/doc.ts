import * as syncProtocol from "y-protocols/sync";
import * as encoding from "lib0/encoding";
import * as awarenessProtocol from "y-protocols/awareness";

import { getChildren } from "./initialDocument";
import { Doc } from "yjs";
import * as mutex from "lib0/mutex";
// import { get, pub, set, sub } from "./redis";
import { send } from "./messenger";
// import { nanoid } from "./utils";
// import debounce from "lodash/debounce";

import {
  messageSync,
  messageAwareness,
  gcEnabled,
  docs,
  CALLBACK_DEBOUNCE_WAIT,
  CALLBACK_DEBOUNCE_MAXWAIT
} from "./vars";

// const saveDoc = (doc: WSSharedDoc) => {
//   const encoded = Y.encodeStateAsUpdateV2(doc);
//   const state = Buffer.from(encoded).toString("base64");
// };

const updateHandler = (update: Uint8Array, origin: any, doc: WSSharedDoc) => {
  // pub.publishBuffer(doc.name, Buffer.from(update)); // do not await

  const encoder = encoding.createEncoder();
  encoding.writeVarUint(encoder, messageSync);
  syncProtocol.writeUpdate(encoder, update);
  const message = encoding.toUint8Array(encoder);
  doc.conns.forEach((_, conn) => send(doc, conn, message));
};

interface Changes {
  added: Array<number>;
  updated: Array<number>;
  removed: Array<number>;
}
export class WSSharedDoc extends Doc {
  name: string;
  mux: any;
  mount: boolean;
  conns: Map<Object, Set<number>>;
  awareness: awarenessProtocol.Awareness;
  constructor(name: string) {
    super({ gc: gcEnabled });
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
      array.insert(
        0,
        [
          {
            type: "heading",
            content: [{ text: "Lorem ipsum dolor sit amet consectetur adipisicing elit" }]
          }
        ].map(getChildren)
      );
    } else {
    }
    const awarenessChangeHandler = ({ added, updated, removed }: Changes, conn: Object | null) => {
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
      encoding.writeVarUint(encoder, messageAwareness);
      encoding.writeVarUint8Array(encoder, awarenessProtocol.encodeAwarenessUpdate(this.awareness, changedClients));
      const buff = encoding.toUint8Array(encoder);
      this.conns.forEach((_, c) => {
        send(this, c, buff);
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

export const getYDoc = (docname: string, gc = true): any => {
  let memoryDoc = docs.get(docname);
  console.log("getYDoc");
  if (memoryDoc === undefined) {
    const doc = new WSSharedDoc(docname);
    doc.gc = gc;
    docs.set(docname, doc);
    return doc;
  } else {
    return memoryDoc;
  }
};

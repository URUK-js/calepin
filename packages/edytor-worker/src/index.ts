import * as Y from "yjs";
import * as awarenessProtocol from "y-protocols/awareness";
import * as mutex from "lib0/mutex";
import * as encoding from "lib0/encoding";
import { messageAwareness } from "./vars";
import { getChildren, DocFromJson } from "edytor/dist";
async function handleErrors(request: Request, func: any) {
  try {
    return await func();
  } catch (err) {
    if (request.headers.get("Upgrade") == "websocket") {
      //@ts-ignore
      let [client, server] = new WebSocketPair();
      server.accept();
      server.send(JSON.stringify({ error: err }));
      server.close(1011, "Uncaught exception during session setup");

      return new Response(null, {
        status: 101,
        webSocket: client
      } as any);
    } else {
      return new Response(String(err), { status: 500 });
    }
  }
}

export default {
  async fetch(request: Request, env: any) {
    return await handleErrors(request, async () => {
      return handleApiRequest(request, env);
    });
  }
};

async function handleApiRequest(request: Request, env: any) {
  const docName = request.url.slice(1).split("?")[0];
  let id = env.rooms.idFromName(docName);
  let roomObject = env.rooms.get(id);
  return roomObject.fetch(docName, request);
}

const getStartingDoc = () => {
  return [
    {
      type: "heading-1",
      content: [{ text: "Lorem ipsum dolor sit amet consectetur adipisicing elit" }]
    },
    {
      type: "paragraph",
      content: [
        {
          text:
            "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vel fugiat corrupti id accusantium fugit labore totam, vero quasi pariatur harum impedit distinctio nostrum error necessitatibus? Blanditiis cumque veritatis fugiat magnam!"
        }
      ]
    }
  ].map(getChildren);
};

export class Edytor {
  state: DurableObjectState;
  storage: DurableObjectStorage;
  env: any;
  sessions: any;
  lastTimestamp: any;
  doc: Y.Doc;
  mux: any;
  conns: any;
  awareness: any;

  constructor(state: DurableObjectState, env: any) {
    this.state = state;

    this.storage = state.storage;
    this.env = env;
    this.sessions = [];
    this.lastTimestamp = 0;
    this.doc = new Y.Doc();

    this.mux = mutex.createMutex();
    this.conns = new Map();
    this.awareness = new awarenessProtocol.Awareness(this.doc);
    this.awareness.setLocalState(null);

    const awarenessChangeHandler = ({ added, updated, removed }: any, conn: any) => {
      const changedClients = added.concat(updated, removed);
      if (conn !== null) {
        const connControlledIDs = /** @type {Set<number>} */ this.conns.get(conn);
        if (connControlledIDs !== undefined) {
          added.forEach((clientID: any) => {
            connControlledIDs.add(clientID);
          });
          removed.forEach((clientID: any) => {
            connControlledIDs.delete(clientID);
          });
        }
      }
      // broadcast awareness update
      const encoder = encoding.createEncoder();
      encoding.writeVarUint(encoder, messageAwareness);
      encoding.writeVarUint8Array(encoder, awarenessProtocol.encodeAwarenessUpdate(this.awareness, changedClients));
      const buff = encoding.toUint8Array(encoder);
      this.conns.forEach((_: any, c: any) => {
        c.send(this.doc, c, buff);
      });
    };

    // blockConcurrencyWhile
    this.state.waitUntil(
      new Promise<any>(async (res) => {
        let storedContent = (await this.storage.get("content")) as string | undefined;
        //@ts-ignore
        DocFromJson(storedContent ? JSON.parse(storedContent) : getStartingDoc(), this.doc);

        this.awareness.on("update", awarenessChangeHandler);
        this.doc.on("update", this.updateHandler);
        return res(true);
      })
    );
  }
  updateHandler = () => {};
  async fetch(docName: any, request: any) {
    return await handleErrors(request, async () => {
      if (request.headers.get("Upgrade") != "websocket") {
        return new Response("expected websocket", { status: 400 });
      }
      // @ts-ignore
      let [client, server] = new WebSocketPair();
      [client, server].forEach((ws: any) => (ws.binaryType = "arraybuffer"));
      await this.handleSession(server, docName);
      //@ts-ignore
      return new Response(null, { status: 101, webSocket: client });
    });
  }

  async handleSession(webSocket: any, docName: any) {
    // put pong here
    webSocket.accept();
    this.conns.set(webSocket, new Set());

    webSocket.addEventListener("message", async (msg: any) => {
      try {
        let data = JSON.parse(msg.data);
        data = { name: data.name, message: "" + data.message };
        //TO DO CHECK what is dataStg
        this.broadcast(data);
      } catch (err) {
        webSocket.send(JSON.stringify({ error: err }));
      }
    });

    let closeOrErrorHandler = () => {};
    webSocket.addEventListener("close", closeOrErrorHandler);
    webSocket.addEventListener("error", closeOrErrorHandler);
  }

  broadcast(message: any) {
    if (typeof message !== "string") {
      message = JSON.stringify(message);
    }
    this.sessions = this.sessions.filter((session: any) => {
      try {
        session.webSocket.send(message);
        return true;
      } catch (err) {
        return false;
      }
    });
  }
}

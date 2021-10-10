import { applyUpdateV2, Doc, encodeStateAsUpdateV2 } from "yjs";
import { WebsocketProvider } from "y-websocket";
import { EdytorDoc } from "../utils";

type WebrtcProviderOptions = {
  signaling: Array<string>;
  password: string | null;
  awareness: any;
  maxConns: number;
  filterBcConns: boolean;
  peerOpts: any;
};
export const createWSProvider = (doc: Doc, room = "hello", opts: WebrtcProviderOptions) => {
  const fakeDoc = new EdytorDoc();
  const provider = new WebsocketProvider("ws://localhost:1234", room, fakeDoc);
  provider.on("status", ({ status }) => {
    if (status === "connected") {
      const isEmpty = Array.from(provider.awareness.getStates().values()).length === 1;
      console.log(isEmpty, Array.from(provider.awareness.getStates().values()).length);
      provider.awareness.setLocalStateField("connected", true);
      if (isEmpty) {
        applyUpdateV2(fakeDoc, encodeStateAsUpdateV2(doc));
      }
    }
  });

  return provider.doc;
};

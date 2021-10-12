import { WebrtcProvider } from "y-webrtc";
import { Doc } from "yjs";
import { DocFromJson } from "../utils";

type WebrtcProviderOptions = {
  signaling: Array<string>;
  password: string | null;
  awareness: any;
  maxConns: number;
  filterBcConns: boolean;
  peerOpts: any;
};
export const createWebRtcProvider = (room = "hello", initialValue) => {
  return new Promise((res) => {
    const doc = new Doc();
    const provider = new WebrtcProvider(room, doc, { signaling: ["ws://localhost:4444"], password: "hello" });
    provider.connect();

    setTimeout(() => {
      const interval = setInterval(() => {
        console.log(provider?.connected, provider, provider.room.synced);
        if (provider?.connected) {
          console.log(
            Object.fromEntries(provider.awareness.getStates().entries()),
            provider.awareness.getStates().entries()
          );
          console.log(provider.awareness.states.size);
          if (provider.doc.getArray("children").length === 0 && provider.awareness.states.size === 1) {
            DocFromJson(initialValue, doc);
          }
          provider.awareness.setLocalStateField("user", { hello: "hello" });
          clearInterval(interval);
          return res(provider);
        }
      }, 1000);
    }, Math.floor(Math.random() * 100));
  });
};

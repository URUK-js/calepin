import { WebrtcProvider } from "./y-webrtc";
import { Doc } from "yjs";
import { DocFromJson } from "../utils";

export const createWebRtcProvider = (room = "hello", initialValue) => {
  return new Promise((res) => {
    const doc = new Doc();
    const prod = "wss://yjs-webrtc-production.up.railway.app";
    const provider = new WebrtcProvider(room, doc, {
      signaling: [prod],
      password: "hello",
      debug: true
    });

    setTimeout(() => {
      const interval = setInterval(() => {
        if (provider?.connected) {
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

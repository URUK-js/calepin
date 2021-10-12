import { WebrtcProvider } from "y-webrtc";
import { Doc } from "yjs";
import { DocFromJson } from "../utils";

export const createWebRtcProvider = (room = "hello", initialValue) => {
  return new Promise((res) => {
    const doc = new Doc();
    const provider = new WebrtcProvider(room, doc, {
      signaling: ["ws://yjs-webrtc-production.up.railway.app"],
      password: "hello"
    });
    provider.connect();

    setTimeout(() => {
      const interval = setInterval(() => {
        console.log(provider?.connected, provider, provider.room.synced);
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

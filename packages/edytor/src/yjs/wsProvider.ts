import { Doc } from "yjs";
import { WebsocketProvider } from "y-websocket";

export const createWSProvider = (room?) => {
  return new Promise((res) => {
    const doc = new Doc();
    const dev = "ws://localhost:1234";
    const prod = "ws://edytor-production.up.railway.app";
    const provider = new WebsocketProvider(process.env.NODE_ENV === "production" ? prod : dev, room || "edytor", doc, {
      connect: true
    });
    provider.on("status", ({ status }) => {
      if (status === "connected") {
        return res(provider);
      }
    });
  });
};

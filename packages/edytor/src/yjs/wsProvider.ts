import { Doc } from "..";
import { WebsocketProvider } from "y-websocket";

export const createWSProvider = (room?) => {
  return new Promise((res) => {
    const doc = new Doc();
    const dev = "ws://localhost:1234";
    const prod = "wss://edytor-production.up.railway.app";
    console.log(process.env.NODE_ENV);
    const provider = new WebsocketProvider(process.env.NODE_ENV === "production" ? prod : prod, room || "edytor", doc, {
      connect: true
    });
    provider.on("status", ({ status }) => {
      if (status === "connected") {
        return res(provider);
      }
    });
  });
};

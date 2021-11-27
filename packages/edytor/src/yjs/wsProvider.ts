import { Doc } from "..";
import { WebsocketProvider } from "y-websocket";

export const createWSProvider = (
  documentId: string,
  collaborativeServerEndpoint: string
): Promise<WebsocketProvider> => {
  return new Promise((res) => {
    const doc = new Doc();

    const provider = new WebsocketProvider(collaborativeServerEndpoint, documentId, doc, {
      connect: true
    });
    provider.on("status", ({ status }) => {
      if (status === "connected") {
        return res(provider);
      }
    });
  });
};

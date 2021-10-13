import WebSocket from "ws";
import { IncomingMessage } from "http";
import { getChildren } from "./server/initialDocument";
import { Doc } from "yjs/dist/src";

export const handleAuth = (ws: WebSocket, req: IncomingMessage, connect: () => void) => {
  // if(can connect) connect()
  connect();
};

export const emptyValue = () => {
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
    },
    {
      type: "paragraph",
      content: [
        {
          text:
            "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vel fugiat corrupti id accusantium fugit labore totam, vero quasi pariatur harum impedit distinctio nostrum error necessitatibus? Blanditiis cumque veritatis fugiat magnam!"
        }
      ]
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
export const onDebouncedSave = (update: any, origin: any, doc: Doc) => {
  // const encoded = Y.encodeStateAsUpdateV2(doc);
  // const state = Buffer.from(encoded).toString("base64");
  console.log("onDebouncedSave");
};

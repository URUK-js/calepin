"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onDebouncedSave = exports.emptyValue = exports.handleAuth = void 0;
const initialDocument_1 = require("./server/initialDocument");
exports.handleAuth = (ws, req, connect) => {
    // if(can connect) connect()
    connect();
};
exports.emptyValue = () => {
    return [
        {
            type: "heading",
            data: { level: 1 },
            content: [{ text: "Lorem ipsum dolor sit amet consectetur adipisicing elit" }]
        },
        {
            type: "paragraph",
            content: [
                {
                    text: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vel fugiat corrupti id accusantium fugit labore totam, vero quasi pariatur harum impedit distinctio nostrum error necessitatibus? Blanditiis cumque veritatis fugiat magnam!"
                }
            ]
        },
        {
            type: "paragraph",
            content: [
                {
                    text: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vel fugiat corrupti id accusantium fugit labore totam, vero quasi pariatur harum impedit distinctio nostrum error necessitatibus? Blanditiis cumque veritatis fugiat magnam!"
                }
            ]
        },
        {
            type: "paragraph",
            content: [
                {
                    text: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vel fugiat corrupti id accusantium fugit labore totam, vero quasi pariatur harum impedit distinctio nostrum error necessitatibus? Blanditiis cumque veritatis fugiat magnam!"
                }
            ]
        }
    ].map(initialDocument_1.getChildren);
};
exports.onDebouncedSave = (update, origin, doc) => {
    // const encoded = Y.encodeStateAsUpdateV2(doc);
    // const state = Buffer.from(encoded).toString("base64");
    console.log("onDebouncedSave");
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.callbackRequest = exports.callbackHandler = void 0;
const http = require("http");
const CALLBACK_URL = process.env.CALLBACK_URL ? new URL(process.env.CALLBACK_URL) : null;
const CALLBACK_TIMEOUT = (process.env.CALLBACK_TIMEOUT || 5000);
const CALLBACK_OBJECTS = process.env.CALLBACK_OBJECTS ? JSON.parse(process.env.CALLBACK_OBJECTS) : {};
exports.isCallbackSet = !!CALLBACK_URL;
const callbackHandler = (update, origin, doc) => {
    const room = doc.name;
    const dataToSend = {
        room: room,
        data: {}
    };
    const sharedObjectList = Object.keys(CALLBACK_OBJECTS);
    sharedObjectList.forEach((sharedObjectName) => {
        const sharedObjectType = CALLBACK_OBJECTS[sharedObjectName];
        dataToSend.data[sharedObjectName] = {
            type: sharedObjectType,
            //@ts-ignore
            content: getContent(sharedObjectName, sharedObjectType, doc).toJSON()
        };
    });
    (0, exports.callbackRequest)(CALLBACK_URL, CALLBACK_TIMEOUT, dataToSend);
};
exports.callbackHandler = callbackHandler;
//@ts-ignore
const callbackRequest = (url, timeout, data) => {
    data = JSON.stringify(data);
    const options = {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname,
        timeout: timeout,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Content-Length": data.length
        }
    };
    const req = http.request(options);
    req.on("timeout", () => {
        console.warn("Callback request timed out.");
        req.abort();
    });
    req.on("error", (e) => {
        console.error("Callback request error.", e);
        req.abort();
    });
    req.write(data);
    req.end();
};
exports.callbackRequest = callbackRequest;
const getContent = (objName, objType, doc) => {
    switch (objType) {
        case "Array":
            return doc.getArray(objName);
        case "Map":
            return doc.getMap(objName);
        case "Text":
            return doc.getText(objName);
        case "XmlFragment":
            return doc.getXmlFragment(objName);
        case "XmlElement":
            //@ts-ignore
            return doc.getXmlElement(objName);
    }
};

const http = require("http");
import { YArray, YMap, YText, YXmlElement, YXmlFragment } from "yjs/dist/src/internals";

const CALLBACK_URL = process.env.CALLBACK_URL ? new URL(process.env.CALLBACK_URL) : null;
const CALLBACK_TIMEOUT = (process.env.CALLBACK_TIMEOUT || 5000) as number;
const CALLBACK_OBJECTS = process.env.CALLBACK_OBJECTS ? JSON.parse(process.env.CALLBACK_OBJECTS) : {};

exports.isCallbackSet = !!CALLBACK_URL;

export const callbackHandler = (update: Uint8Array, origin: any, doc: any) => {
  const room = doc.name;
  const dataToSend = {
    room: room,
    data: {}
  } as any;
  const sharedObjectList = Object.keys(CALLBACK_OBJECTS);
  sharedObjectList.forEach((sharedObjectName) => {
    const sharedObjectType = CALLBACK_OBJECTS[sharedObjectName];
    dataToSend.data[sharedObjectName] = {
      type: sharedObjectType,
      //@ts-ignore
      content: getContent(sharedObjectName, sharedObjectType, doc).toJSON()
    };
  });
  callbackRequest(CALLBACK_URL as URL, CALLBACK_TIMEOUT, dataToSend);
};
//@ts-ignore
export const callbackRequest = (url: URL, timeout: number, data: Array) => {
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
  req.on("error", (e: any) => {
    console.error("Callback request error.", e);
    req.abort();
  });
  req.write(data);
  req.end();
};

const getContent = (
  objName: string,
  objType: string,
  doc: any
): YXmlElement | YArray<any> | YMap<any> | YText | YXmlFragment | undefined => {
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

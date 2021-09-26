import * as Y from "yjs";
import { YMap } from "yjs/dist/src/internals";
import { Block, Value } from "../types";

export const jsonNodeToYNode = (node: YMap<any>) => {
  const ydoc = new Y.Doc();
  const document = ydoc.getMap("node");
  getYNode(node, document);
  return ydoc.getMap("node");
};

export const getYNode = (node: any, ynode = new Y.Map()) => {
  Object.keys(node).forEach((key) => {
    if (node.children) {
      if (key !== "children") {
        ynode.set(key, node[key]);
      } else {
        ynode.set("children", Y.Array.from(node.children.map((n: any) => getYNode(n))));
      }
    } else {
      const text = new Y.Text(node.text);
      if (key !== "text") {
        ynode.set(key, true);
      }
      ynode.set("text", text);
    }
  });
  return ynode;
};

export const toYJS = (json: Value) => {
  const ydoc = new Y.Doc();
  const document = ydoc.getMap("document");

  getYNode(json, document);

  return ydoc;
};
export const toJSON = (doc: Y.Doc): Value => {
  return doc.getMap("document").toJSON();
};

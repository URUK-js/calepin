import { Doc } from "yjs";
import { YNode } from ".";
import { YLeaf } from "../..";
import { createLeaf } from "./yLeaf";
import { createNode } from "./yNode";
export interface jsonLeaf extends Record<string, any> {
  text: string;
  data?: object;
}
export type jsonNode = {
  type: string;
  content?: jsonLeaf[];
  data?: object;
  children?: jsonNode[];
};

export const getContent = (leaf: jsonLeaf): YLeaf => {
  return createLeaf(leaf);
};
export const getChildren = ({ type, content = [], children = [], ...props }: jsonNode): YNode => {
  return createNode(type, { ...props, children: children.map(getChildren), content: content.map(getContent) });
};
export class EdytorDoc extends Doc {
  constructor(value?: jsonNode[]) {
    super();
    if (value) {
    }
  }
}

export const DocFromJson = (value: jsonNode[], initialDoc?: Doc) => {
  const doc = initialDoc || new Doc();
  const array = doc.getArray("children");
  array.insert(0, value.map(getChildren));
  return doc;
};

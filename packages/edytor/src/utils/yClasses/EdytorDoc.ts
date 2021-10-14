import { Doc } from "yjs";
import { YNode } from ".";
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

export const getChildren = ({ type, content = [], children = [], ...props }: jsonNode): YNode => {
  return createNode(type, { ...props, children: children.map(getChildren), content: content.map(createLeaf) });
};
export class EdytorDoc extends Doc {}

export const DocFromJson = (value: jsonNode[], initialDoc?: Doc) => {
  const array = (initialDoc || new Doc()).getArray("children");
  array.insert(0, value.map(getChildren));
  return array.doc;
};

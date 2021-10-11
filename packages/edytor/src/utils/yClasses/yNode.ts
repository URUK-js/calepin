import { nanoid } from "..";
import { Map, Array } from "yjs";
import { YArray, YMap } from "yjs/dist/src/internals";
import { YLeaf } from "../../";
import { createLeaf } from "./yLeaf";

export type YNodeProps = {
  data?: any;
  content?: YLeaf[] | YArray<YLeaf>;
  children?: YNode[] | YArray<YNode>;
  id?: string;
};

export const createNode = (type: string, props?: YNodeProps): YMap<any> => {
  const node = new Map();
  node.set("id", props?.id || nanoid());
  node.set("type", type);
  if (props?.data) {
    node.set("data", new Map(Object.entries(props.data)));
  }
  node.set("content", props?.content instanceof Array ? props.content : Array.from(props?.content || [createLeaf()]));
  node.set("children", props?.children instanceof Array ? props.children : Array.from(props?.children || []));
  return node;
};

export class YNode extends Map<any> {}

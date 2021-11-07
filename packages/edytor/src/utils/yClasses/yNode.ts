import { nanoid, createLeaf } from "..";
import { Map, Array } from "yjs";
import { YNode, YNodeProps } from "../../types";

export const createNode = (type: string, props?: YNodeProps): YNode => {
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

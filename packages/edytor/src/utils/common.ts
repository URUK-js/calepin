import { customAlphabet } from "nanoid";
import { YMap } from "yjs/dist/src/internals";
export const nanoid = () => "y-" + customAlphabet("346789ABCDEFGHJKLMNPQRTUV-WXYabcdefghijkmnpqrtwxyz", 20)();

type YNode = YMap<any>;

export const getNode = (node): YNode => node?.parent?.parent as YNode;

export const getIndex = (node: YNode): number => {
  //this should be optimzed
  return node.parent.toArray().indexOf(node);
};

export const getPath = (node: YNode): number[] => {
  let p = [] as number[];
  let n = node;
  while (!!n) {
    p.push(getIndex(n));
    n = getNode(n);
  }
  return p.reverse();
};

export const getId = (node): string => node.get("id");

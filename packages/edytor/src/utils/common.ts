import { customAlphabet } from "nanoid";
import { YMap } from "yjs/dist/src/internals";
export const nanoid = () => "y-" + customAlphabet("346789ABCDEFGHJKLMNPQRTUV-WXYabcdefghijkmnpqrtwxyz", 20)();

type YNode = YMap<any>;

export const getNode = (node): YNode => node?.parent?.parent as YNode;

export const getIndex = (node: YNode): number => {
  let index = 0;
  let stop = false;
  let n = node.parent._start;
  while (n !== null && !stop) {
    if (n.countable && !n.deleted) {
      const c = n.content.getContent();
      for (let i = 0; i < c.length; i++) {
        if (c[i] === node) {
          stop = true;
          break;
        }
        index++;
      }
    }
    n = n.right;
  }
  return index;
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

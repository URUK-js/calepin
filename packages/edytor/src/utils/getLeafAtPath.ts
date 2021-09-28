import { YMap } from "yjs/dist/src/internals";

export const getLeafAtPath = (doc: YMap<any>, path: number[]): YMap<any> => {
  let node = doc;
  let leaf;
  for (let i = 0; i < path.length; i++) {
    const index = path[i];
    if (i === path.length - 1) {
      node.get("content").get(index);
    } else {
      leaf = node.get("children").get(index);
    }
  }
  return leaf;
};

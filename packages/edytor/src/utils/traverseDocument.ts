import { YArray, YMap, YText } from "yjs/dist/src/internals";
import { Block, Editor, Leaf, Position, EdytorSelection } from "../types";

type traverseOptions = {
  start?: number;
  end?: number;
};
export const traverseDocument = (
  editor: Editor | Pick<Editor, "toYJS">,
  cb: (isText: boolean, node: YMap<any>, path: number[]) => void,
  opts?: traverseOptions
) => {
  const traverse = (node: YMap<any>, path: number[]) => {
    if (node.has("text")) {
      cb(true, node, path);
    } else {
      cb(false, node, path);
      node
        .get("children")
        .toArray()
        .forEach((n: YMap<any>, i: number) => traverse(n, [...path, i]));
    }
  };

  const array = editor
    .toYJS()
    .get("children")
    .toArray() as YArray<any>;
  array
    .slice(opts?.start || 0, opts?.end || array.length)
    .forEach((node: YMap<Block | Leaf>, i: number) => traverse(node, [i + (opts?.start || 0)]));
};

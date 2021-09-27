import { YText } from "yjs/dist/src/internals";
import { Editor } from "../types";
import { traverseDocument } from "../utils";
import { removeEmptyText } from "./removeEmptyText";

export const deleteText = (editor: Editor | Pick<Editor, "toYJS" | "selection">, selection?) => {
  const { start, end, type, length } = selection || editor.selection();

  switch (type) {
    case "collapsed": {
      const isEmpty = start.leaf.length === 0;
      start.leaf.delete(start.offset, length || 1);
      isEmpty && start.offset === 0 && removeEmptyText(start.leaf);
      break;
    }
    case "singlenode": {
      start.leaf.delete(start.offset, length);
      console.log(start.leaf.length + 1);
      start.leaf.length === 0 && removeEmptyText(start.leaf);
      break;
    }
    case "multinodes":
      {
        const startPathString = start.path.join(",");
        const endPathString = end.path.join(",");
        traverseDocument(
          editor,
          (isText, branch, path) => {
            if (isText) {
              const leaf = branch.get("text") as YText;
              if (path.join(",") === startPathString) {
                leaf.delete(start.offset, leaf.length);
              } else if (path > start.path && path < end.path) {
                leaf.delete(0, leaf.length);
              } else if (path.join(",") === endPathString) {
                leaf.delete(0, end.offset);
              }
              if (leaf.length === 0) removeEmptyText(leaf);
            }
          },
          { start: start.path[0], end: end.path[0] + 1 }
        );
      }
      break;
  }
};

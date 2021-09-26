import { YText } from "yjs/dist/src/internals";
import { Editor } from "../types";
import { traverseDocument } from "../utils";
import { removeEmptyText } from "./removeEmptyText";

export const deleteText = (editor: Editor | Pick<Editor, "toYJS" | "selection">) => {
  const { start, end, type, length } = editor.selection();

  switch (type) {
    case "collapsed": {
      const isEmpty = start.leaf.length === 0;
      start.leaf.delete(start.offset, length || 1);
      isEmpty && start.offset === 0 && removeEmptyText(start.leaf);
      break;
    }
    case "singlenode": {
      start.leaf.delete(start.offset, length);
      start.leaf.length + 1 === 0 && removeEmptyText(start.leaf);
      break;
    }
    case "multinodes":
      {
        const startPathString = start.path.join(",");
        const endPathString = end.path.join(",");
        traverseDocument(
          editor,
          (isText, node, path) => {
            if (isText) {
              const yText = node.get("text") as YText;
              if (path.join(",") === startPathString) {
                yText.delete(start.offset, yText.length);
              } else if (path > start.path && path < end.path) {
                yText.delete(0, yText.length);
              } else if (path.join(",") === endPathString) {
                yText.delete(0, end.offset);
              }
              if (yText.length === 0) removeEmptyText(yText);
            }
          },
          { start: start.path[0], end: end.path[0] + 1 }
        );
      }
      break;
  }
};

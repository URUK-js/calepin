import { YText } from "yjs/dist/src/internals";
import { Editor, Position, EdytorSelection } from "../types";
import { traverseDocument } from "../utils";
import { removeEmptyText } from "./removeEmptyText";

export type insertTextOperation = {
  at?: Position;
  range?: EdytorSelection;
  text: string | null;
  yText?: YText;
};
export const insertText = (editor: Editor, { text }: insertTextOperation) => {
  if (!text || text === null || !text.length) return;

  const { start, end, type, length } = editor.selection();
  switch (type) {
    case "collapsed": {
      start.leaf.insert(start.offset, text);
      break;
    }
    case "singlenode": {
      start.leaf.delete(start.offset, length);
      start.leaf.insert(start.offset, text);
      break;
    }
    case "multinodes": {
      const startPathString = start.path.join(",");
      const endPathString = end.path.join(",");
      editor.doc().transact(() => {
        traverseDocument(
          editor,
          (isText, node, path) => {
            if (isText) {
              const yText = node.get("text") as YText;
              if (path.join(",") === startPathString) {
                yText.delete(start.offset, yText.length);
                yText.insert(start.offset, text);
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
      });
    }
  }
};

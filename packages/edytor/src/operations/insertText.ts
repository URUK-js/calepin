import { YText } from "yjs/dist/src/internals";
import { Editor, Position, EdytorSelection } from "../types";
import { YLeaf } from "../utils";

export type insertTextOperation = {
  at?: Position;
  range?: EdytorSelection;
  text: string | null;
  yText?: YText;
};
export const insertText = (editor: Editor, { text }: insertTextOperation) => {
  if (!text || text === null || !text.length) return;

  const { start, end, type, length } = editor.selection();
  if (type === "notInDoc") return console.error("Path is not in document space");
  console.log(editor.selection().type);
  switch (type) {
    case "collapsed": {
      start.leaf.insert(start.offset, text);
      break;
    }
    case "singlenode": {
      start.leaf.deleteText(start.offset, length);
      start.leaf.insert(start.offset, text);
      break;
    }
    case "multinodes": {
      const startPathString = start.path.join(",");
      const endPathString = end.path.join(",");
      editor.doc.transact(() => {
        editor.doc.traverse(
          (leaf, isText, path) => {
            if (isText) {
              const l = leaf as YLeaf;
              if (path.join(",") === startPathString) {
                l.deleteText(start.offset, l.length());
                l.insert(start.offset, text);
              } else if (path > start.path && path < end.path) {
                l.deleteText(0, l.length());
              } else if (path.join(",") === endPathString) {
                l.deleteText(0, end.offset);
              }
              // if (l.length() === 0) removeEmptyText(l);
            }
          },
          { start: start.path[0], end: end.path[0] + 1 }
        );
      });
    }
  }
};

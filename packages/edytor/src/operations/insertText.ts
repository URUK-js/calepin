import { YText } from "yjs/dist/src/internals";
import { Editor, Position, EdytorSelection } from "../types";
import { deleteLeafText, getPath, leafLength, LeavesHarvest, replaceLeafText, YLeaf } from "../utils";

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

  switch (type) {
    case "collapsed": {
      insertText;
      start.leaf.insert(start.offset, text);
      break;
    }
    case "singlenode": {
      replaceLeafText(start.leaf, start.offset, length, text);

      break;
    }
    case "multinodes": {
      const startPathString = start.path.join(",");
      const endPathString = end.path.join(",");
      editor.doc.transact(() => {
        const { reap, burn } = new LeavesHarvest();
        editor.doc.traverse(
          (leaf, isText) => {
            if (isText) {
              const path = getPath(leaf);
              if (path.join(",") === startPathString) {
                replaceLeafText(leaf, start.offset, leafLength(leaf), text);
                reap(leaf);
              } else if (path > start.path && path < end.path) {
                deleteLeafText(leaf, 0, leafLength(leaf));
                reap(leaf);
              } else if (path.join(",") === endPathString) {
                deleteLeafText(leaf, 0, end.offset);
                reap(leaf);
              }
            }
          },
          { start: start.path[0], end: end.path[0] + 1 }
        );
        burn();
      });
    }
  }
};

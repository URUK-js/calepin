import {
  Editor,
  deleteLeafText,
  getPath,
  insertTextInLeaf,
  leafLength,
  LeavesHarvest,
  replaceLeafText,
  traverse
} from "..";

export type insertTextOperation = {
  text: string | null;
};
export const insertText = (editor: Editor, { text }: insertTextOperation) => {
  if (!text || text === null || !text.length) return;

  const { start, end, type, length, setPosition } = editor.selection;
  if (type === "notInDoc") return console.error("Path is not in document space");

  switch (type) {
    case "collapsed": {
      insertTextInLeaf(start.leaf, start.offset, text);
      setPosition(start.leaf.get("id"), { offset: start.offset + text.length });
      break;
    }
    case "singlenode": {
      replaceLeafText(start.leaf, start.offset, length, text);
      setPosition(start.leaf.get("id"), { offset: start.offset + text.length });
      break;
    }
    case "multileaves":
    case "multinodes": {
      const startPathString = start.path.join(",");
      const endPathString = end.path.join(",");
      editor.doc.transact(() => {
        const { reap, burn } = new LeavesHarvest();
        traverse(
          editor,
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
        burn(editor);
      });
      setPosition(start.leaf.get("id"), { offset: start.offset + text.length });
    }
  }
};

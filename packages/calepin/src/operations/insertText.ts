import { YText } from "yjs/dist/src/internals";
import { Editor, Position, Range } from "../types";
import { arePathsEquals, getTextLeave, traverseDocument } from "../utils";
import { deleteText } from "./deleteText";
import { removeEmptyText } from "./removeEmptyText";

export type insertTextOperation = {
  at?: Position;
  range?: Range;
  text: string | null;
  yText?: YText;
};
export const insertText = (editor: Editor, { at, range, text, yText }: insertTextOperation) => {
  if (!text || text === null || !text.length) return;

  const doc = editor.toYJS();
  if (!range && at) {
    const { path, offset } = at;
    if (!yText) yText = getTextLeave(doc, path);
    yText.insert(offset, text);
  } else if (range) {
    if (arePathsEquals(range.start.path, range.end.path)) {
      const rangeLength = Math.abs(range.start.offset - range.end.offset) || 1;
      const start = Math.min(range.start.offset, range.end.offset);
      if (!yText) yText = getTextLeave(doc, range.start.path);
      yText.delete(start, rangeLength);
      yText.insert(start, text);
    } else {
      const startPathString = range.start.path.join(",");
      const endPathString = range.end.path.join(",");
      editor.doc().transact(() => {
        traverseDocument(
          editor,
          (isText, node, path) => {
            if (isText) {
              const yText = node.get("text") as YText;
              if (path.join(",") === startPathString) {
                yText.delete(range.start.offset, yText.length);
                yText.insert(range.start.offset, text);
              } else if (path > range.start.path && path < range.end.path) {
                yText.delete(0, yText.length);
              } else if (path.join(",") === endPathString) {
                yText.delete(0, range.end.offset);
              }
              if (yText.length === 0) removeEmptyText(yText);
            }
          },
          { start: range.start.path[0], end: range.end.path[0] + 1 }
        );
      });
    }
  }
};

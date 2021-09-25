import { YText } from "yjs/dist/src/internals";
import { Editor, Position, Range } from "../types";
import { arePathsEquals, getTextLeave, traverseDocument } from "../utils";

export type deleteTextOperation = {
  at?: Position;
  range?: Range;
  length?: number;
  yText?: YText;
};
export const deleteText = (
  editor: Editor | Pick<Editor, "toYJS">,
  { at, range, length, yText }: deleteTextOperation
) => {
  console.log({ at, range, length, yText });
  if (!length && range) length = Math.abs(range.start.offset - range.end.offset);
  if (!length || length === null || length === 0) return;

  const doc = editor.toYJS();
  if (!range && at) {
    const { path, offset } = at;
    if (!yText) yText = getTextLeave(doc, path);
    yText.delete(offset, length);
  } else if (range) {
    if (arePathsEquals(range.start.path, range.end.path)) {
      const rangeLength = Math.abs(range.start.offset - range.end.offset) || 1;
      const start = Math.min(range.start.offset, range.end.offset);
      if (!yText) yText = getTextLeave(doc, range.start.path);
      yText.delete(start, rangeLength);
    } else {
      const startPathString = range.start.path.join(",");
      const endPathString = range.end.path.join(",");
      traverseDocument(
        editor,
        (isText, node, path) => {
          if (isText) {
            const yText = node.get("text") as YText;
            if (path.join(",") === startPathString) {
              yText.delete(range.start.offset, yText.length);
            } else if (path > range.start.path && path < range.end.path) {
              yText.delete(0, yText.length);
            } else if (path.join(",") === endPathString) {
              yText.delete(0, range.end.offset);
            }
          }
        },
        { start: range.start.path[0], end: range.end.path[0] + 1 }
      );
    }
  }
};

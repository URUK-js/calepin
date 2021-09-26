import { YText } from "yjs/dist/src/internals";
import { Editor, Position, Range } from "../types";
import { arePathsEquals, getTextLeave, traverseDocument } from "../utils";
import { removeEmptyText } from "./removeEmptyText";

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
  if (!length && range) length = range.length || Math.abs(range.start.offset - range.end.offset);
  if (!length || length === null || length === 0) return;

  const doc = editor.toYJS();
  if (!range && at) {
    const { path, offset } = at;
    const isEmpty = yText.length === 0;
    if (!yText) yText = getTextLeave(doc, path);
    yText.delete(offset, length);

    console.log(isEmpty, yText.length, offset);
    isEmpty && offset === 0 && removeEmptyText(yText);
  } else if (range) {
    console.log(range, arePathsEquals(range.start.path, range.end.path));
    if (arePathsEquals(range.start.path, range.end.path)) {
      const start = range.start.offset;
      const rangeLength = range.end.offset - start;
      if (!yText) yText = getTextLeave(doc, range.start.path);
      yText.delete(start, rangeLength);
      yText.length + 1 === 0 && removeEmptyText(yText);
    } else {
      const startPathString = range.start.path.join(",");
      const endPathString = range.end.path.join(",");
      console.log({ start: range.start.path[0], end: range.end.path[0] + 1 });
      traverseDocument(
        editor,
        (isText, node, path) => {
          if (isText) {
            console.log("hello");
            const yText = node.get("text") as YText;
            if (path.join(",") === startPathString) {
              yText.delete(range.start.offset, yText.length);
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
    }
  }
};

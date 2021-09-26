import { YArray, YMap, YText } from "yjs/dist/src/internals";
import * as Y from "yjs";
import { Editor, Position, EdytorSelection } from "../types";
import { arePathsEquals, getTextLeave, traverseDocument } from "../utils";
import { mergeLeafs, splitLeaf } from ".";

export type formatTextOperation = {
  at?: Position;
  range?: EdytorSelection;
  format: string;
  yText?: YText;
};
export type formatAtEqualPathOperation = {
  range: EdytorSelection;
  format: string;
  yText: YText;
};

export const applyMarksFromParent = (parent: YMap<any>, leafs: YMap<any>[]) => {
  Array.from(parent.keys(), (key) => {
    if (key !== "text") {
      leafs.forEach((leaf) => {
        leaf.set(key, parent.get(key));
      });
    }
  });
};

export const formatAtEqualPath = ({ yText, format, range }: formatAtEqualPathOperation) => {
  const start = range.start.offset;
  const length = range.end.offset - range.start.offset;
  const parentObject = yText.parent as YMap<any>;
  const parentArray = parentObject?.parent as YArray<YMap<any>>;
  const content = yText.toString();
  const index = range.start.path.slice().reverse()[0] + 1;

  const isMarkActive = parentObject.has(format);
  const hasMarks = Array.from(parentObject.keys()).some((key) => key !== "text");

  if (isMarkActive && content.length === length) {
    parentObject.delete(format);
    return yText;
  } else {
    const remainingText = content.substring(range.end.offset, yText.length);
    if (remainingText.length == 0 && yText.length === range.end.offset - range.start.offset) {
      yText.parent.set(format, true);
      return yText;
    } else {
      yText.delete(start, yText.length);

      const formatedText = new Y.Text(content.substring(range.start.offset, range.end.offset));

      const formatedChildren = new Y.Map();
      formatedChildren.set("text", formatedText);
      formatedChildren.set(format, true);
      let newLeafs = [formatedChildren];

      if (remainingText.length > 0) {
        const nonFormatedText = new Y.Map();
        nonFormatedText.set("text", new Y.Text(remainingText));
        newLeafs.push(nonFormatedText);
      }

      applyMarksFromParent(parentObject, newLeafs, format);

      if (isMarkActive) {
        formatedChildren.delete(format);
      }
      newLeafs.length && parentArray.insert(index, newLeafs);
      return formatedText;
    }
  }
};

export const formatText = (
  editor: Editor | Pick<Editor, "toYJS">,
  { format, at, range, yText }: formatTextOperation
) => {
  console.log({ editor });
  const doc = editor.toYJS();
  let newPath = 0;
  doc.doc?.transact(() => {
    if (!range && at) {
      const { path, offset } = at;
      if (!yText) yText = getTextLeave(doc, path);
      const leaf = yText.parent as YMap<any>;
      const isMarkActive = leaf.has(format);
      console.log(isMarkActive && yText.length === 0);
      const parent = yText.parent?.parent as YArray<any>;

      if (isMarkActive && yText.length === 0) {
        leaf.delete(format);
        newPath = parent.toArray().indexOf(leaf);
      } else {
        if (yText.length === 0) {
          isMarkActive ? leaf.delete(format) : leaf.set(format, true);
        } else {
          splitLeaf(editor, { yText, at });

          const newChild = new Y.Map();
          newChild.set("text", new Y.Text(""));
          newChild.set(format, true);

          applyMarksFromParent(leaf, [newChild]);

          console.log(parent.toJSON());
          if (isMarkActive) {
            newChild.delete(format);
          }

          parent.insert(path.slice().reverse()[0] + 1, [newChild]);

          console.log(yText.toString(), newChild.toJSON());
          if (yText.length === 0) {
            parent.delete(path.slice().reverse()[0]);
          }
          newPath = parent.toArray().indexOf(newChild);
        }
      }
      mergeLeafs(editor, leaf.parent);
      return newPath;
    } else if (range) {
      if (arePathsEquals(range.start.path, range.end.path)) {
        if (!yText) yText = getTextLeave(doc, range.start.path);
        const newText = formatAtEqualPath({ yText, format, range });
        mergeLeafs(editor, yText.parent?.parent);
        newPath = newText.parent?.parent.toArray().indexOf(newText.parent);
      } else {
        traverseDocument(
          editor,
          (isText, node, path) => {
            if (isText) {
              const yText = node.get("text") as YText;
              const parent = yText.parent?.parent;
              if (path.join(",") === startPathString) {
                const newChildren = new Y.Map();
                const newText = new Y.Text(yText.toString().substring(range.start.offset, yText.length));
                newChildren.set("text", newText);
                newChildren.set(format, true);
                console.log(parent?._length);
                console.log(parent?.toJSON());
                parent.insert(path.slice().reverse()[0] + 1, [newChildren]);
                yText.delete(range.start.offset, yText.length);
              } else if (path > range.start.path && path < range.end.path) {
                // yText.delete(0, yText.length);
              } else if (path.join(",") === endPathString) {
                // yText.delete(0, range.end.offset);
              }
            }
          },
          { start: range.start.path[0], end: range.end.path[0] + 1 }
        );
      }
    }
  });
  return newPath;
};

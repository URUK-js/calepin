import * as Y from "yjs";
import { YArray, YMap, YText } from "yjs/dist/src/internals";
import { getYNode } from "../utils";
import { Editor, Position, EdytorSelection } from "../types";
import { getTextLeave } from "../utils";
import { deleteText, insertNode } from ".";

// type splitOperation = {
//   path: number[];
//   position: number;
// };

export type splitNodeOperation = {
  at: Position;
  range?: EdytorSelection;
  yText?: YText;
};
export const splitNode = (editor: Editor | Pick<Editor, "toYJS">, { at, range, yText }: splitNodeOperation) => {
  const doc = editor.toYJS();
  const [indexOfNode] = at?.path;
  const [indexOfText] = at?.path.slice().reverse();

  doc.doc?.transact(() => {
    if (range) {
      deleteText(editor, { at, range, yText });
    }

    const text = getTextLeave(doc, at.path);
    const rootArray = doc.get("children") as YArray<any>;
    const children = text.parent?.parent as YArray<any>;
    const parent = children.parent as YMap<any>;

    const rightNodes = children.toArray().filter((_, i) => i > indexOfText);
    const right = text?.toString()?.substring(at?.offset, text.length);

    if (indexOfText === 0 && at.offset === 0) {
      insertNode(doc, indexOfNode);
    } else if (right) {
      text.delete(at?.offset, right.length);
      const { text: _, ...props } = parent?.toJSON();
      const newNode = new Y.Map();
      rootArray.insert(indexOfNode + 1, [newNode]);
      getYNode(
        { ...props, children: [{ ...text.parent?.toJSON(), text: right }, ...rightNodes.map((x) => x.toJSON())] },
        newNode
      );

      children.delete(indexOfText + 1, rightNodes.length);
    } else {
      insertNode(doc, indexOfNode + 1);
    }
  });
  return indexOfNode + (indexOfText === 0 && at.offset === 0 ? 0 : 1);
};

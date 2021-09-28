import * as Y from "yjs";
import { YText, YArray, YMap } from "yjs/dist/src/internals";
import { Editor, Position } from "../types";
import { getTextLeave } from "../utils";
import { applyMarksFromParent } from ".";

type splitLeafOperation = {
  yText: YText;
  at: Position;
};
export const splitLeaf = (editor: Editor | Pick<Editor, "toYJS">, { yText, at }: splitLeafOperation) => {
  if (!yText) yText = getTextLeave(editor.toYJS(), at.path);
  const content = yText.toString();

  const rightText = content.substring(at.offset, yText.length);
  if (at.offset === yText.length) return;
  const newText = new Y.Text(rightText);
  const newLeave = new Y.Map();
  newLeave.set("text", newText);
  applyMarksFromParent(yText.parent as YMap<any>, [newLeave]);

  const parent = yText?.parent?.parent as YArray<any>;
  yText.delete(at.offset, yText.length);
  parent.insert(at.path.slice().reverse()[0] + 1, [newLeave]);
};

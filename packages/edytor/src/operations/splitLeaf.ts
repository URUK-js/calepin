import { Editor } from "../types";
import { createLeaf, deleteLeafText, leafNodeContent, leafString } from "../utils";
export const splitLeaf = (editor: Editor) => {
  const {
    start: { leaf, leafIndex, offset }
  } = editor.selection;
  const content = leafString(leaf);
  const rightText = content.substring(offset, content.length);
  if (offset === content.length) return;
  deleteLeafText(leaf, offset, rightText.length);
  leafNodeContent(leaf).insert(leafIndex + 1, [createLeaf({ ...leaf.toJSON(), text: rightText, id: undefined })]);
};

import { YNode } from "edytor/src";
import { useEditor } from "../hooks";
export const renderHandle = (node: YNode) => {
  const editor = useEditor();
  return (
    editor.renderHandle &&
    editor.renderHandle({
      node,
      attributes: {
        "data-edytor-handle": "true",
        contentEditable: false,
        draggable: true,
        onDragStart: [editor.dropper.startDrag, [editor, node]]
      }
    })
  );
};

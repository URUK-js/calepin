import { createSignal } from "solid-js";
import { onMouseMove } from "edytor";
import { useEditor } from "../hooks";

export const renderHandle = (node) => {
  // const [dragging, setDragging] = createSignal();
  const editor = useEditor();
  return (
    <div
      data-edytor-handle
      className={` z-10  absolute top-0  select-none`}
      contentEditable={false}
      draggable={true}
      onDragStart={[editor.dropper.startDrag, [editor, node]]}
      style={{ left: "-40px" }}
    >
      °°°
    </div>
  );
};

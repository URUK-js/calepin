import { createSignal } from "solid-js";
import { onMouseMove } from "edytor";
import { useEditor } from "../hooks";
import { getPath } from "edytor/src";
export const renderHandle = (node) => {
  const [dragging, setDragging] = createSignal();
  const editor = useEditor();

  const mouseMove = (e: MouseEvent) => {
    editor.dropper.setDropPath(onMouseMove(editor, e));
  };
  const dragEnd = () => {
    const element = document.getElementById(node.get("id")) as HTMLElement;
    if (element) element.style.opacity = "1";

    document.body.style.cursor = "auto";
    document.removeEventListener("mousemove", mouseMove);
    document.removeEventListener("mouseup", dragEnd);

    editor.dropper.moveNode(editor);
    setDragging(false);
  };
  return (
    <div
      className={` active:cursor-move absolute top-0  select-none`}
      contentEditable={false}
      draggable={true}
      onDragStart={(e: DragEvent) => {
        setDragging(true);
        const element = document.getElementById(node.get("id")) as HTMLElement;
        element.style.opacity = "0.4";
        document.body.style.cursor = "grabbing";

        editor.dropper.setStartPath(getPath(node));
        e.dataTransfer?.setDragImage(element, e.offsetX, e.offsetY);
        document.addEventListener("mousemove", mouseMove);
        document.addEventListener("mouseup", dragEnd);
      }}
      style={{ left: "-40px" }}
    >
      °°°
    </div>
  );
};

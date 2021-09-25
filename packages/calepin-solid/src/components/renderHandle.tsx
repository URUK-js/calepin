import { createSignal } from "solid-js";

export const renderHandle = ({ path, node }) => {
  const [dragging, setDragging] = createSignal();
  return (
    <div
      className={`absolute top-0 cursor-move select-none ${dragging() ? "opacity-0" : "opacity-100"}`}
      contentEditable={false}
      draggable={true}
      onDragStart={(e: DragEvent) => {
        setDragging(true);
        const element = document.querySelector(
          `[data-calepin-block][data-calepin-path="${path().join(",")}"]`
        ) as HTMLElement;
        element.style.opacity = "0.4";
        console.log(element);
        console.log({ element });
        e.dataTransfer?.setDragImage(element, e.offsetX, e.offsetY);
      }}
      onDragEnd={() => {
        const element = document.querySelector(
          `[data-calepin-block][data-calepin-path="${path().join(",")}"]`
        ) as HTMLElement;
        element.style.opacity = "1";
        setDragging(false);
      }}
      style={{ left: "-40px" }}
    >
      °°°
    </div>
  );
};

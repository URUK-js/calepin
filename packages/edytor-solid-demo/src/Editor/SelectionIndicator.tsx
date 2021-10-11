import { useSelectionChange } from "edytor-solid/src";

export const SelectionIndicator = () => {
  let currentNodeStart;
  let currentNodeEnd;

  useSelectionChange((selection) => {
    const indicator = document.getElementById("selectionIndicator");

    if (!indicator) return;
    if (selection.focused && selection?.start) {
      const height =
        selection.start.nodeHtml.clientHeight -
        Array.from(selection.start.nodeHtml.childNodes).reduce((acc, node) => {
          return acc + node.hasAttribute ? (node.hasAttribute("data-edytor-element") ? node.clientHeight : 0) : 0;
        }, 0);

      const rectStart = selection.start.nodeHtml.getBoundingClientRect();
      const rectEnd = selection.end.nodeHtml.getBoundingClientRect();
      indicator.style.opacity = "0.9";
      indicator.style.top = rectStart.y + window.pageYOffset + "px";
      //   indicator.style.bottom = rectEnd.bottom +  "px";
      indicator.style.height = (selection.type === "multinodes" ? rectEnd.bottom - rectStart.top : height) + "px";

      indicator.style.left = Math.min(rectEnd.left, rectStart.left) - 4 + "px";

      indicator.style.width = Math.max(rectEnd.width, rectStart.width) + 8 + "px";
    } else {
      indicator.style.opacity = "0";
    }
  });
  return (
    <div id="selectionIndicator" className="z-0 bg-gray-100 rounded-sm absolute select-none " contentEditable={false} />
  );
};

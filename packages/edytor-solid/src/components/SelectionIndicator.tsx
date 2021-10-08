import { useSelectionChange } from "..";

export const SelectionIndicator = () => {
  useSelectionChange((selection) => {
    const indicator = document.getElementById("selectionIndicator");

    if (!indicator) return;
    if (selection.focused && selection?.start?.nodeRect) {
      indicator.style.opacity = "0.9";
      indicator.style.top = selection.start.nodeRect.top + "px";
      //   indicator.style.bottom = selection.end.nodeRect.bottom +  "px";
      indicator.style.height =
        (selection.type === "collapsed"
          ? selection.start.nodeRect.height -
            selection.start.nodeHtml.querySelector("[data-edytor-children]")?.clientHeight
          : selection.end.nodeRect.bottom - selection.start.nodeRect.top) + "px";

      indicator.style.left = Math.min(selection.end.nodeRect.left, selection.start.nodeRect.left) - 4 + "px";

      indicator.style.width = Math.max(selection.end.nodeRect.width, selection.start.nodeRect.width) + 8 + "px";
    } else {
      indicator.style.opacity = "0";
    }
  });

  return (
    <div id="selectionIndicator" className="z-0 bg-gray-100 rounded-sm absolute select-none " contentEditable={false} />
  );
};

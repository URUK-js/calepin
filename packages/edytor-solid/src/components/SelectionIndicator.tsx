import { EdytorSelection } from "edytor/src";
import { useSelectionChange } from "..";

export const SelectionIndicator = () => {
  let currentNodeStart;
  let currentNodeEnd;

  const hasChanged = (selection: EdytorSelection) => {
    const changed = currentNodeStart !== selection.start.nodeHtml || currentNodeEnd !== selection.end.nodeHtml;
    // currentMode !== selection.type;
    if (changed) {
      currentNodeStart = selection.start.nodeHtml;
      currentNodeEnd = selection.end.nodeHtml;
      // currentMode = selection.type;
    }
    return changed;
  };
  useSelectionChange((selection) => {
    const indicator = document.getElementById("selectionIndicator");

    if (!indicator) return;
    if (selection.focused && selection?.start) {
      if (!hasChanged(selection)) {
        indicator.style.height = selection.start.nodeHtml.clientHeight + "px";
      }

      const rectStart = selection.start.nodeHtml.getBoundingClientRect();
      const rectEnd = selection.end.nodeHtml.getBoundingClientRect();
      indicator.style.opacity = "0.9";
      indicator.style.top = rectStart.y + window.pageYOffset + "px";
      //   indicator.style.bottom = rectEnd.bottom +  "px";
      indicator.style.height =
        (selection.type !== "multinodes" ? rectStart.height : rectEnd.bottom - rectStart.top) + "px";

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

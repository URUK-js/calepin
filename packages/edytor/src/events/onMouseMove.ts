import { Editor } from "../types";
import { getPath, YNode } from "../utils";

type hoveredNode = {
  hoveredNode?: YNode | undefined;
  hoveredElement?: HTMLElement | undefined;
};

const getHoveredNode = (editor: Editor, target: HTMLElement): hoveredNode => {
  let hoveredNode;
  let element = target;
  let i = 0;
  while (!hoveredNode && element?.id !== editor.editorId && element && i < 100) {
    if (element.hasAttribute("data-edytor-block")) {
      hoveredNode = editor.ID_TO_NODE.get(element.id);
      break;
    }
    element = element.parentElement;
    i++;
  }
  if (!hoveredNode) return {};

  return { hoveredElement: element, hoveredNode };
};

export const onMouseMove = (editor: Editor, e: MouseEvent) => {
  const { hoveredElement, hoveredNode } = getHoveredNode(editor, e.target);
  const dndIndicator = document.getElementById("dndIndicator");

  if (!hoveredNode || !hoveredElement || !dndIndicator) return;
  const rectHovered = hoveredElement.getBoundingClientRect();
  const isOnTop = e.y < rectHovered.top + rectHovered.height / 2;
  const rect = rectHovered;
  const isNested = !isOnTop && e.x > rect.left + rect.width / 4;

  const top = isOnTop ? rect.top : rect.top + rect.height;
  const deltaX = isNested ? 30 : 0;

  dndIndicator.style.width = `${rect.width - deltaX}px`;
  dndIndicator.style.top = `${top}px`;
  dndIndicator.style.left = `${rect.left + deltaX}px`;

  let path = getPath(hoveredNode);
  let [index] = path.slice().reverse();

  index = index + (isOnTop ? 0 : 1);
  if (index === -1) index = 0;
  const dropData = {
    container: isNested ? hoveredNode.get("children") : path.length === 1 ? editor.doc.children : hoveredNode.parent,
    at: isNested ? 0 : index
  };

  dndIndicator.textContent = `${hoveredNode.get("id")} ${dropData.at}`;
  return dropData;
};

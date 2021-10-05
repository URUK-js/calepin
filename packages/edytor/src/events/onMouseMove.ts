import { Editor } from "../types";
import { getPath, YNode } from "../utils";

type hoveredNode = {
  hoveredNode?: YNode | undefined;
  hoveredElement?: HTMLElement | undefined;
  prevElement?: HTMLElement | undefined;
  prevNode?: YNode | undefined;
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

  const nodePath = getPath(hoveredNode);
  let prevNode;
  const getPrev = () => {
    let stop;
    editor.doc.traverse(
      (node, isText) => {
        if (!isText) {
          if (node === hoveredNode) {
            stop = true;
          } else if (!stop) {
            prevNode = node;
          }
        }
      },
      { start: nodePath.slice().reverse()[0] - 1, end: nodePath.slice().reverse()[0] + 1 }
    );
  };
  getPrev();
  const prevElement = prevNode && document.getElementById(prevNode.get("id"));

  return { hoveredElement: element, hoveredNode, prevElement, prevNode };
};

export const onMouseMove = (editor: Editor, e: MouseEvent) => {
  const { hoveredElement, hoveredNode, prevElement, prevNode } = getHoveredNode(editor, e.target);

  if (!hoveredNode || !hoveredElement) return;
  const rectHovered = hoveredElement.getBoundingClientRect();
  const rectPrev = prevElement?.getBoundingClientRect();
  const isOnTop = e.y < rectHovered.top + rectHovered.height / 2;
  const rect = isOnTop ? (prevElement ? rectPrev : rectHovered) : rectHovered;
  const isIncrement = e.x > rect.left + rect.width / 4;

  const top = prevElement ? rect.top + rect.height : isOnTop ? rect.top : rect.top + rect.height;
  const dndIndicator = document.getElementById("dndIndicator");
  const deltaX = isIncrement ? 30 : 0;

  dndIndicator.style.width = `${rect.width - deltaX}px`;
  dndIndicator.style.top = `${top}px`;
  dndIndicator.style.left = `${rect.left + deltaX}px`;

  let path = isOnTop ? (prevElement ? getPath(prevNode) : [0]) : getPath(hoveredNode);
  const [index, ...p] = path.slice().reverse();
  const newPath = [...p, index + 1];

  if (isIncrement) {
    path.push(0);
  }
  dndIndicator.textContent = path.toString();
  return path;
};

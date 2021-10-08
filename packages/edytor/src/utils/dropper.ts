import { moveNode } from "../operations";
import { EdytorSelection } from "../types";
import { getIndex, getPath } from "./common";
import { EdytorDoc } from "./yClasses";

export class Dropper {
  from;
  to;
  node;
  startPath;

  doc: EdytorDoc;
  editorId: string;
  ID_TO_NODE: Map<any, any>;
  selection: EdytorSelection;

  constructor(doc: EdytorDoc, editorId: string, ID_TO_NODE: Map<any, any>, selection: EdytorSelection) {
    this.doc = doc;
    this.editorId = editorId;
    this.selection = selection;
    this.ID_TO_NODE = ID_TO_NODE;
  }
  startDrag = (node, e: DragEvent) => {
    this.node = node;
    const dndIndicator = document.getElementById("dndIndicator");
    dndIndicator.style.opacity = "1";

    const element = document.getElementById(node.get("id")) as HTMLElement;
    element.style.opacity = "0.4";
    document.body.style.cursor = "grabbing";

    this.from = {
      container: node.parent,
      at: getIndex(node)
    };
    this.startPath = getPath(node);
    e.dataTransfer?.setDragImage(element, e.offsetX, e.offsetY);
    document.addEventListener("mousemove", this.onDrag);
    document.addEventListener("mouseup", this.dragEnd);
  };
  dragEnd = () => {
    const element = document.getElementById(this.node.get("id")) as HTMLElement;
    if (element) element.style.opacity = "1";
    document.body.style.cursor = "auto";
    document.removeEventListener("mousemove", this.onDrag);
    document.removeEventListener("mouseup", this.dragEnd);
    const id = moveNode({ from: this.from, to: this.to });
    const dndIndicator = document.getElementById("dndIndicator");
    dndIndicator.style.opacity = "0";
    setTimeout(() => {
      console.log(id);
      this.selection.setPosition(id, { offset: 0 });
    });
  };

  getHoveredNode = (target: HTMLElement) => {
    let hoveredNode;
    let element = target;
    let i = 0;
    while (!hoveredNode && element?.id !== this.editorId && element && i < 100) {
      if (element.hasAttribute("data-edytor-block")) {
        hoveredNode = this.ID_TO_NODE.get(element.id);
        break;
      }
      element = element.parentElement;
      i++;
    }
    if (!hoveredNode) return {};

    return { hoveredElement: element, hoveredNode };
  };
  onDrag = (e: MouseEvent) => {
    const { hoveredElement, hoveredNode } = this.getHoveredNode(e.target as HTMLElement);
    const dndIndicator = document.getElementById("dndIndicator");

    if (!hoveredNode || !hoveredElement || !dndIndicator || hoveredNode === this.node) return;
    const rectHovered = hoveredElement.getBoundingClientRect();
    const isOnTop = e.y < rectHovered.top + rectHovered.height / 2;
    const rect = rectHovered;
    const isNested = !isOnTop && e.x > rect.left + rect.width / 5;

    const top = isOnTop ? rect.top : rect.top + rect.height;
    const deltaX = isNested ? 30 : 0;

    let path = getPath(hoveredNode);

    let [index, ...startOfPath] = path.slice().reverse();

    if (this.startPath.join("") === startOfPath.join("")) {
      return;
      // this.to= undefined
    }

    dndIndicator.style.width = `${rect.width - deltaX}px`;
    dndIndicator.style.top = `${top + window.pageYOffset}px`;
    dndIndicator.style.left = `${rect.left + deltaX}px`;

    index = index + (isOnTop ? 0 : 1);
    if (index === -1) index = 0;
    this.to = {
      container: isNested ? hoveredNode.get("children") : path.length === 1 ? this.doc.children : hoveredNode.parent,
      at: isNested ? 0 : index
    };
  };
}

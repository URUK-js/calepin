import { Position } from "../..";
import { createAbsolutePositionFromRelativePosition } from "../../../../../node_modules/yjs/dist/src";
import { getIndex, getPath } from "../common";
import { leafLength, leafNode, leafNodeContentLength } from "../leaves";
import { YLeaf, YNode } from "../yClasses";

export class EdytorSelection {
  onSelectionChange?: (selection: EdytorSelection) => void;
  observers: ((selection: EdytorSelection) => void)[];
  container: HTMLDivElement;
  ID_TO_NODE: Map<any, any>;
  start: Position;
  end: Position;
  arePathsEquals: boolean;
  editorOffset: number;
  length: number;
  range?: Range;
  boundingRect?: DOMRect;
  edges: {
    startLeaf: boolean;
    startNode: boolean;
    endLeaf: boolean;
    endNode: boolean;
  };
  selection?: Selection;
  focused: boolean;
  type?: "multinodes" | "collapsed" | "singlenode" | "multileaves" | "notInDoc";
  constructor(ID_TO_NODE: Map<any, any>, onSelectionChange?: (selection: EdytorSelection) => void) {
    this.onSelectionChange = onSelectionChange;
    this.ID_TO_NODE = ID_TO_NODE;
  }
  init = (container) => {
    this.container = container;

    document.addEventListener("selectionchange", this.onSelection);
    this.container.addEventListener("focus", this.onFocus);
    this.container.addEventListener("blur", this.onBlur);
  };
  onFocus = () => {
    this.focused = true;
    this.onChange();
  };

  onBlur = () => {
    this.focused = false;
    this.onChange();
  };
  destroy = () => {
    document.removeEventListener("selectionchange", this.onSelection);
  };
  onSelection = (e: any) => {
    if (e.target?.activeElement === this.container) this.getRange();
  };
  observe = (observer) => {
    this.observers = this.observers ? this.observers.concat(observer) : [observer];
  };
  unobserve = (observer) => {
    this.observers = this.observers ? this.observers.filter((o) => o !== observer) : [];
  };

  getLeaf = (
    anchorNode: HTMLElement,
    current: "anchorNode" | "focusNode"
  ): [YLeaf | undefined, YNode | undefined, number[], HTMLElement | undefined] => {
    if (this[current] && this[current].node === anchorNode) {
      // serve cached result to avoid loops to getPath and node
      return this[current].value;
    }

    let leaf;
    let node = anchorNode;

    while (!leaf && node !== this.container && node) {
      leaf = this.ID_TO_NODE.get(node.id);
      if (!leaf) {
        node = node.parentElement;
      }
    }

    if (!leaf) return [undefined, undefined, undefined, undefined];
    const value = [leaf, leafNode(leaf), getPath(leaf), node];
    this[current] = { value, node: anchorNode };
    return value;
  };

  getNodeBoundingRect = (node: YNode): { nodeHtml: HTMLElement } => {
    const nodeHtml = this.container.querySelector(`#${node.get("id")}`) as HTMLElement;
    return { nodeHtml };
  };
  getRange = (): EdytorSelection => {
    const selection = window.getSelection();
    const { anchorNode, focusNode, anchorOffset, focusOffset, isCollapsed, rangeCount } = selection;

    if (focusNode === null) return;
    const [leaf1, node1, path1, leafHtml1] = this.getLeaf(anchorNode as HTMLElement, "anchorNode");
    const [leaf2, node2, path2, leafHtml2] = this.getLeaf(focusNode as HTMLElement, "focusNode");
    if (!leaf1) return;
    const equalPaths = path1.join("") === path2.join("");
    const isFollowing = equalPaths ? anchorOffset < focusOffset : path1.join() < path2.join();
    const range = rangeCount >= 1 ? selection?.getRangeAt(0) : undefined;

    this.start = {
      ...this.getNodeBoundingRect(isFollowing ? node1 : node2),
      node: isFollowing ? node1 : node2,
      leafId: (isFollowing ? leaf1 : leaf2).get("id"),
      leafIndex: isFollowing ? path1[path1.length - 1] : path2[path2.length - 1],
      nodeIndex: isFollowing ? path1[path1.length - 2] : path2[path2.length - 2],
      path: isFollowing ? path1 : path2,
      leafHtml: isFollowing ? leafHtml1 : leafHtml2,
      offset: isFollowing ? anchorOffset : focusOffset,
      leaf: isFollowing ? leaf1 : leaf2
    } as Position;

    this.end = isCollapsed
      ? this.start
      : {
          ...this.getNodeBoundingRect(!isFollowing ? node1 : node2),
          node: !isFollowing ? node1 : node2,
          leafId: (!isFollowing ? leaf1 : leaf2).get("id"),
          leafIndex: !isFollowing ? path1[path1.length - 1] : path2[path2.length - 1],
          nodeIndex: !isFollowing ? path1[path1.length - 2] : path2[path2.length - 2],
          path: !isFollowing ? path1 : path2,
          leafHtml: !isFollowing ? leafHtml1 : leafHtml2,
          offset: !isFollowing ? anchorOffset : focusOffset,
          leaf: !isFollowing ? leaf1 : leaf2
        };

    this.arePathsEquals = equalPaths;
    this.length = range && range.toString()?.length;
    this.range = range;
    this.selection = selection;
    this.edges = {
      startLeaf: this.start.offset === 0,
      startNode: this.start.offset === 0 && getIndex(this.start.leaf) === 0,
      endLeaf: this.end.offset === leafLength(this.end.leaf),
      endNode:
        this.end.offset === leafLength(this.end.leaf) &&
        getIndex(this.start.leaf) === leafNodeContentLength(this.end.leaf) - 1
    };
    this.type = isCollapsed
      ? "collapsed"
      : equalPaths
      ? "singlenode"
      : this.start.node === this.end.node
      ? "multileaves"
      : "multinodes";
    this.onChange();
  };

  onChange = () => {
    this.onSelectionChange && this.onSelectionChange(this);
    if (this.observers) {
      this.observers.forEach((o) => o(this));
    }
  };

  setPosition = (
    id: string,
    { offset, delta, end }: { offset?: number; delta?: number; end?: number; select?: boolean }
  ) => {
    let node = this.container.querySelector(`#${id}`) as ChildNode;
    console.log(node);
    while (node && node.nodeType !== 3 && node?.firstChild) {
      node = node.firstChild;
    }

    const pos = offset || this.start?.offset + delta;
    const hasRange = this.range || this.selection;
    if (!hasRange) {
      this.range = document.createRange();
      this.selection = window.getSelection();
    }
    this.range.setStart(node, pos);
    if (end) {
      this.range.setEnd(node, end);
    } else {
      this.range.collapse(true);
    }

    this.selection?.removeAllRanges();
    this.selection?.addRange(this.range);

    this.start = {
      ...this.start,
      leafHtml: this.container.querySelector(`#${id}`),
      offset: offset || this.start?.offset + delta
    };
  };
}

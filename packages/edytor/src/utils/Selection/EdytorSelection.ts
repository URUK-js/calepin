import { Position } from "../..";
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
  type?: "multinodes" | "collapsed" | "singlenode" | "notInDoc";
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

  getLeaf = (anchorNode: HTMLElement): [YLeaf | undefined, YNode | undefined, number[]] => {
    let leaf;
    let node = anchorNode;
    while (!leaf && node !== this.container && node) {
      leaf = this.ID_TO_NODE.get(node.id);
      node = node.parentElement;
    }
    if (!leaf) return [undefined, undefined, undefined];
    return [leaf, leafNode(leaf), getPath(leaf)];
  };

  getNodeBoundingRect = (node: YNode): { nodeRect: DOMRect; nodeHtml: HTMLElement } => {
    const nodeHtml = this.container.querySelector(`#${node.get("id")}`) as HTMLElement;
    return { nodeHtml, nodeRect: nodeHtml.getBoundingClientRect() };
  };
  getRange = (): EdytorSelection => {
    const selection = window.getSelection();
    const { anchorNode, focusNode, anchorOffset, focusOffset, isCollapsed, rangeCount } = selection;

    console.log(focusNode);
    if (focusNode === null) return;
    const [leaf1, node1, path1] = this.getLeaf(anchorNode as HTMLElement);
    const [leaf2, node2, path2] = this.getLeaf(focusNode as HTMLElement);
    if (!leaf1) return;
    const equalPaths = path1.join("") === path2.join("");
    const isFollowing = equalPaths ? anchorOffset < focusOffset : path1.join() < path2.join();
    const range = rangeCount >= 1 ? selection?.getRangeAt(0) : undefined;

    this.start = {
      ...this.getNodeBoundingRect(isFollowing ? node1 : node2),
      node: isFollowing ? node1 : node2,
      path: isFollowing ? path1 : path2,
      offset: isFollowing ? anchorOffset : focusOffset,
      leaf: isFollowing ? leaf1 : leaf2
    } as Position;

    this.end = isCollapsed
      ? this.start
      : {
          ...this.getNodeBoundingRect(!isFollowing ? node1 : node2),
          node: !isFollowing ? node1 : node2,
          path: !isFollowing ? path1 : path2,
          offset: !isFollowing ? anchorOffset : focusOffset,
          leaf: !isFollowing ? leaf1 : leaf2
        };

    this.arePathsEquals = equalPaths;
    this.length = range && range.toString()?.length;
    this.range = range;
    this.boundingRect = range && range.getBoundingClientRect();
    this.selection = selection;
    this.edges = {
      startLeaf: this.start.offset === 0,
      startNode: this.start.offset === 0 && getIndex(this.start.leaf) === 0,
      endLeaf: this.end.offset === leafLength(this.end.leaf),
      endNode:
        this.end.offset === leafLength(this.end.leaf) &&
        getIndex(this.start.leaf) === leafNodeContentLength(this.end.leaf) - 1
    };
    this.type = isCollapsed ? "collapsed" : equalPaths ? "singlenode" : "multinodes";
    this.onChange();
  };

  onChange = () => {
    this.onSelectionChange && this.onSelectionChange(this);
    if (this.observers) {
      this.observers.forEach((o) => o(this));
    }
    console.log(this.edges);
  };
}

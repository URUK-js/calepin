import { Array as YArray, Map as YMap, Doc, Text as YText } from "yjs";
import { Dropper, EdytorSelection, jsonNode } from "./utils";
import * as awarenessProtocol from "y-protocols/awareness";
export { Doc, YText, YArray };
export { EdytorSelection };
type Accessor<T> = () => T;

export class YNode extends YMap<any> {}
export type YNodeProps = {
  data?: any;
  content?: YLeaf[] | YArray<YLeaf>;
  children?: YNode[] | YArray<YNode>;
  id?: string;
};

export type YLeaf = YMap<any>;

export type YLeafProps = {
  data?: any;
  text?: string;
  id?: string;
};
export type EdytorArray = YArray<any>;
export type LeavesArray = YArray<YLeaf>;
export type NodesArray = YArray<YNode>;
export type dataEdytorType = "data-edytor-block" | "data-edytor-leave";
export type attributes = {
  id: string;
  "data-edytor-block"?: string;
  "data-edytor-element": "true";
  "data-edytor-leaf"?: string;
};
export type children = any;
export type block = Accessor<Record<any, any>>;
export type leaf = Accessor<Record<any, any>>;
export type stringLeaf = Accessor<string>;

export type renderLeafProps = {
  attributes: attributes;

  leaf: leaf;
  string: stringLeaf;
};
export type renderBlockProps = {
  attributes: attributes;
  children: children;
  block: block;
};
export type renderHandleProps = {
  attributes: {
    "data-edytor-handle": "true";
    contentEditable: false;
    onDragStart: any;
    draggable: boolean;
  };
  node: YNode;
};

interface HotKeys {
  operation: ((editor: Editor) => void) | "formatText" | "wrapInlines";
  keys: string;
  mark: Record<string, any>;
}
type DNDProps = {
  canNest?: (block: YMap<any>, path: number[]) => boolean;
  active: boolean;
  renderIndicator: () => any;
  onExternalDrop?: (files) => any;
  accept?: string[];
  afterDrop?: (editor: Editor, from, to) => void;
};
export interface EditorProps extends Record<any, any> {
  allowNesting: boolean;
  children: any;
  initialValue: {
    json?: jsonNode[];
    yarray?: YArray<any>;
  };
  dnd?: DNDProps;

  collaboration: {
    awarenessId?: string;
    awareness?: awarenessProtocol.Awareness;
    url: string;
    room: string;
    user?: {
      color?: string;
      name?: string;
      id?: string | number;
      picture?: string;
    };
  };
  onMount?: (editor: Editor) => void;
  leaves: Record<string, keyof HTMLElementTagNameMap> | Record<string, any>;
  blocks: Record<string, keyof HTMLElementTagNameMap> | Record<string, any>;
  defaultBlock?: string;
  spellcheck?: boolean;
  readOnly: boolean;
  className?: string;
  id?: string;
  hotkeys: HotKeys[];
  renderBefore?: () => any;
  renderAfter?: () => any;
  onChange?: (editor: Editor) => void;
}

export type EditorWithChildren = Pick<Editor, "children">;
export interface Editor {
  allowNesting: boolean;
  readOnly: boolean;
  editorId: string;
  defaultBlock: string;
  awareness?: awarenessProtocol.Awareness;
  dnd?: DNDProps;
  dropper: Dropper;
  hotkeys?: HotKeys[];
  selection: EdytorSelection;
  leaves: Record<string, keyof HTMLElementTagNameMap> | Record<string, any>;
  blocks: Record<string, keyof HTMLElementTagNameMap> | Record<string, any>;
  renderHandle: (({ node, attributes }: renderHandleProps) => any) | undefined;
  undoManager: any;
  editorRef: HTMLDivElement | undefined;
  doc: Doc;
  toRawText: () => string;
  toJSON: () => jsonNode[];
  ID_TO_NODE: Map<string, YMap<any>>;
  children: YArray<any>;
}

export interface Value {
  children: Block[];

  [key: string]: any;
}
export interface Leaf {
  text: string;
  [key: string]: any;
}
export interface Block {
  children: Block[] | Leaf[];
  type: string;
  [key: string]: any;
}

export type onBeforeInputData = [any, (editor: Editor) => void, Editor];

export type Position = {
  path: number[];
  node: YNode;
  leafId: string;
  nodeHtml: HTMLElement;
  nodeIndex: number;
  leafIndex: number;
  offset: number;
  leafHtml: HTMLElement;
  leaf: YLeaf;
};

export interface ContentTree {
  children: Node;
  [key: string]: any;
}
export type Node = Branch[] | Leaf[];

export interface Branch {
  children: Node;
  type: string;
  [key: string]: any;
}

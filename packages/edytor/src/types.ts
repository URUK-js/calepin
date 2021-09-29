import { UndoManager } from "yjs";
import { YArray, YMap, YText } from "yjs/dist/src/internals";
import { Cursor, EdytorDoc } from ".";
import { jsonNode, YLeaf } from "./utils";

type Accessor<T> = () => T;
export type dataEdytorType = "data-edytor-block" | "data-edytor-leave";
export type attributes = Accessor<{
  "data-edytor-path": number[];
  "data-edytor-block"?: boolean;
  "data-edytor-leaf"?: boolean;
}>;
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

interface HotKeys {
  operation: ((editor: Editor) => void) | "formatText" | "wrapInlines";
  keys: string;
  data: Record<any, any>;
}
export interface EditorProps extends Record<any, any> {
  value: jsonNode[];
  spellcheck?: boolean;
  className?: string;
  id?: string;
  hotkeys: HotKeys[];
  renderBefore?: () => any;
  renderAfter?: () => any;
  onChange?: (editor: Editor) => void;
  renderBlock?: ({ attributes, children, block }: renderBlockProps) => any;
  renderLeaf?: ({ attributes, string, leaf }: renderLeafProps) => any;
}

export interface Editor {
  hotkeys?: HotKeys[];
  selection: () => EdytorSelection | undefined;
  cursor: () => Cursor | undefined;
  renderBlock: ({ attributes, children, block }: renderBlockProps) => any;
  renderLeaf: ({ attributes, string, leaf }: renderLeafProps) => any;
  undoManager: UndoManager;
  editorRef: Accessor<HTMLDivElement | undefined>;
  toUpdate: () => Uint8Array;
  doc: EdytorDoc;
  config: YMap<any>;
  toJSON: () => Value;
  //

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
  node?: HTMLElement | Node;
  offset: number;
  leaf: YLeaf;
};
export type EdytorSelection = {
  start: Position;
  end: Position;
  arePathsEquals: boolean;
  editorOffset: number;
  length: number;
  range?: Range;
  boundingRect?: DOMRect;
  edges: {
    start: boolean;
    end: boolean;
  };
  selection?: Selection;
  type?: "multinodes" | "collapsed" | "singlenode" | "notInDoc";
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

import { UndoManager } from "yjs";
import { Doc, YMap, YText } from "yjs/dist/src/internals";
import { Cursor } from "./utils";

type Accessor<T> = () => T;
export type dataCalepinType = "data-calepin-block" | "data-calepin-leave";
export type attributes = Accessor<{
  "data-calepin-path": number[];
  "data-calepin-block"?: boolean;
  "data-calepin-leaf"?: boolean;
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

export interface EditorProps extends Record<any, any> {
  value: Value;
  spellcheck?: boolean;
  className?: string;
  id?: string;

  renderBefore?: () => any;
  renderAfter?: () => any;
  onChange?: (editor: Editor) => void;
  renderBlock?: ({ attributes, children, block }: renderBlockProps) => any;
  renderLeaf?: ({ attributes, string, leaf }: renderLeafProps) => any;
}

export interface Editor {
  selection: () => Range | undefined;
  cursor: () => Cursor | undefined;
  renderBlock: ({ attributes, children, block }: renderBlockProps) => any;
  renderLeaf: ({ attributes, string, leaf }: renderLeafProps) => any;
  undoManager: UndoManager;
  editorRef: Accessor<HTMLDivElement | undefined>;
  toUpdate: () => Uint8Array;
  doc: () => Doc;
  config: () => YMap<any>;
  toYJS: Accessor<YMap<any>>;
  toJSON: () => Value;
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
  leaf: YText;
};
export type Range = {
  start: Position;
  end: Position;
  arePathsEquals: boolean;
  length: number;
  domRange: {
    domRange: any;
    boundingRect: DOMRect;
  };
  selection: Selection;
  type?: "multinodes" | "singlenode";
};

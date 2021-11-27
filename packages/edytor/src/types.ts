import { Array as YArray, Map as YMap, Doc, Text as YText } from "yjs";
import { Dropper, EdytorSelection } from "./utils";
import * as awarenessProtocol from "y-protocols/awareness";
export { Doc, YText, YArray, YMap };
export { EdytorSelection };

type Accessor<T> = () => T;

export interface jsonLeaf extends Record<string, any> {
  text: string;
  data?: object;
}
export type jsonNode = {
  type: string;
  content?: jsonLeaf[];
  data?: object;
  children?: jsonNode[];
};

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

export type HotKeys =
  | {
      operation: "formatText";
      keys: string;
      mark: { [key: string]: boolean };
    }
  | {
      operation: (editor: Editor) => void;
      keys: string;
    }
  | {
      operation: "wrapInlines";
      keys: string;
      type: "string";
    };

export interface EditorProps extends Record<any, any> {
  /**
  allow user to nest node inside each other either by hitting tab or by drag end dropping them if dnd is active
  */
  allowNesting?: boolean;
  /**
  the initial value of the document.
  If the value is a an array of nodes, it will be converted to a Y Document. This usefull for storage and non collaborative editing.
  If the value is a Yarray we presume that the document is embed inside a preexistant Y Document that we will use a reference.
  */
  initialValue: jsonNode[] | YArray<any>;

  /**
  The current editor of the document
  */
  user: {
    color?: string;
    name?: string;
    id?: string | number;
    picture?: string;
  };
  collaboration?: {
    awarenessId?: string;
    awareness?: awarenessProtocol.Awareness;
    url: string;
    room: string;
  };
  /**
  A yjs awareness protocol in case the document is embeded inside another yjs document that you want to share awareness.
  */
  awareness?: awarenessProtocol.Awareness;
  /**
  The endpoint of your server in case the document is a collaborative one
  */
  collaborativeServerEndpoint?: string;
  /**
  Function triggered when the editor is ready.
  */
  onMount?: (editor: Editor) => void;
  /**
  An object that map all leaves types to components or an html tag to render
  */
  leaves?: Record<string, keyof HTMLElementTagNameMap> | Record<string, any>;
  /**
  An object that map all nodes types to components or an html tag to render
  */
  blocks?: Record<string, keyof HTMLElementTagNameMap> | Record<string, any>;
  /**
  The default block type that is inserted when document is entirely deleted or when hitting enter to split a node
  */
  defaultBlock?: string;
  spellcheck?: boolean;
  readOnly?: boolean;
  className?: string;
  /**
  The unique document identifier.
  This will be the id of the editor div.
  If collaboration is enabled this will be used to store awareness infos and as the room id.
  */
  documentId?: string;
  /**
  An array of key combinations defining custom action
  */
  hotkeys?: HotKeys[];
  /**
  A component to render inside the editor div
  */
  Inner?: ({ editor }: { editor: Editor }) => any;
  /**
  A component to render before the component div but inside the Editor context
  */
  Before?: ({ editor }: { editor: Editor }) => any;
  /**
  A component to render after the component div but inside the Editor context
  */
  After?: ({ editor }: { editor: Editor }) => any;
  renderHandle?: any;
  /**
  A component to render dnd indicator on file drop or node dnd.
  If this function is undefined the dnd behavior won't be activated both for node dnd of for file dnd
  */
  renderDndIndicator?: (props: { id: "dndIndicator"; contentEditable: false }) => any;
  /**
  An array of accepted mime types
  */
  accept?: string[];
  /**
  A function triggered on file drop.
  Defining this function will activate external file dropping.
  */
  onFileDrop?: (editor: Editor, files: File[], position) => void;
  onChange?: (editor: Editor) => void;
}

export type EditorWithChildren = Pick<Editor, "children">;
export interface Editor {
  allowNesting: boolean;
  readOnly: boolean;
  documentId: string;
  defaultBlock: string;
  awareness?: awarenessProtocol.Awareness;
  dropper: Dropper;
  hotkeys?: HotKeys[];
  selection: EdytorSelection;
  leaves: Record<string, keyof HTMLElementTagNameMap> | Record<string, any>;
  blocks: Record<string, keyof HTMLElementTagNameMap> | Record<string, any>;
  renderHandle: (({ node, attributes }: renderHandleProps) => any) | undefined;
  undoManager: any;
  editorRef: HTMLDivElement | undefined;
  doc: Doc;
  toString: (separtor?: string) => string;
  toJSON: () => jsonNode[];
  ID_TO_NODE: Map<string, YMap<any>>;
  children: YArray<any>;
  acceptedFileTypes?: string[];
  onFileDrop: (editor: Editor, files: File[], position) => void;
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

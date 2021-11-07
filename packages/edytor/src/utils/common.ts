import { customAlphabet } from "nanoid";

import {
  getNodeChildren,
  Doc,
  getNodeContent,
  nodeString,
  createNode,
  Editor,
  EditorWithChildren,
  YLeaf,
  YNode,
  EdytorArray,
  createLeaf,
  jsonNode
} from "..";

export const nanoid = () => "y-" + customAlphabet("346789ABCDEFGHJKLMNPQRTUV-WXYabcdefghijkmnpqrtwxyz", 20)();

export const getNode = (node): YNode => node?.parent?.parent as YNode;

export const getIndex = (node: YNode): number => {
  let index = 0;
  let stop = false;
  let n = node.parent._start;
  while (n !== null && !stop) {
    if (n.countable && !n.deleted) {
      const c = n.content.getContent();
      for (let i = 0; i < c.length; i++) {
        if (c[i] === node) {
          stop = true;
          break;
        }
        index++;
      }
    }
    n = n.right;
  }
  return index;
};

export const getPath = (node: YNode): number[] => {
  let p = [] as number[];
  let n = node;
  while (!!n) {
    p.push(getIndex(n));
    n = getNode(n);
  }
  return p.reverse();
};

export const getId = (node): string => node.get("id");

export const getLeafAtPath = (editor: Editor | EditorWithChildren, [start, ...path]: number[]): YLeaf => {
  let node = editor.children.get(start);
  let i = 0;
  while (i < path.length - 1) {
    const index = path[i];
    i++;
    node = node.get("children").get(index);
  }

  return node && node.get("content").get(path.slice().reverse()[0]);
};
export const getNodeAtPath = (editor: Editor, [start, ...path]: number[]): YNode => {
  let node = editor.children.get(start);
  for (let i = 0; i < path.length; i++) {
    const index = path[i];
    if (node.get) {
      node = node.get("children").get(index);
    } else {
      node = undefined;
    }
  }
  return node;
};
export const getContainerAtPath = (editor: Editor, path: number[]): EdytorArray => {
  if (path.length === 1) {
    return editor.children;
  } else {
    return getNodeAtPath(editor, path.slice(1, path.length)).get("children");
  }
};
export const traverse = (
  editor: Editor | EditorWithChildren,
  cb: (node: YNode, isText: boolean, path: number[]) => void,
  opts?: {
    start?: number;
    end?: number;
  }
) => {
  const t = (node: YNode | YLeaf, path: number[]) => {
    if (node.has("text")) {
      cb(node, true, path);
    } else {
      const array = getNodeContent(node)
        .toArray()
        //@ts-ignore
        .concat(getNodeChildren(node).toArray());
      cb(node, false, path);

      for (let i = 0; i < array.length; i++) {
        t(array[i], [...path.slice(0, path.length - 1), 0, i]);
      }
    }
  };
  const array = editor.children.toArray().slice(opts?.start || 0, opts?.end || editor.children.length) as YNode[];
  for (let i = 0; i < array.length; i++) {
    t(array[i], [i + (opts?.start || 0)]);
  }
};

export const toString = (editor: Editor | EditorWithChildren): string => {
  let t = "";
  const array = editor.children.toArray() as YNode[];
  for (let i = 0; i < array.length; i++) {
    t += nodeString(array[i]);
  }
  return t;
};

export const getChildren = ({ type, content = [], children = [], ...props }: jsonNode): YNode => {
  return createNode(type, { ...props, children: children.map(getChildren), content: content.map(createLeaf) });
};

export const DocFromJson = (value: jsonNode[], initialDoc?: Doc): Doc => {
  const array = (initialDoc || new Doc()).getArray("children");
  array.insert(0, value.map(getChildren));
  return array.doc;
};

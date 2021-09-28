import { Doc } from "yjs";
import { YArray, YMap } from "yjs/dist/src/internals";
import { YLeaf, YNode } from ".";

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

const getContent = ({ text, data, ...marks }: jsonLeaf): YLeaf => {
  return new YLeaf({ text, data, marks: Object.keys(marks) });
};
const getChildren = ({ type, content = [], children = [], ...props }: jsonNode): YNode => {
  return new YNode(type, { ...props, children: children.map(getChildren), content: content.map(getContent) });
};
export class EdytorDoc extends Doc {
  children: YArray<YNode>;
  constructor(value?: jsonNode[]) {
    super();
    if (value) {
      const array = this.getArray("children");
      array.insert(0, value.map(getChildren));
    }
    this.children = this.getArray("children");
  }
  getLeafAtPath = ([start, ...path]: number[]): YLeaf => {
    let node = this.children.get(start);
    let leaf;

    for (let i = 0; i < path.length; i++) {
      const index = path[i];

      if (!node?.get) {
        leaf = undefined;
        break;
      } else {
        if (i === path.length - 1) {
          leaf = node.get("content").get(index);
        } else {
          node = node.get("children").get(index);
        }
      }
    }
    return leaf;
  };
  getNodeAtPath = ([start, ...path]: number[]): YNode => {
    let node = this.children.get(start);

    for (let i = 0; i < path.length; i++) {
      const index = path[i];

      if (node.get) {
        node = node.get("children").get(index);
      } else {
        node = undefined;
        break;
      }
    }
    return node;
  };
  traverse = (
    cb: (node: YMap<any>, isText: boolean, path: number[]) => void,
    opts?: {
      start?: number;
      end?: number;
    }
  ) => {
    const traverse = (node: YMap<any>, path: number[]) => {
      if (node instanceof YLeaf) {
        cb(node, true, path);
      } else {
        cb(node, false, path);
        const array = node
          .get("content")
          .toArray()
          .concat(node.get("children").toArray());
        for (let i = 0; i < array.length; i++) {
          traverse(array[i], [...path, i]);
        }
      }
    };
    const array = this.children.toArray().slice(opts?.start || 0, opts?.end || this.children.length) as YNode[];
    for (let i = 0; i < array.length; i++) {
      traverse(array[i], [i + (opts?.start || 0)]);
    }
  };
  string = (): string => {
    let t = "";
    const array = this.children.toArray() as YNode[];
    for (let i = 0; i < array.length; i++) {
      t += array[i].string();
    }
    return t;
  };
}

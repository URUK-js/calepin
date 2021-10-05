import { Doc, encodeStateAsUpdateV2 } from "yjs";
import { YArray, YMap } from "yjs/dist/src/internals";
import { YLeaf, YNode } from ".";
import { getNodeContent, getNodeChildren } from "../nodes";

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

export const getContent = (leaf: jsonLeaf): YLeaf => {
  return new YLeaf(leaf);
};
export const getChildren = ({ type, content = [], children = [], ...props }: jsonNode): YNode => {
  return new YNode(type, { ...props, children: children.map(getChildren), content: content.map(getContent) });
};
export class EdytorDoc extends Doc {
  children: YArray<YNode>;
  config: YMap<any>;
  constructor(value?: jsonNode[]) {
    super();
    if (value) {
      const array = this.getArray("children");
      array.insert(0, value.map(getChildren));
    }
    this.config = this.getMap("config");
    this.children = this.getArray("children");
  }
  getLeafAtPath = ([start, ...path]: number[]): YLeaf => {
    let node = this.children.get(start);
    let i = 0;
    while (i < path.length - 1) {
      const index = path[i];
      i++;
      node = node.get("children").get(index);
    }

    return node && node.get("content").get(path.slice().reverse()[0]);
  };
  getNodeAtPath = ([start, ...path]: number[]): YNode => {
    let node = this.children.get(start);
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
  getContainerAtPath = (path: number[]): YArray<any> => {
    if (path.length === 1) {
      return this.children;
    } else {
      return this.getNodeAtPath(path.slice(1, path.length)).get("children");
    }
    // let container = this.children;
    // for (let i = 0; i < path.length; i++) {
    //   const index = path[i];
    //   if (container.toArray) {
    //     container = container.get(index).get("children");
    //   } else {
    //     container = undefined;
    //   }
    // }
    // return container;
  };
  traverse = (
    cb: (node: YMap<any>, isText: boolean, path: number[]) => void,
    opts?: {
      start?: number;
      end?: number;
    }
  ) => {
    const traverse = (node: YNode | YLeaf, path: number[]) => {
      if (node.has("text")) {
        cb(node, true, path);
      } else {
        console.log();
        const array = getNodeContent(node)
          .toArray()
          //@ts-ignore
          .concat(getNodeChildren(node).toArray());
        cb(node, false, path);

        for (let i = 0; i < array.length; i++) {
          traverse(array[i], [...path.slice(0, path.length - 1), 0, i]);
        }
      }
    };
    const array = this.children.toArray().slice(opts?.start || 0, opts?.end || this.children.length) as YNode[];
    for (let i = 0; i < array.length; i++) {
      traverse(array[i], [i + (opts?.start || 0)]);
    }
  };
  toJSON = () => {
    return {
      children: this.children.toJSON(),
      config: this.config.toJSON()
    };
  };
  toUpdate = () => {
    return encodeStateAsUpdateV2(this);
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

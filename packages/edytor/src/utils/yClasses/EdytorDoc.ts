import { Doc, encodeStateAsUpdateV2 } from "yjs";
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
    console.log(node && node.string());
    while (i < path.length - 1) {
      const index = path[i];
      console.log(index);
      i++;
      node = node.get("children").get(index);
    }

    const leaf = node && node.get("content").get(path.slice().reverse()[0]);
    console.log(leaf && leaf.string());

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
    const traverse = (node: YNode | YLeaf, path: number[]) => {
      if (node instanceof YLeaf) {
        console.log(path);
        // should be  [ 0, 0 ] [ 0, 1 ] [ 0, 2 ] [ 0, 0, 0 ] [ 0, 0, 1 ] [ 0, 0, 2 ]
        cb(node, true, path);
      } else {
        const array = node
          .content()
          .toArray()
          //@ts-ignore
          .concat(node.children().toArray());
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
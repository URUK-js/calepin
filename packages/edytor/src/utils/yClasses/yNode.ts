import { nanoid } from "..";
import { Map, Array } from "yjs";
import { YArray, YMap } from "yjs/dist/src/internals";
import { YLeaf } from ".";
import { EdytorDoc, getContent, getChildren } from "./EdytorDoc";
export type YNodeProps = {
  data?: any;
  content?: YLeaf[] | YArray<YLeaf>;
  children?: YNode[] | YArray<YNode>;
  id?: string;
};

export class YNode extends Map<any> {
  constructor(type: string, props?: YNodeProps) {
    super();

    this.set("id", props?.id || nanoid());
    this.set("type", type);
    if (props?.data) {
      this.set("data", new Map(Object.entries(props.data)));
    }
    this.set("content", props?.content instanceof Array ? props.content : Array.from(props?.content || [new YLeaf()]));
    this.set("children", props?.children instanceof Array ? props.children : Array.from(props?.children || []));
  }
  data = (): YMap<any> => this.get("data");
  content = (): YArray<YLeaf> => {
    if (!this.has("content")) this.set("content", new Array());

    return this.get("content");
  };
  children = (): YArray<YNode> => {
    if (!this.has("children")) this.set("children", new Array());
    return this.get("children");
  };
  id = (): string => this.get("id");
  node = (): YNode | undefined => this.parent.parent as YNode;
  setData = (data: object) => {
    if (this.has("data")) {
      Object.keys(data).forEach((key) => {
        this.data().set(key, data[key]);
      });
    } else {
      this.set("data", new Map(Object.entries(data)));
    }
  };
  string = (): string => {
    let t = "";
    const array = this.children()
      .toArray()
      //@ts-ignore
      .concat(this.content().toArray()) as (YNode | YLeaf)[];
    for (let i = 0; i < array.length; i++) {
      t += array[i].string();
    }
    return t;
  };
  isEmpty = (): boolean => {
    return this.isChildrenEmpty() && this.isContentEmpty();
  };
  isChildrenEmpty = (): boolean => {
    return this.children().length === 0;
  };
  isContentEmpty = (): boolean => {
    return this.content().length === 0;
  };
  index = (): number => {
    let i = 0;
    let n = this;
    while (n._item.left) {
      i++;
      n = n._item.left.content.type;
    }
    return i;
  };
  path = (): number[] => {
    let path = [] as number[];
    let n = this;
    while (n) {
      path.push(n.index());
      n = n.node();
    }
    return path.reverse();
  };
  delete = () => {
    if (this.isEmpty()) {
      //
    } else if (this.isChildrenEmpty()) {
    }
    const children = this.children().toJSON();
    const index = this.index();
    if (!this.isChildrenEmpty()) {
      this.parent.insert(
        index,
        children.map(({ type, ...props }) => new YNode(type, props))
      );
    }
    (this.parent as YArray<YNode>).delete(this.index());
    if (this.parent === (this.doc as EdytorDoc).children && (this.doc as EdytorDoc).children.length === 0) {
      (this.parent as YArray<YNode>).insert(0, [new YNode("paragraph", { content: [new YLeaf()] })]);
    }
  };
}

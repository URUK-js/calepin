import { nanoid } from "../nanoid";
import { Map, Array } from "yjs";
import { YArray, YMap } from "yjs/dist/src/internals";
import { YLeaf } from ".";
export type YNodeProps = {
  data?: any;
  content?: YLeaf[] | YArray<YLeaf>;
  children?: YNode[] | YArray<YNode>;
  id?: string;
};
export class YNode extends Map<any> {
  id: string;

  constructor(type: string, props?: YNodeProps) {
    super();
    new Map();
    this.set("id", props?.id || nanoid());
    this.set("type", type);
    if (props?.data) {
      this.set("data", new Map(Object.entries(props.data)));
    }
    this.set("content", props?.content instanceof Array ? props.content : Array.from(props?.content || []));
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
  node = (): YNode | undefined => this.parent.parent as YNode;
  setData = (data: object) => {
    console.log(data);
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
    console.log(this.parent);

    return this.parent.toArray().indexOf(this);
  };
  delete = () => {
    if (this.isEmpty()) {
      //
    } else if (this.isContentEmpty()) {
    } else if (this.isChildrenEmpty()) {
    }
    this.parent.delete(this.index());
    if (this.parent === this.doc.children && this.doc.children.length === 0) {
      this.parent.insert(0, [new YNode("paragraph", { content: [new YLeaf()] })]);
    }
  };
}
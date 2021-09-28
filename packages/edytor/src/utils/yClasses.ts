import { nanoid } from "./nanoid";
import * as Y from "yjs";
import { YArray, YMap, YText } from "yjs/dist/src/internals";

export type YNodeProps = {
  data?: any;
  content?: YLeaf[] | YArray<YLeaf>;
  children?: YNode[] | YArray<YNode>;
};

export type YLeafProps = {
  data?: any;
  text?: string;
  marks?: string[];
};

export class YNode extends Y.Map<any> {
  id: string;
  constructor(type: string, props?: YNodeProps) {
    super();
    new Y.Map();
    this.set("id", nanoid());
    this.set("type", type);
    this.set("data", new Y.Map(props?.data ? Object.entries(props.data) : []));
    this.set("content", props?.content instanceof Y.Array ? props.content : Y.Array.from(props?.content || []));
    this.set("children", props?.children instanceof Y.Array ? props.children : Y.Array.from(props?.children || []));
  }
  data = (): YMap<any> => this.get("data");
  content = (): YArray<YLeaf> => this.get("content");
  children = (): YArray<YNode> => this.get("children");
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
}

export class YLeaf extends Y.Map<any> {
  id: string;
  constructor(props?: YLeafProps) {
    super();
    this.id = nanoid();

    this.set("text", new Y.Text(props?.text || ""));

    if (props?.data) {
      this.set("data", new Y.Map(props?.data ? Object.entries(props.data) : []));
    }
    if (props?.marks) {
      props.marks.forEach((mark) => {
        this.set(mark, true);
      });
    }
  }

  data = (): YMap<any> => this.get("data");
  text = (): YText => this.get("text");
  string = (): string => this.get("text").toString();
}

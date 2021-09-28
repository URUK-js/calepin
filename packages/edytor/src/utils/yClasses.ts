import { nanoid } from "./nanoid";
import { Doc, Map, Text, Array } from "yjs";
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

interface jsonLeaf extends Record<string, any> {
  text: string;
  data?: object;
}
type jsonNode = {
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
  constructor(value?: jsonNode[]) {
    super();
    if (value) {
      const array = this.getArray("children");
      array.insert(0, value.map(getChildren));
    }
  }
}

export class YNode extends Map<any> {
  id: string;
  constructor(type: string, props?: YNodeProps) {
    super();
    new Map();
    this.set("id", nanoid());
    this.set("type", type);
    this.set("data", new Map(props?.data ? Object.entries(props.data) : []));
    this.set("content", props?.content instanceof Array ? props.content : Array.from(props?.content || []));
    this.set("children", props?.children instanceof Array ? props.children : Array.from(props?.children || []));
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

export class YLeaf extends Map<any> {
  id: string;
  constructor(props?: YLeafProps) {
    super();
    this.id = nanoid();

    this.set("text", new Text(props?.text || ""));

    if (props?.data) {
      this.set("data", new Map(props?.data ? Object.entries(props.data) : []));
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

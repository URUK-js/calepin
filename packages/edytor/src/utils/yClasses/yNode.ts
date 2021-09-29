import { nanoid } from "../nanoid";
import { Map, Array } from "yjs";
import { YArray, YMap } from "yjs/dist/src/internals";
import { YLeaf } from ".";
export type YNodeProps = {
  data?: any;
  content?: YLeaf[] | YArray<YLeaf>;
  children?: YNode[] | YArray<YNode>;
};
export class YNode extends Map<any> {
  id: string;
  constructor(type: string, props?: YNodeProps) {
    super();
    new Map();
    this.set("id", nanoid());
    this.set("type", type);
    if (props?.data) {
      this.set("data", new Map(Object.entries(props.data)));
    }
    this.set("content", props?.content instanceof Array ? props.content : Array.from(props?.content || []));
    this.set("children", props?.children instanceof Array ? props.children : Array.from(props?.children || []));
  }
  data = (): YMap<any> => this.get("data");
  content = (): YArray<YLeaf> => this.get("content");
  children = (): YArray<YNode> => this.get("children");
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
}

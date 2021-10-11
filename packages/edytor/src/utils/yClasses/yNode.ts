import { nanoid } from "..";
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
}

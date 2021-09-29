import { nanoid } from "../nanoid";
import { Map, Text } from "yjs";
import { YArray, YMap, YText } from "yjs/dist/src/internals";
import { YNode } from ".";

export type YLeafProps = {
  data?: any;
  text?: string;
  marks?: string[];
};

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
  length = (): number => this.text().length;
  setText = (text: string) => {
    const t = this.text();
    this.doc.transact(() => {
      t.delete(0, t.length);
      t.insert(0, text);
    });
  };
  string = (): string => this.get("text").toString();
  node = (): YNode => this.parent.parent as YNode;
  nodeContent = (): YArray<YLeaf> => this.parent as YArray<YLeaf>;
  nodeContentLength = (): number => this.nodeContent().length;
  nodeChildren = (): YArray<YNode> => this.node().get("children") as YArray<YNode>;
  nodeChildrenLength = (): number => this.nodeChildren().length;

  setData = (data: object) => {
    if (this.has("data")) {
      Object.keys(data).forEach((key) => {
        this.data().set(key, data[key]);
      });
    } else {
      this.set("data", Object.entries(data));
    }
  };
  deleteText = (index: number, length: number) => this.text().delete(index, length);
  insert = (index: number, text) => {
    this.text().insert(index, text);
  };
}

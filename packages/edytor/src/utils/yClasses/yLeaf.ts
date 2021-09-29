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
      this.set("data", new Map(Object.entries(props.data)));
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
  replaceText = (start: number, length: number, text: string) => {
    const currentText = this.string().split("");
    currentText.splice(start, length, ...text.split(""));

    return this.setText(currentText.join(""));
  };
  setText = (text: string) => {
    const t = this.text();
    t.delete(0, t.length);
    t.insert(0, text);
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
      this.set("data", new Map(Object.entries(data)));
    }
  };
  isEmpty = () => this.length() === 0;
  deleteText = (index: number, length: number, removeIfEmpty = true) => {
    this.text().delete(index, length);
    if (this.isEmpty() && removeIfEmpty) {
      this.remove();
    }
  };
  index = (): number => {
    return this.nodeContent()
      .toArray()
      .indexOf(this);
  };
  remove = () => {
    this.nodeContent().delete(this.index());
    if (this.nodeContentLength() === 0) {
      console.log(this.node);
      this.node().delete();
    }
  };
  insert = (index: number, text) => {
    this.text().insert(index, text);
  };
}

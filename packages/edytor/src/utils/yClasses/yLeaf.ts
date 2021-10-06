import { nanoid } from "..";
import { Map, Text } from "yjs";
import { YArray, YMap, YText } from "yjs/dist/src/internals";
import { YNode } from ".";

export type YLeafProps = {
  data?: any;
  text?: string;
  id?: string;
};

export class YLeaf extends Map<any> {
  id: string;

  constructor(props?: YLeafProps) {
    super();
    this.set("id", props?.id || nanoid());
    this.set("text", new Text(props?.text || ""));
    if (props) {
      const { id, text, data, ...marks } = props;

      this.set("text", new Text(text || ""));
      data && this.set("data", new Map(Object.entries(data)));

      marks &&
        Object.keys(marks).forEach((mark) => {
          this.set(mark, marks[mark]);
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
  isEmpty = () => this.text() === undefined || this.length() === 0;
  deleteText = (index: number, length: number, removeIfEmpty?: boolean) => {
    this.text().delete(index, length);
    removeIfEmpty && this.removeIfEmpty();
  };
  index = (): number => {
    let i = 0;
    let n = this;
    while (n?._item?.left) {
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
  removeIfEmpty = () => {
    if (this.isEmpty()) {
      this.nodeContent().delete(this.index());
      if (this.nodeContentLength() === 0) {
        this.node().delete();
      }
    }
  };
  insert = (index: number, text) => {
    this.text().insert(index, text);
  };
}

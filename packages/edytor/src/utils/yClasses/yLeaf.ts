import { nanoid } from "..";
import { Map, Text } from "yjs";

export type YLeafProps = {
  data?: any;
  text?: string;
  id?: string;
};

export const createLeaf = (props?: YLeafProps) => {
  const leaf = new Map();
  leaf.set("id", props?.id || nanoid());
  leaf.set("text", new Text(props?.text || ""));
  if (props) {
    const { id, text, data, ...marks } = props;
    leaf.set("text", new Text(text || ""));
    data && leaf.set("data", new Map(Object.entries(data)));
    marks &&
      Object.keys(marks).forEach((mark) => {
        leaf.set(mark, marks[mark]);
      });
  }
  return leaf;
};

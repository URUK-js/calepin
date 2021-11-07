import { nanoid } from "..";
import { Map, Text } from "yjs";
import { YLeaf, YLeafProps } from "../../types";

export const createLeaf = (props?: YLeafProps): YLeaf => {
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

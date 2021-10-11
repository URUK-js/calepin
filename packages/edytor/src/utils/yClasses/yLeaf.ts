import { nanoid } from "..";
import { Map, Text } from "yjs";

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
}

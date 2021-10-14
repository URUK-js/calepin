import { nanoid } from "nanoid";
import { Map, Text, Array } from "yjs";
export type YLeafProps = {
  data?: any;
  text?: string;
  id?: string;
};

export const getChildren = ({ type, content = [], children = [], ...props }: any): any => {
  return createNode(type, { ...props, children: children.map(getChildren), content: content.map(createLeaf) });
};

export const createLeaf = (props?: any) => {
  const leaf = new Map();
  if (props && props.id) {
    leaf.set("id", props.id);
  } else {
    leaf.set("id", "y-" + nanoid());
  }
  if (props && props.text) {
    leaf.set("text", new Text(props.text));
  } else {
    leaf.set("text", new Text(""));
  }
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

export const createNode = (type: string, props?: any): any => {
  const node = new Map();
  if (props && props.id) {
    node.set("id", props.id);
  } else {
    node.set("id", "y-" + nanoid());
  }
  node.set("type", type);
  if (props && props.data) {
    node.set("data", new Map(Object.entries(props.data)));
  }
  if (props && props.content && props.content instanceof Array) {
    node.set("content", props.content);
  } else if (props && props.content) {
    node.set("content", Array.from(props.content));
  } else {
    node.set("content", [createLeaf()]);
  }

  if (props && props.children && props.children instanceof Array) {
    node.set("children", props.children);
  } else if (props && props.children) {
    node.set("children", Array.from(props.children));
  } else {
    node.set("children", []);
  }

  return node;
};

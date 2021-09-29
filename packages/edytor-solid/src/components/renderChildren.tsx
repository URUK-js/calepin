import { createMemo, JSXElement, mapArray } from "solid-js";
import { useNode, useText, useChildren, useEditor } from "../hooks";
import { YArray, YMap } from "yjs/dist/src/internals";
import { YLeaf, YNode } from "edytor";

export const renderChildren = (children: YArray<YNode>): JSXElement => {
  return mapArray(useChildren(children), renderNode);
};

export const renderContent = (content: YArray<YLeaf>): JSXElement => {
  return mapArray(useChildren(content), renderLeaf);
};

export const renderLeaf = (leaf: YLeaf): JSXElement => {
  const { renderLeaf } = useEditor();
  return renderLeaf({
    text: useText(leaf.text()),
    attributes: {
      id: leaf.id,
      "data-edytor-element": "true",
      "data-edytor-leaf": "true"
    },

    leaf: useNode(leaf)
  });
};
export const renderNode = (node: YNode) => {
  const { renderBlock } = useEditor();
  const children = renderChildren(node.children());
  const content = renderContent(node.content());
  return renderBlock({
    attributes: {
      id: node.id,
      "data-edytor-element": "true",
      "data-edytor-block": "true"
    },
    node,
    block: useNode(node),
    children,
    content
  });
};

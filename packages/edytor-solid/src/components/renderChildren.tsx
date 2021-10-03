import { createMemo, JSXElement, mapArray, onCleanup, onMount } from "solid-js";
import { useNode, useText, useChildren, useEditor } from "../hooks";
import { YArray, YMap } from "yjs/dist/src/internals";
import { YLeaf, YNode } from "edytor";
import { getId, leafText } from "edytor/src";

export const renderChildren = (children: YArray<YNode>): JSXElement => {
  return mapArray(useChildren(children), renderNode);
};

export const renderContent = (content: YArray<YLeaf>): JSXElement => {
  return mapArray(useChildren(content), renderLeaf);
};

export const renderLeaf = (node: YLeaf): JSXElement => {
  const { renderLeaf } = useEditor();
  console.log({ leaf: node });
  const leaf = useNode(node);
  return renderLeaf({
    text: useText(leafText(node)),
    attributes: {
      id: getId(node),
      "data-edytor-element": "true",
      "data-edytor-leaf": "true"
    },
    leaf
  });
};
export const renderNode = (node: YNode) => {
  const { renderBlock } = useEditor();
  const children = renderChildren(node.get("children"));
  const content = renderContent(node.get("content"));
  const block = useNode(node);
  return renderBlock({
    attributes: {
      id: getId(node),
      "data-edytor-element": "true",
      "data-edytor-block": "true"
    },
    node,
    block,
    children,
    content
  });
};

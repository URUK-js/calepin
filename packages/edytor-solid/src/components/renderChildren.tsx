import { createMemo, JSXElement, mapArray, onCleanup, onMount } from "solid-js";
import { useNode, useText, useChildren, useEditor } from "../hooks";
import { YArray, YMap } from "yjs/dist/src/internals";
import { YLeaf, YNode } from "edytor";

export const renderChildren = (children: YArray<YNode>): JSXElement => {
  return mapArray(useChildren(children), renderNode);
};

export const renderContent = (content: YArray<YLeaf>): JSXElement => {
  return mapArray(useChildren(content), renderLeaf);
};

const useSetIdToMap = (node: YNode | YLeaf) => {
  const { ID_TO_MAP } = useEditor();
  onMount(() => {
    console.log(node, node.get("id"));
    ID_TO_MAP.set(node.get("id"), node);
  });
  onCleanup(() => {
    ID_TO_MAP.delete(node.get("id"));
  });
};

const setRef = (node, ref) => {
  const { ID_TO_MAP, MAP_TO_ID } = useEditor();
  console.log({ node, ref });
  ID_TO_MAP.set(ref, node);
  MAP_TO_ID.set(node, ref);
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
    ref: (ref) => setRef(leaf, ref),
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
    ref: (ref) => setRef(node, ref),
    block: useNode(node),
    children,
    content
  });
};

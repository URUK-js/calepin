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

const useSetIdToMap = (node: YNode | YLeaf) => {
  const id = node.get("id");
  const { ID_TO_NODE } = useEditor();
  onMount(() => {
    ID_TO_NODE.set(id, node);
  });
  onCleanup(() => {
    ID_TO_NODE.delete(id);
  });
};

export const renderLeaf = (leaf: YLeaf): JSXElement => {
  const { renderLeaf } = useEditor();

  useSetIdToMap(leaf);

  return renderLeaf({
    text: useText(leafText(leaf)),
    attributes: {
      id: getId(leaf),
      "data-edytor-element": "true",
      "data-edytor-leaf": "true"
    },

    leaf: useNode(leaf)
  });
};
export const renderNode = (node: YNode) => {
  const { renderBlock } = useEditor();
  useSetIdToMap(node);
  const children = renderChildren(node.get("children"));
  const content = renderContent(node.get("content"));

  return renderBlock({
    attributes: {
      id: getId(node),
      "data-edytor-element": "true",
      "data-edytor-block": "true"
    },
    node,

    block: useNode(node),
    children,
    content
  });
};

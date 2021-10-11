import { JSXElement, mapArray, createMemo, createSignal } from "solid-js";
import { Dynamic } from "solid-js/web";
import { useNode, useText, useChildren, useEditor, useNodeObservation } from "../hooks";
import { YArray } from "yjs/dist/src/internals";
import { YLeaf, YNode, getId, leafText } from "edytor";

import { renderHandle } from "./renderHandle";

export const renderChildren = (content: YArray<YLeaf | YNode>, type: "leaf" | "node"): JSXElement =>
  mapArray(useChildren(content) as any, type === "leaf" ? renderLeaf : renderNode);

export const renderLeaf = (node: YLeaf): JSXElement => {
  const leaf = useNode(node);
  const { leaves } = useEditor();
  const content = createMemo(() => {
    const l = leaf() as any;
    let leafNode = useText(leafText(node))() as any;
    if (!leafNode.length) leafNode = "\uFEFF";
    Object.keys(l).forEach((mark) => {
      if (mark !== "data" && mark !== "text" && mark !== "id") {
        const props = typeof leaves[mark] === "string" ? {} : { mark: { [mark]: l[mark] }, node };
        leafNode = (
          <Dynamic {...props} component={leaves[mark]}>
            {leafNode}
          </Dynamic>
        );
      }
    });
    return leafNode;
  });
  return (
    <span data-edytor-element data-edytor-leaf id={getId(node)}>
      {content()}
    </span>
  );
};

export const renderNode = (node: YNode) => {
  const block = useNode(node);
  const { blocks, defaultBlock } = useEditor();
  return (
    <div data-edytor-element data-edytor-block id={getId(node)}>
      {renderHandle(node)}
      <Dynamic block={block} node={node} component={blocks[block().type || blocks[defaultBlock]]}>
        {renderChildren(node.get("content"), "leaf")}
      </Dynamic>
      {renderChildren(node.get("children"), "node")}
    </div>
  );
};

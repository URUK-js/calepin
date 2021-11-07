import { JSXElement, mapArray, createMemo } from "solid-js";
import { Dynamic } from "solid-js/web";
import { useNode, useText, useChildren, useEditor, useNodeObservation } from "../hooks";
import { YArray } from "yjs/dist/src/internals";
import { YLeaf, YNode, getId, leafText } from "edytor";
import { useIsFocused } from "../hooks/useIsFocused";

export const renderChildren = (content: YArray<YLeaf | YNode>, type: "leaf" | "node" | "root"): JSXElement =>
  mapArray(useChildren(content) as any, type === "leaf" ? renderLeaf : renderNode);

export const renderLeaf = (node: YLeaf): JSXElement => {
  const leaf = useNode(node)();
  const { leaves } = useEditor();
  const content = createMemo(() => {
    let leafNode = useText(leafText(node))() as any;
    if (!leafNode.length) leafNode = "\uFEFF";
    Object.keys(leaf).forEach((mark) => {
      if (mark !== "data" && mark !== "text" && mark !== "id") {
        leafNode = (
          <Dynamic
            {...(typeof leaves[mark] === "string" ? {} : { mark: { [mark]: leaf[mark] }, node })}
            component={leaves[mark]}
          >
            {leafNode}
          </Dynamic>
        );
      }
    });
    return leafNode;
  });
  return (
    <span data-edytor-leaf id={getId(node)}>
      {content()}
    </span>
  );
};

export const renderNode = (node: YNode) => {
  const block = useNode(node);
  const { blocks, defaultBlock } = useEditor();
  return (
    <Dynamic
      props={{ "data-edytor-block": true, id: getId(node) }}
      block={block}
      node={node}
      focused={useIsFocused(node)}
      content={renderChildren(node.get("content"), "leaf")}
      children={renderChildren(node.get("children"), "node")}
      component={createMemo(() => blocks[block().type || blocks[defaultBlock]])()}
    />
  );
};

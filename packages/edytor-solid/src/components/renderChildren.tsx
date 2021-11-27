import { JSXElement, mapArray, createMemo, Accessor } from "solid-js";
import { Dynamic } from "solid-js/web";
import { useNode, useText, useChildren, useEditor, useIsFocused } from "../hooks";
import { YLeaf, YNode, getId, leafText, jsonLeaf, jsonNode, YArray } from "edytor";

export const renderChildren = (content: YArray<YLeaf | YNode>, type: "leaf" | "node" | "root"): JSXElement =>
  mapArray(useChildren(content) as any, type === "leaf" ? renderLeaf : renderNode);

export const renderLeaf = (node: YLeaf): JSXElement => {
  const leaf = useNode(node) as Accessor<jsonLeaf>;
  const { leaves } = useEditor();
  const content = createMemo(() => {
    let leafNode = useText(leafText(node))() as any;
    if (!leafNode.length) leafNode = "\uFEFF";
    Object.keys(leaf()).forEach((mark) => {
      if (mark !== "data" && mark !== "text" && mark !== "id") {
        const { component, isVoid } = leaves[mark];

        leafNode = (
          <Dynamic
            {...(typeof component === "string" ? {} : { mark: { [mark]: leaf()[mark] }, node, isVoid })}
            component={component}
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
  const block = useNode(node) as Accessor<jsonNode>;
  const { blocks, defaultBlock } = useEditor();
  const { component, isVoid } = createMemo(() => blocks[block().type || blocks[defaultBlock]])();
  return (
    <Dynamic
      props={{ "data-edytor-block": true, id: getId(node) }}
      block={block}
      node={node}
      focused={useIsFocused(node)}
      content={renderChildren(node.get("content"), "leaf")}
      children={renderChildren(node.get("children"), "node")}
      component={component}
      isVoid={isVoid}
    />
  );
};

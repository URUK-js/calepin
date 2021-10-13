import { JSXElement, mapArray, createMemo } from "solid-js";
import { Dynamic } from "solid-js/web";
import { useNode, useText, useChildren, useEditor, useNodeObservation } from "../hooks";
import { YArray } from "yjs/dist/src/internals";
import { YLeaf, YNode, getId, leafText } from "edytor";
import { renderHandle } from "./renderHandle";

export const renderChildren = (content: YArray<YLeaf | YNode>, type: "leaf" | "node" | "root"): JSXElement => {
  return mapArray(useChildren(content) as any, type === "leaf" ? renderLeaf : renderNode);
};

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
  const block = useNode(node)() as { [key: string]: any; type: string };
  const { blocks, defaultBlock, voids } = useEditor();
  const component = blocks[block.type || blocks[defaultBlock]];
  const props = typeof component === "string" ? {} : { block, node };
  console.log({ voids });

  return (
    <div data-edytor-element data-edytor-block data-edytor-void={!!voids?.blocks?.[block.type]} id={getId(node)}>
      {renderHandle(node)}
      <Dynamic {...props} component={component}>
        {renderChildren(node.get("content"), "leaf")}
      </Dynamic>
      {renderChildren(node.get("children"), "node")}
    </div>
  );
};

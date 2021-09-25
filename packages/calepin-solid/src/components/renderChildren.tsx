import { createSignal, createMemo, Accessor, JSXElement, mapArray } from "solid-js";
import { useNode } from "../hooks/useNode";
import { useText } from "../hooks/useText";
import { useChildren } from "../hooks/useChildren";
import { useEditor } from "../hooks/useEditor";
import { YMap } from "yjs/dist/src/internals";

export const renderChildren = ({
  node,
  parentAttributes
}: {
  node: YMap<any>;
  parentAttributes: Accessor<any>;
}): JSXElement => {
  const { renderLeaf, renderBlock } = useEditor();
  return mapArray(useChildren(node), (child: YMap<any>, i) => {
    const node = useNode(child);
    const isBlock = child.has("children");
    const attributes = createMemo(() => ({
      "data-calepin-path": [...parentAttributes()["data-calepin-path"], i()],
      [isBlock ? "data-calepin-block" : "data-calepin-leave"]: "true"
    }));

    if (isBlock) {
      return (
        <>
          {renderBlock({
            attributes,
            block: node,
            children: renderChildren({ parentAttributes: attributes, node: child })
          })}
        </>
      );
    } else {
      return renderLeaf({
        string: useText(child.get("text")),
        attributes,
        leaf: node
      });
    }
  });
};

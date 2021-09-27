import { createSignal, createMemo, Accessor, JSXElement, mapArray, createEffect, on, For } from "solid-js";
import { useNode } from "../hooks/useNode";
import { useText } from "../hooks/useText";
import { useChildren } from "../hooks/useChildren";
import { useEditor } from "../hooks/useEditor";
import { YMap } from "yjs/dist/src/internals";

{
  /* <button onClick={() => child.set("type", "paragraph")}>aeazeaze</button> */
}
export const renderChildren = ({ node }: { node: YMap<any> }): JSXElement => {
  return mapArray(useChildren(node), renderChild);
};

const renderChild = (child) => {
  const { renderLeaf, renderBlock } = useEditor();
  const node = useNode(child);
  const isBlock = child.has("children");
  console.log("hello");
  if (isBlock) {
    const children = createMemo(() => renderChildren({ node: child }));
    return (
      <>
        {renderBlock({
          attributes: {
            "data-edytor-component": "true",
            "data-edytor-block": "true"
          },
          block: node,
          children
        })}
      </>
    );
  } else {
    const text = useText(child.get("text"));
    return renderLeaf({
      text,
      attributes: {
        "data-edytor-component": "true",
        "data-edytor-leaf": "true"
      },
      leaf: node
    });
  }
};

import { createSignal, createMemo, Accessor, JSXElement, mapArray, createEffect, on } from "solid-js";
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
  // there is a perf bottlenock here when inserting a new block
  const { renderLeaf, renderBlock } = useEditor();
  return mapArray(useChildren(node), (child: YMap<any>, i) => {
    const node = useNode(child);
    const isBlock = child.has("children");
    const attributes = createMemo(() => ({
      "data-edytor-path": [...parentAttributes()["data-edytor-path"], i()],
      [isBlock ? "data-edytor-block" : "data-edytor-leave"]: "true"
    }));
    // let isMounted = false;
    // const createRef = (ref: HTMLElement) => {
    //   createEffect(() => {
    //     if (isMounted) {
    //       return;
    //     }
    //     isMounted = true;
    //     const p = ref.parentElement?.getAttribute("data-edytor-path") || undefined;
    //     const index = p?.length - p?.length - 1 || 0;

    //     const newPath = [...(!p ? [] : p.split(",")), i()];
    //     ref.setAttribute("data-edytor-path", newPath);

    //     !isMounted && ref.setAttribute(isBlock ? "data-edytor-block" : "data-edytor-leave", "true");
    //     ref.querySelectorAll("[data-edytor-path]").forEach((leaf) => {
    //       const path = leaf.getAttribute("data-edytor-path")?.split(",");

    //       const newPathLeaf = newPath?.splice(newPath.length - 1, 1, i());
    //       console.log({ p, path, i: i() }, newPathLeaf?.toString());
    //       leaf.setAttribute("data-edytor-path", newPathLeaf?.toString());
    //     });
    //   });
    // };

    if (isBlock) {
      return (
        <>
          {renderBlock({
            attributes,
            block: node,
            // ref: createRef,
            children: renderChildren({ parentAttributes: attributes, node: child })
          })}
        </>
      );
    } else {
      return renderLeaf({
        string: useText(child.get("text")),
        attributes,
        // ref: createRef,
        leaf: node
      });
    }
  });
};

import { createMemo, JSXElement } from "solid-js";

export const renderBlock = ({ content, node, attributes, handle, children, block, ref }: any): JSXElement => {
  return createMemo(() => {
    switch (block().type) {
      case "block-quote":
        return (
          <blockquote ref={ref} {...attributes}>
            {content}
            {children}
          </blockquote>
        );
      case "heading":
        return (
          <h1 ref={ref} {...attributes}>
            {content}
            {children}
          </h1>
        );

      default:
        return (
          <p ref={ref} {...attributes}>
            {content}
            {children}
          </p>
        );
    }
  })();
};

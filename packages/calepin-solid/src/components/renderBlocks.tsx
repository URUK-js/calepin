import { createMemo, JSXElement } from "solid-js";

export const renderBlock = ({ attributes, handle, children, block, ref }: any): JSXElement => {
  const component = createMemo(() => {
    switch (block().type) {
      case "block-quote":
        return (
          <blockquote ref={ref} {...attributes()}>
            {handle}
            {children}
          </blockquote>
        );
      case "heading":
        return (
          <h1 ref={ref} {...attributes()}>
            {children}
          </h1>
        );

      default:
        return (
          <p ref={ref} {...attributes()}>
            {children}
          </p>
        );
    }
  });

  return component();
};

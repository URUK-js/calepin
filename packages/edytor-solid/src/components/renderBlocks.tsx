import { createMemo, JSXElement } from "solid-js";

export const renderBlock = ({ content, node, attributes, handle, children, block, ref }: any): JSXElement => {
  return createMemo(() => {
    switch (block().type) {
      case "block-quote":
        return (
          <div ref={ref} {...attributes} className="relative">
            {handle()}
            <blockquote>{content}</blockquote>
            {children}
          </div>
        );
      case "heading":
        return (
          <div ref={ref} {...attributes} className="relative">
            {handle()}
            <h1>{content}</h1>
            {children}
          </div>
        );

      default:
        return (
          <div ref={ref} {...attributes} className="relative">
            {handle()}
            <p>{content}</p>
            {children}
          </div>
        );
    }
  })();
};

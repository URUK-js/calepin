import { createMemo, JSXElement } from "solid-js";

export const renderBlock = ({ content, node, attributes, handle, children, block, ref }: any): JSXElement => {
  return createMemo(() => {
    switch (block().type) {
      case "block-quote":
        return (
          <div ref={ref} {...attributes} className="relative">
            {handle()}
            <blockquote>{content}</blockquote>
            <div className="childrenContainer">{children}</div>
          </div>
        );
      case "heading":
        return (
          <div ref={ref} {...attributes} className="relative">
            {handle()}
            <h1>{content}</h1>
            <div className="childrenContainer">{children}</div>
          </div>
        );

      default:
        return (
          <div ref={ref} {...attributes} className="relative">
            {handle()}
            <p>{content}</p>
            <div className="childrenContainer">{children}</div>
          </div>
        );
    }
  })();
};

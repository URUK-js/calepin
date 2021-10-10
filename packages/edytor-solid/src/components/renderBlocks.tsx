import { createMemo, JSXElement } from "solid-js";

export const renderBlock = ({ content, node, attributes, handle, children, block, ref }: any): JSXElement => {
  return createMemo(() => {
    switch (block().type) {
      case "blockquote":
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
      case "embed":
        return (
          <div ref={ref} {...attributes} className="relative">
            {handle()}
            <iframe width={"100%"} height={400} src={block().data.get("url")} frameborder="0"></iframe>
            <p>{content}</p>
          </div>
        );

      case "layout":
        return (
          <div
            ref={ref}
            {...attributes}
            className="relative grid gap-4 p-2"
            style={{ gap: "1rem", "grid-template-columns": "repeat(2, minmax(0, 1fr))" }}
          >
            {children}
          </div>
        );

      case "layoutColumn":
        return (
          <div style={{ height: "100%" }} ref={ref} {...attributes} className="relative col-span-1 bg-gray-100">
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

import { createMemo, JSXElement } from "solid-js";

export const renderLeaves = ({ string, attributes, leaf, ref }: any): JSXElement => {
  const children = createMemo(() => {
    let children = string();
    if (!children.length) children = "\uFEFF";
    if (leaf().bold) {
      children = <strong>{children}</strong>;
    }

    if (leaf().code) {
      children = <code>{children}</code>;
    }

    if (leaf().italic) {
      children = <em>{children}</em>;
    }

    if (leaf().underline) {
      children = <u>{children}</u>;
    }
    if (leaf().strikethrough) {
      children = <span style={{ "text-decoration": "line-through" }}>{children}</span>;
    }
    if (leaf().code) {
      children = (
        <span
          style={{ color: "#EB5757", "font-family": "Space Mono !important" }}
          className="rounded-sm bg-gray-200 font-mono px-2 "
        >
          {children}
        </span>
      );
    }
    return children;
  });

  return (
    <span {...attributes()} ref={ref}>
      {children()}
    </span>
  );
};

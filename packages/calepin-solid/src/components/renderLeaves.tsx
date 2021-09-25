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
    return children;
  });

  return (
    <span {...attributes()} ref={ref}>
      {children()}
    </span>
  );
};

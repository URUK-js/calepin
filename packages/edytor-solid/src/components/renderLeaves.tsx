import { createMemo, JSXElement } from "solid-js";

export const renderLeaves = ({ text, attributes, leaf, ref }: any): JSXElement => {
  const content = createMemo(() => {
    let leafNode = text();

    if (!leafNode.length) leafNode = "\uFEFF";
    if (leaf().bold) {
      leafNode = <strong>{leafNode}</strong>;
    }

    if (leaf().code) {
      leafNode = <code>{leafNode}</code>;
    }

    if (leaf().italic) {
      leafNode = <em>{leafNode}</em>;
    }

    if (leaf().underline) {
      leafNode = <u>{leafNode}</u>;
    }
    if (leaf().strikethrough) {
      leafNode = <span style={{ "text-decoration": "line-through" }}>{leafNode}</span>;
    }
    if (leaf().code) {
      leafNode = (
        <span
          style={{ color: "#EB5757", "font-family": "Space Mono !important" }}
          className="rounded-sm bg-gray-200 font-mono px-2 "
        >
          {leafNode}
        </span>
      );
    }
    if (leaf().highlight) {
      leafNode = <mark className={leaf().color}>{leafNode}</mark>;
    }
    return leafNode;
  });
  return (
    <span {...attributes} ref={ref}>
      {content()}
    </span>
  );
};

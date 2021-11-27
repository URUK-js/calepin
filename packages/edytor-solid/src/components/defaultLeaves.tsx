const Ref = ({ props }) => {
  return (
    <span {...props}>
      <b>Inline</b>
    </span>
  );
};
export const defaultLeaves = {
  bold: { component: "strong" },
  italic: { component: "i" },
  underline: { component: "u" },
  code: { component: "code" },
  strikethrough: { component: "del" },
  highlight: { component: "mark" },
  inlinequote: { component: "q" },
  keyboard: { component: "kbd" },
  reference: { component: Ref, isVoid: true }
};

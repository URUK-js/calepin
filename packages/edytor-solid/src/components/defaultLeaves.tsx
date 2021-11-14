const Ref = () => {
  return (
    <span contentEditable={false}>
      <b>I'M an inline void leaf</b>
    </span>
  );
};
export const defaultLeaves = {
  bold: "strong",
  italic: "i",
  underline: "u",
  code: "code",
  strikethrough: "del",
  highlight: "mark",
  inlinequote: "q",
  keyboard: "kbd",
  reference: Ref
};

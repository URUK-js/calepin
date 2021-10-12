const Ref = () => {
  return (
    <span contentEditable={false}>
      <b>I'M a ref bitch</b>
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

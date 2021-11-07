import { deleteText } from "../../..";
import { makeEditorFixture } from "../../fixture/editorFixture";

test("delete hello", () => {
  const value = [
    {
      type: "paragraph",
      content: [{ text: "hello" }],
      children: []
    }
  ];
  const editor = makeEditorFixture(value, { start: { path: [0, 0], offset: 0 }, end: { path: [0, 0], offset: 5 } });
  deleteText(editor, { mode: "forward" });
  expect(editor.toRawText()).toBe("");
});

test("delet deep", () => {
  const value = [
    {
      type: "paragraph",
      content: [
        { text: "hello", bold: true },
        { text: " edyt", italic: true }
      ],
      children: []
    }
  ];
  const editor = makeEditorFixture(value, { start: { path: [0, 1], offset: 0 }, end: { path: [0, 1], offset: 5 } });
  deleteText(editor, { mode: "forward" });
  expect(editor.toRawText()).toBe("hello");
  expect(editor.toJSON()).toStrictEqual([
    {
      type: "paragraph",
      content: [{ text: "hello", bold: true }],
      children: []
    }
  ]);
});

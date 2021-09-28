import { insertText } from "../../src";
import { makeEditorFixture } from "../fixture/editorFixture";

test("ok", () => {
  expect(true).toBe(true);
});

test("insert hello", () => {
  const value = [
    {
      type: "paragraph",
      content: [{ text: "" }],
      children: []
    }
  ];
  const editor = makeEditorFixture(value);
  insertText(editor, { text: "hello" });
  expect(editor.doc.string()).toBe("hello");
});

test("insert hello", () => {
  const value = [
    {
      type: "paragraph",
      content: [{ text: "hello" }],
      children: []
    }
  ];
  const editor = makeEditorFixture(value, { start: { path: [0, 0], offset: 5 } });
  insertText(editor, { text: " edytor" });
  expect(editor.doc.string()).toBe("hello edytor");
});

test("insert hello", () => {
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
  const editor = makeEditorFixture(value, { start: { path: [0, 1], offset: 10 } });

  insertText(editor, { text: "or" });
  expect(editor.doc.string()).toBe("hello edytor");
  expect(editor.toJSON()).toStrictEqual([
    {
      type: "paragraph",
      content: [
        { text: "hello", bold: true },
        { text: " edytor", italic: true }
      ],
      children: []
    }
  ]);
});
test("insert should fail silently", () => {
  const value = [
    {
      type: "paragraph",
      content: [{ text: "hello", bold: true }],
      children: []
    }
  ];
  const editor = makeEditorFixture(value, { start: { path: [0, 1], offset: 10 } });
  insertText(editor, { text: "or" });
  expect(editor.doc.string()).toBe("hello");
});

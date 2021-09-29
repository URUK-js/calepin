import { deleteText } from "../..";
import { makeEditorFixture } from "../fixture/editorFixture";

test("delete one back", () => {
  const value = [
    {
      type: "paragraph",
      content: [{ text: "hello" }],
      children: []
    }
  ];
  const editor = makeEditorFixture(value, { start: { path: [0, 0], offset: 5 }, length: 0 });
  deleteText(editor, { mode: "backward" });
  expect(editor.doc.string()).toBe("hell");
});

test("delete hello", () => {
  const value = [
    {
      type: "paragraph",
      content: [{ text: "hello" }],
      children: []
    }
  ];
  const editor = makeEditorFixture(value, { start: { path: [0, 0], offset: 0 }, end: { path: [0, 0], offset: 5 } });
  deleteText(editor, { mode: "backward" });
  expect(editor.doc.string()).toBe("");
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
  const editor = makeEditorFixture(value, { start: { path: [0, 1], offset: 5 } });
  deleteText(editor, { mode: "backward" });
  expect(editor.doc.string()).toBe("hello edy");
});

test("should fail silently", () => {
  const value = [
    {
      type: "paragraph",
      content: [{ text: "hello", bold: true }],
      children: []
    }
  ];
  const editor = makeEditorFixture(value, { start: { path: [0, 1], offset: 10 } });
  deleteText(editor, { mode: "backward" });
  expect(editor.doc.string()).toBe("hello");
});

test("delete multinodes", () => {
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
  const editor = makeEditorFixture(value, { start: { path: [0, 0], offset: 0 }, end: { path: [0, 1], offset: 5 } });
  deleteText(editor, { mode: "backward" });
  expect(editor.doc.string()).toBe("");
});
test("delete multinodes", () => {
  const value = [
    {
      type: "paragraph",
      content: [
        { text: "hello", bold: true },
        { text: " edyt", italic: true },
        { text: " edyt", italic: true }
      ],
      children: []
    }
  ];
  const editor = makeEditorFixture(value, { start: { path: [0, 0], offset: 0 }, end: { path: [0, 2], offset: 5 } });
  deleteText(editor, { mode: "backward" });
  expect(editor.doc.string()).toBe("");
});
// test("insert at range single node", () => {
//   const value = [
//     {
//       type: "paragraph",
//       content: [{ text: "hello", bold: true }],
//       children: []
//     }
//   ];
//   const editor = makeEditorFixture(value, {
//     start: { path: [0, 0], offset: 0 },
//     end: { path: [0, 0], offset: 5 },
//     length: 5
//   });
//   deleteText(editor, { mode: "backward" });
//   expect(editor.doc.string()).toBe("or");
// });
// test("insert at range multinodes-2", () => {
//   const value = [
//     {
//       type: "paragraph",

//       content: [{ text: "Bold text" }, { text: "Bold" }],
//       children: []
//     }
//   ];
//   const editor = makeEditorFixture(value, { start: { path: [0, 0], offset: 0 }, end: { path: [0, 1], offset: 4 } });
//   deleteText(editor, { mode: "backward" });
//   expect(editor.doc.string()).toBe("or");
// });
// test("insert at range multinodes-3", () => {
//   const value = [
//     {
//       type: "paragraph",

//       content: [{ text: "Bold text" }, { text: "Bold" }, { text: "Bold" }],
//       children: []
//     }
//   ];
//   const editor = makeEditorFixture(value, { start: { path: [0, 0], offset: 0 }, end: { path: [0, 2], offset: 4 } });
//   deleteText(editor, { mode: "backward" });
//   expect(editor.doc.string()).toBe("or");
// });
// test("insert at range multinodes-3", () => {
//   const value = [
//     {
//       type: "paragraph",
//       content: [{ text: "Bold text" }],
//       children: []
//     }
//   ];
//   const editor = makeEditorFixture(value);
//   deleteText(editor, { mode: "backward" });
//   expect(editor.doc.string()).toBe("Bold text");
// });

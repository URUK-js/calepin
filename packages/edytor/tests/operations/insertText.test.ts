// import { insertText } from "../..";
// import { makeEditorFixture, removeIds } from "../fixture/editorFixture";
// test("ok", () => {
//   expect(true).toBe(true);
// });
// test("insert hello", () => {
//   const value = [
//     {
//       type: "paragraph",
//       content: [{ text: "" }],
//       children: []
//     }
//   ];
//   const editor = makeEditorFixture(value);
//   insertText(editor, { text: "hello" });
//   expect(editor.doc.string()).toBe("hello");
// });

// test("insert hello", () => {
//   const value = [
//     {
//       type: "paragraph",
//       content: [{ text: "hello" }],
//       children: []
//     }
//   ];
//   const editor = makeEditorFixture(value, { start: { path: [0, 0], offset: 5 } });
//   insertText(editor, { text: " edytor" });
//   expect(editor.doc.string()).toBe("hello edytor");
// });

// test("insert hello", () => {
//   const value = [
//     {
//       type: "paragraph",
//       content: [
//         { text: "hello", bold: true },
//         { text: " edyt", italic: true }
//       ],
//       children: []
//     }
//   ];
//   const editor = makeEditorFixture(value, { start: { path: [0, 1], offset: 10 } });

//   insertText(editor, { text: "or" });

//   expect(editor.doc.string()).toBe("hello edytor");

//   expect(removeIds(editor.toJSON())).toStrictEqual([
//     {
//       type: "paragraph",
//       content: [
//         { text: "hello", bold: true },
//         { text: " edytor", italic: true }
//       ],
//       children: []
//     }
//   ]);
// });
// test("insert should fail silently", () => {
//   const value = [
//     {
//       type: "paragraph",
//       content: [{ text: "hello", bold: true }],
//       children: []
//     }
//   ];
//   const editor = makeEditorFixture(value, { start: { path: [0, 1], offset: 10 } });
//   insertText(editor, { text: "or" });
//   expect(editor.doc.string()).toBe("hello");
// });
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
//   insertText(editor, { text: "or" });
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
//   insertText(editor, { text: "or" });
//   expect(editor.doc.string()).toBe("or");
// });
// test("insert at range multinodes-3", () => {
//   const value = [
//     {
//       type: "paragraph",
//       id: "id",
//       content: [{ text: "Bold text" }, { text: "Bold" }, { text: "Bold" }],
//       children: []
//     }
//   ];
//   const editor = makeEditorFixture(value, { start: { path: [0, 0], offset: 0 }, end: { path: [0, 2], offset: 4 } });
//   insertText(editor, { text: "or" });

//   expect(editor.doc.string()).toBe("or");
//   expect(removeIds(editor.toJSON())).toStrictEqual([
//     {
//       type: "paragraph",
//       content: [{ text: "or" }],
//       children: []
//     }
//   ]);
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
//   insertText(editor, { text: "" });
//   expect(editor.doc.string()).toBe("Bold text");
// });

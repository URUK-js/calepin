import { makeEditorFixture } from "../fixture/editorFixture";

// test("no range", () => {
//   const value = [
//     {
//       type: "paragraph",
//       data: { comment: "hello" },
//       content: [{ text: "Bold text", bold: true }],
//       children: [
//         {
//           type: "paragraph",
//           content: [{ text: "Lorem ipsum dolor sit", italic: true }]
//         },
//         {
//           type: "paragraph",
//           content: [{ text: "Lorem ipsum dolor sit", data: { comment: "hello" } }]
//         }
//       ]
//     }
//   ];

//   const editor = makeEditorFixture(value);
//   console.log(editor.selection());
//   expect(editor.selection().type).toBe("collapsed");
// });
// test("no range", () => {
//   const value = [
//     {
//       type: "paragraph",
//       data: { comment: "hello" },
//       content: [{ text: "Bold text" }, { text: "Bold text" }],
//       children: []
//     }
//   ];

//   const editor = makeEditorFixture(value, { start: { path: [0, 0], offset: 0 }, end: { path: [0, 1], offset: 3 } });
//   console.log(editor.selection());
//   expect(editor.selection().type).toBe("multinodes");
// });

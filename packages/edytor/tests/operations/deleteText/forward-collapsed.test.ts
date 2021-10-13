// import { deleteText } from "../../..";
// import { makeEditorFixture } from "../../fixture/editorFixture";

// test("delete one back", () => {
//   const value = [
//     {
//       type: "paragraph",
//       content: [{ text: "hello" }],
//       children: []
//     }
//   ];
//   const editor = makeEditorFixture(value, { start: { path: [0, 0], offset: 4 } });
//   deleteText(editor, { mode: "forward" });
//   expect(editor.doc.string()).toBe("hell");
// });

// test("delete formward end of leaf should delete the start of the next ", () => {
//   const value = [
//     {
//       type: "paragraph",
//       content: [
//         { text: "hello", bold: true },
//         { text: " edytor", italic: true }
//       ],
//       children: []
//     }
//   ];
//   const editor = makeEditorFixture(value, { start: { path: [0, 0], offset: 5 } });
//   deleteText(editor, { mode: "forward" });
//   expect(editor.doc.string()).toBe("helloedytor");
// });

// test("delet deep", () => {
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
//   const editor = makeEditorFixture(value, { start: { path: [0, 1], offset: 4 } });
//   deleteText(editor, { mode: "forward" });
//   expect(editor.doc.string()).toBe("hello edy");
// });

// test("should fail silently", () => {
//   const value = [
//     {
//       type: "paragraph",
//       content: [{ text: "hello", bold: true }],
//       children: []
//     }
//   ];
//   const editor = makeEditorFixture(value, { start: { path: [0, 1], offset: 10 } });
//   deleteText(editor, { mode: "forward" });
//   expect(editor.doc.string()).toBe("hello");
// });

// test("delete at end to merge forward node", () => {
//   const value = [
//     {
//       id: "delete",
//       type: "paragraph",
//       content: [{ text: "hello edytor" }],
//       children: []
//     },
//     {
//       id: "delete2",
//       type: "paragraph",
//       content: [{ text: " from the tests" }],
//       children: []
//     }
//   ];

//   const expectedValue = [
//     {
//       id: "delete",
//       type: "paragraph",
//       content: [{ text: "hello edytor from the tests" }],
//       children: []
//     }
//   ];

//   const editor = makeEditorFixture(value, { start: { path: [0, 0], offset: 12 } });
//   deleteText(editor, { mode: "forward" });
//   console.log(JSON.stringify(editor.toJSON(), null, 3));
//   expect(editor.toJSON()).toStrictEqual(expectedValue);
// });

// test("delete at end deep shoul merge with next leaf and push up children", () => {
//   const value = [
//     {
//       id: "delete",
//       type: "paragraph",
//       content: [{ text: "hello edytor" }],
//       children: []
//     },
//     {
//       id: "delete2",
//       type: "paragraph",
//       content: [{ text: " from the tests" }],
//       children: [
//         {
//           id: "delete3",
//           type: "paragraph",
//           content: [{ text: " from the tests" }],
//           children: []
//         }
//       ]
//     }
//   ];

//   const expectedValue = [
//     {
//       id: "delete",
//       type: "paragraph",
//       content: [{ text: "hello edytor from the tests" }],
//       children: []
//     },
//     {
//       id: "delete3",
//       type: "paragraph",
//       content: [{ text: " from the tests" }],
//       children: []
//     }
//   ];

//   const editor = makeEditorFixture(value, { start: { path: [0, 0], offset: 12 } });
//   deleteText(editor, { mode: "forward" });

//   expect(editor.toJSON()).toStrictEqual(expectedValue);
// });

// test("delete at end", () => {
//   const value = [
//     {
//       id: "1",
//       type: "paragraph",
//       content: [{ text: "hello edytor" }],
//       children: []
//     },
//     {
//       id: "2",
//       type: "paragraph",
//       content: [{ text: " from the tests" }],
//       children: [
//         {
//           id: "3",
//           type: "paragraph",
//           content: [{ text: " from the tests" }],
//           children: []
//         }
//       ]
//     },
//     {
//       id: "4",
//       type: "paragraph",
//       content: [{ text: "paragraph4" }],
//       children: [
//         {
//           id: "5",
//           type: "paragraph",
//           content: [{ text: "paragraph5" }],
//           children: [
//             {
//               id: "6",
//               type: "paragraph",
//               content: [{ text: "paragraph6" }],
//               children: []
//             }
//           ]
//         }
//       ]
//     }
//   ];

//   const expectedValue = [
//     {
//       id: "1",
//       type: "paragraph",
//       content: [{ text: "hello edytor" }],
//       children: []
//     },
//     {
//       id: "2",
//       type: "paragraph",
//       content: [{ text: " from the tests" }],
//       children: [
//         {
//           id: "3",
//           type: "paragraph",
//           content: [{ text: " from the tests" }],
//           children: []
//         }
//       ]
//     },
//     {
//       id: "4",
//       type: "paragraph",
//       content: [{ text: "paragraph4" }],
//       children: [
//         {
//           id: "5",
//           type: "paragraph",
//           content: [{ text: "paragraph5paragraph6" }],
//           children: []
//         }
//       ]
//     }
//   ];

//   const editor = makeEditorFixture(value, { start: { path: [2, 0, 0], offset: 10 } });
//   console.log(
//     editor.children
//       .get(2)
//       .get("content")
//       .get(0)
//       .toJSON()
//   );
//   deleteText(editor, { mode: "forward" });

//   expect(editor.toJSON()).toStrictEqual(expectedValue);
// });

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
//   const editor = makeEditorFixture(value, { start: { path: [0, 0], offset: 5 } });
//   deleteText(editor, { mode: "backward" });
//   expect(editor.toRawText()).toBe("hell");
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
//   const editor = makeEditorFixture(value, { start: { path: [0, 1], offset: 5 } });
//   deleteText(editor, { mode: "backward" });
//   expect(editor.toRawText()).toBe("hello edy");
// });
// test("delete backward at start of leaf should delete the start of the prev leaf ", () => {
//   const value = [
//     {
//       type: "paragraph",
//       content: [
//         { text: "delete ", bold: true },
//         { text: "backward", italic: true }
//       ],
//       children: []
//     }
//   ];
//   const editor = makeEditorFixture(value, { start: { path: [0, 1], offset: 0 } });
//   deleteText(editor, { mode: "backward" });
//   expect(editor.toRawText()).toBe("deletebackward");
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
//   deleteText(editor, { mode: "backward" });
//   expect(editor.toRawText()).toBe("hello");
// });

// test("delete at start", () => {
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
//       type: "paragraph",
//       content: [{ text: "hello edytor from the tests" }],
//       children: []
//     }
//   ];
//   const editor = makeEditorFixture(value, { start: { path: [1, 0], offset: 0 } });
//   deleteText(editor, { mode: "backward" });

//   expect(editor.toJSON()).toStrictEqual(expectedValue);
// });

// test("delete at start nested without children", () => {
//   const value = [
//     {
//       id: "delete",
//       type: "paragraph",
//       content: [{ text: "hello edytor" }],
//       children: [
//         {
//           id: "delete2",
//           type: "paragraph",
//           content: [{ text: " from the tests" }],
//           children: []
//         }
//       ]
//     },
//     {
//       id: "delete3",
//       type: "paragraph",
//       content: [{ text: " from the tests" }],
//       children: []
//     }
//   ];

//   const expectedValue = [
//     {
//       type: "paragraph",
//       content: [{ text: "hello edytor" }],
//       children: []
//     },
//     {
//       type: "paragraph",
//       content: [{ text: " from the tests" }],
//       children: []
//     }
//     {
//       type: "paragraph",
//       content: [{ text: " from the tests" }],
//       children: []
//     }
//   ];
//   const editor = makeEditorFixture(value, { start: { path: [0, 0, 0], offset: 0 } });
//   deleteText(editor, { mode: "backward" });

//   expect(editor.toJSON()).toStrictEqual(expectedValue);
// });

// test("delete at start deep should unnest if it has children with prev leaf and climb up the children", () => {
//   const value = [
//     {
//       type: "paragraph",
//       content: [{ text: "hello edytor" }],
//       children: []
//     },
//     {
//       type: "paragraph",
//       content: [{ text: " from the tests" }],
//       children: [
//         {
//           type: "paragraph",
//           content: [{ text: "I hope this work fine" }],
//           children: []
//         }
//       ]
//     }
//   ];

//   const expectedValue = [
//     {
//       type: "paragraph",
//       content: [{ text: "hello edytor from the tests" }],
//       children: []
//     },
//     {
//       type: "paragraph",
//       content: [{ text: "I hope this work fine" }],
//       children: []
//     }
//   ];

//   const editor = makeEditorFixture(value, { start: { path: [1, 0], offset: 0 } });
//   deleteText(editor, { mode: "backward" });
//   expect(editor.toJSON()).toStrictEqual(expectedValue);
// });

// test("delete at start", () => {
//   const value = [
//     {
//       id: "4",
//       type: "paragraph",
//       content: [{ text: "Hi" }],
//       children: [
//         {
//           id: "5",
//           type: "paragraph",
//           content: [{ text: "Hola" }],
//           children: []
//         },
//         {
//           id: "6",
//           type: "paragraph",
//           content: [{ text: "Bonjour" }],
//           children: []
//         },
//         {
//           id: "7",
//           type: "paragraph",
//           content: [{ text: "Ciao" }],
//           children: []
//         }
//       ]
//     }
//   ];

//   const expectedValue = [
//     {
//       type: "paragraph",
//       content: [{ text: "HiHola" }],
//       children: [
//         {
//           type: "paragraph",
//           content: [{ text: "Bonjour" }],
//           children: []
//         },
//         {
//           type: "paragraph",
//           content: [{ text: "Ciao" }],
//           children: []
//         }
//       ]
//     }
//   ];

//   const editor = makeEditorFixture(value, { start: { path: [0, 0, 0], offset: 0 } });
//   deleteText(editor, { mode: "backward" });
//   console.log(editor.toJSON());
//   expect(editor.toJSON()).toStrictEqual(expectedValue);
// });

// test("delete to unnest", () => {
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
//       content: [{ text: "from the tests" }],
//       children: [
//         {
//           id: "3",
//           type: "paragraph",
//           content: [{ text: "i hope it work" }],
//           children: []
//         }
//       ]
//     }
//   ];

//   const expectedValue = [
//     {
//       type: "paragraph",
//       content: [{ text: "hello edytor" }],
//       children: []
//     },
//     {
//       type: "paragraph",
//       content: [{ text: "from the tests" }],
//       children: []
//     },
//     {
//       type: "paragraph",
//       content: [{ text: "i hope it work" }],
//       children: []
//     }
//   ];

//   const editor = makeEditorFixture(value, { start: { path: [1, 0, 0], offset: 0 } });
//   deleteText(editor, { mode: "backward" });
//   console.log(JSON.stringify(editor.toJSON(), null, 3));
//   expect(editor.toJSON()).toStrictEqual(expectedValue);
// });

// test("delete empty", () => {
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
//       content: [{ text: "" }],
//       children: [

//       ]
//     }
//   ];

//   const expectedValue = [
//     {
//       type: "paragraph",
//       content: [{ text: "hello edytor" }],
//       children: []
//     },

//   ];

//   const editor = makeEditorFixture(value, { start: { path: [1, 0], offset: 0 } });
//   deleteText(editor, { mode: "backward" });
//   console.log(JSON.stringify(editor.toJSON(), null, 3));
//   expect(editor.toJSON()).toStrictEqual(expectedValue);
// });
// test("delete at start of doc to do nothing", () => {
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
//       content: [{ text: "" }],
//       children: [

//       ]
//     }
//   ];

//   const expectedValue = [
//     {
//       type: "paragraph",
//       content: [{ text: "hello edytor" }],
//       children: []
//     },
//     {
//       type: "paragraph",
//       content: [{ text: "" }],
//       children: [

//       ]
//     }

//   ];

//   const editor = makeEditorFixture(value, { start: { path: [0, 0], offset: 0 } });
//   deleteText(editor, { mode: "backward" });
//   console.log(JSON.stringify(editor.toJSON(), null, 3));
//   expect(editor.toJSON()).toStrictEqual(expectedValue);
// });

// import { moveNode } from "../../..";
// import { makeEditorFixture, removeIds } from "../../fixture/editorFixture";

// test("move to reorder", () => {
//   const value = [
//     {
//       type: "paragraph",
//       content: [{ text: "Lorem" }],
//       children: []
//     },
//     {
//       type: "paragraph",
//       content: [{ text: "ipsum" }],
//       children: []
//     },
//     {
//       type: "paragraph",
//       content: [{ text: "dolor" }],
//       children: []
//     }
//   ];
//   const expectedValue = [
//     {
//       type: "paragraph",
//       content: [
//         {
//           text: "ipsum"
//         }
//       ],
//       children: []
//     },
//     {
//       type: "paragraph",
//       content: [
//         {
//           text: "Lorem"
//         }
//       ],
//       children: []
//     },
//     {
//       type: "paragraph",
//       content: [
//         {
//           text: "dolor"
//         }
//       ],
//       children: []
//     }
//   ];
//   const editor = makeEditorFixture(value);
//   moveNode({
//     from: { container: editor.doc.getNodeAtPath([1]).parent, at: 1 },
//     to: { container: editor.doc.children, at: 0 }
//   });
//   expect(removeIds(editor.toJSON())).toStrictEqual(expectedValue);
// });

// test("move to nest", () => {
//   const value = [
//     {
//       type: "paragraph",
//       content: [{ text: "Lorem" }],
//       children: []
//     },
//     {
//       type: "paragraph",
//       content: [{ text: "ipsum" }],
//       children: []
//     },
//     {
//       type: "paragraph",
//       content: [{ text: "dolor" }],
//       children: []
//     }
//   ];
//   const expectedValue = [
//     {
//       type: "paragraph",
//       content: [
//         {
//           text: "Lorem"
//         }
//       ],
//       children: [
//         {
//           type: "paragraph",
//           content: [
//             {
//               text: "ipsum"
//             }
//           ],
//           children: []
//         }
//       ]
//     },
//     {
//       type: "paragraph",
//       content: [
//         {
//           text: "dolor"
//         }
//       ],
//       children: []
//     }
//   ];
//   const editor = makeEditorFixture(value);

//   // moveNode({ from: { path: [1] }, to: { path: [0, 0] } });

//   moveNode({
//     from: { container: editor.doc.getNodeAtPath([1]).parent, at: 1 },
//     to: { container: editor.doc.getNodeAtPath([0]).get("children"), at: 0 }
//   });
//   expect(removeIds(editor.toJSON())).toStrictEqual(expectedValue);
// });

// test("move nested to unnest", () => {
//   const value = [
//     {
//       type: "paragraph",
//       content: [{ text: "Lorem" }],
//       children: [
//         {
//           type: "paragraph",
//           content: [{ text: "ipsum" }],
//           children: [
//             {
//               type: "paragraph",
//               content: [{ text: "dolor" }],
//               children: []
//             }
//           ]
//         }
//       ]
//     }
//   ];
//   const expectedValue = [
//     {
//       type: "paragraph",
//       content: [
//         {
//           text: "Lorem"
//         }
//       ],
//       children: []
//     },
//     {
//       type: "paragraph",
//       content: [{ text: "ipsum" }],
//       children: [
//         {
//           type: "paragraph",
//           content: [{ text: "dolor" }],
//           children: []
//         }
//       ]
//     }
//   ];
//   const editor = makeEditorFixture(value);

//   moveNode({
//     from: { container: editor.doc.getNodeAtPath([0, 0]).parent, at: 0 },
//     to: { container: editor.doc.children, at: 1 }
//   });
//   expect(removeIds(editor.toJSON())).toStrictEqual(expectedValue);
// });

// test("move nested to unnest deep", () => {
//   const value = [
//     {
//       type: "paragraph",
//       content: [{ text: "Lorem" }],
//       children: [
//         {
//           type: "paragraph",
//           content: [{ text: "ipsum" }],
//           children: [
//             {
//               type: "paragraph",
//               content: [{ text: "dolor" }],
//               children: []
//             }
//           ]
//         }
//       ]
//     }
//   ];
//   const expectedValue = [
//     {
//       type: "paragraph",
//       content: [
//         {
//           text: "Lorem"
//         }
//       ],
//       children: [
//         {
//           type: "paragraph",
//           content: [{ text: "ipsum" }],
//           children: []
//         }
//       ]
//     },
//     {
//       type: "paragraph",
//       content: [{ text: "dolor" }],
//       children: []
//     }
//   ];
//   const editor = makeEditorFixture(value);
//   // moveNode({ from: { path: [0, 0, 0] }, to: { path: [1] } });

//   moveNode({
//     from: { container: editor.doc.getNodeAtPath([0, 0, 0]).parent, at: 0 },
//     to: { container: editor.doc.children, at: 1 }
//   });
//   expect(removeIds(editor.toJSON())).toStrictEqual(expectedValue);
// });

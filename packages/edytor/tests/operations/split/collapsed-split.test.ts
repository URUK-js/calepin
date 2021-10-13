// import { splitNode } from "../../..";
// import { makeEditorFixture, removeIds } from "../../fixture/editorFixture";

// test("split simple", () => {
//   const initialValue = [
//     {
//       type: "paragraph",
//       content: [
//         {
//           text: "Lorem ipsum dolor"
//         }
//       ],
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
//       children: []
//     },
//     {
//       type: "paragraph",
//       content: [
//         {
//           text: " ipsum dolor"
//         }
//       ],
//       children: []
//     }
//   ];

//   const editor = makeEditorFixture(initialValue, { start: { path: [0, 0], offset: 5 } });
//   splitNode(editor);

//   expect(removeIds(editor.toJSON())).toStrictEqual(expectedValue);
// });

// test("split with trailling leaves", () => {
//   const initialValue = [
//     {
//       type: "paragraph",
//       content: [
//         {
//           text: "Lorem ipsum dolor"
//         },
//         {
//           text: " sit amet consectetur adipisicing elit.",
//           bold: true
//         }
//       ],
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
//       children: []
//     },
//     {
//       type: "paragraph",
//       content: [
//         {
//           text: " ipsum dolor"
//         },
//         {
//           text: " sit amet consectetur adipisicing elit.",
//           bold: true
//         }
//       ],
//       children: []
//     }
//   ];

//   const editor = makeEditorFixture(initialValue, { start: { path: [0, 0], offset: 5 } });
//   splitNode(editor);
//   console.log(editor);
//   expect(removeIds(editor.toJSON())).toStrictEqual(expectedValue);
// });

// test("split while having children", () => {
//   const initialValue = [
//     {
//       type: "paragraph",
//       content: [
//         {
//           text: "Lorem ipsum dolor"
//         }
//       ],
//       children: [
//         {
//           type: "paragraph",
//           content: [
//             {
//               text: "Lorem ipsum dolor"
//             }
//           ],
//           children: []
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
//           content: [
//             {
//               text: " ipsum dolor"
//             }
//           ],
//           children: []
//         },
//         {
//           type: "paragraph",
//           content: [
//             {
//               text: "Lorem ipsum dolor"
//             }
//           ],
//           children: []
//         }
//       ]
//     }
//   ];

//   const editor = makeEditorFixture(initialValue, { start: { path: [0, 0], offset: 5 } });
//   splitNode(editor);

//   expect(removeIds(editor.toJSON())).toStrictEqual(expectedValue);
// });

// test("split with traillings leaves while having children", () => {
//   const initialValue = [
//     {
//       type: "paragraph",
//       content: [
//         {
//           text: "Lorem ipsum dolor"
//         },
//         {
//           text: " sit amet consectetur adipisicing elit.",
//           bold: true
//         }
//       ],
//       children: [
//         {
//           type: "paragraph",
//           content: [
//             {
//               text: "Lorem"
//             }
//           ],
//           children: []
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
//           content: [
//             {
//               text: " ipsum dolor"
//             },
//             {
//               text: " sit amet consectetur adipisicing elit.",
//               bold: true
//             }
//           ],
//           children: []
//         },
//         {
//           type: "paragraph",
//           content: [
//             {
//               text: "Lorem"
//             }
//           ],
//           children: []
//         }
//       ]
//     }
//   ];

//   const editor = makeEditorFixture(initialValue, { start: { path: [0, 0], offset: 5 } });
//   splitNode(editor);

//   expect(removeIds(editor.toJSON())).toStrictEqual(expectedValue);
// });

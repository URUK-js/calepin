import { toYJS, splitLeaf } from "../../";

// test("splitLeafSimple", () => {
//   const initialValue = {
//     children: [
//       {
//         type: "paragraph",
//         children: [
//           {
//             text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo"
//           }
//         ]
//       }
//     ]
//   };

//   const expectedValue = {
//     children: [
//       {
//         type: "paragraph",
//         children: [
//           {
//             text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. "
//           },
//           {
//             text: "Rem eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo"
//           }
//         ]
//       }
//     ]
//   };
//   const doc = toYJS(initialValue).getMap("document");
//   splitLeaf({ toYJS: () => doc }, { at: { path: [0, 0], offset: 57 } });

//   expect(doc.toJSON()).toStrictEqual(expectedValue);
// });
// test("splitLeafSimple", () => {
//   const initialValue = {
//     children: [
//       {
//         type: "paragraph",
//         children: [
//           {
//             text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. "
//           }
//         ]
//       }
//     ]
//   };

//   const expectedValue = {
//     children: [
//       {
//         type: "paragraph",
//         children: [
//           {
//             text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. "
//           }
//         ]
//       }
//     ]
//   };
//   const doc = toYJS(initialValue).getMap("document");
//   splitLeaf({ toYJS: () => doc }, { at: { path: [0, 0], offset: 57 } });

//   expect(doc.toJSON()).toStrictEqual(expectedValue);
// });
// test("splitLeafAtStart", () => {
//   const initialValue = {
//     children: [
//         {
//           type: "paragraph",
//           children: [
//             {
//               text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. "
//             },
//             {
//               text: "Rem",
//               bold: true
//             },
//             {
//               text: " eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo"
//             }
//           ]
//         }
//       ]
//   };

//   const expectedValue = {
//     children: [
//         {
//           type: "paragraph",
//           children: [
//             {
//               text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. "
//             },
//             {
//               text: "Rem",
//               bold: true
//             },
//             {
//               text: " eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo"
//             }
//           ]
//         }
//       ]z
//   };
//   const doc = toYJS(initialValue).getMap("document");
//   splitLeaf({ toYJS: () => doc }, { at: { path: [0, 0], offset: 57 } });

//   expect(doc.toJSON()).toStrictEqual(expectedValue);
// });

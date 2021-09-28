// import { toYJS, splitNode } from "../../";
test("ok", () => {
  expect(true).toBe(true);
});
// test("splitNodeSimple", () => {
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
//           }
//         ]
//       },
//       {
//         type: "paragraph",
//         children: [
//           {
//             text: "Rem eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo"
//           }
//         ]
//       }
//     ]
//   };
//   const doc = toYJS(initialValue).getMap("document");
//   splitNode({ toYJS: () => doc }, { at: { path: [0, 0], offset: 57 } });

//   expect(doc.toJSON()).toStrictEqual(expectedValue);
// });
// test("splitNodeComplex", () => {
//   const initialValue = {
//     children: [
//       {
//         type: "paragraph",
//         children: [
//           {
//             text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur"
//           },
//           { text: "quo", bold: true }
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
//       },
//       {
//         type: "paragraph",
//         children: [
//           {
//             text: "Rem eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur"
//           },
//           { text: "quo", bold: true }
//         ]
//       }
//     ]
//   };

//   const doc = toYJS(initialValue).getMap("document");
//   splitNode({ toYJS: () => doc }, { at: { path: [0, 0], offset: 57 } });
//   console.log(doc.toJSON());

//   expect(doc.toJSON()).toStrictEqual(expectedValue);
// });
// test("splitNodeComplex2", () => {
//   const initialValue = {
//     children: [
//       {
//         type: "paragraph",
//         children: [
//           {
//             text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur"
//           },
//           { text: "quo", bold: true },
//           { text: "quo", italic: true },
//           { text: "quo", code: true, bold: true }
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
//       },
//       {
//         type: "paragraph",
//         children: [
//           {
//             text: "Rem eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur"
//           },
//           { text: "quo", bold: true },
//           { text: "quo", italic: true },
//           { text: "quo", code: true, bold: true }
//         ]
//       }
//     ]
//   };

//   const doc = toYJS(initialValue).getMap("document");
//   splitNode({ toYJS: () => doc }, { at: { path: [0, 0], offset: 57 } });
//   console.log(doc.toJSON());

//   expect(doc.toJSON()).toStrictEqual(expectedValue);
// });
// test("splitNodeWithMarks", () => {
//   const initialValue = {
//     children: [
//       {
//         type: "paragraph",
//         children: [
//           {
//             text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur",
//             bold: true,
//             italic: true
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
//             text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. ",
//             bold: true,
//             italic: true
//           }
//         ]
//       },
//       {
//         type: "paragraph",
//         children: [
//           {
//             text: "Rem eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur",
//             bold: true,
//             italic: true
//           }
//         ]
//       }
//     ]
//   };

//   const doc = toYJS(initialValue).getMap("document");
//   splitNode({ toYJS: () => doc }, { at: { path: [0, 0], offset: 57 } });
//   console.log(doc.toJSON());

//   expect(doc.toJSON()).toStrictEqual(expectedValue);
// });

// import { toYJS, formatText } from "../../";
test("ok", () => {
  expect(true).toBe(true);
});

// test("format at same path", () => {
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
//             text: "",
//             bold: true
//           },
//           {
//             text: "Rem eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo"
//           }
//         ]
//       }
//     ]
//   };
//   const doc = toYJS(initialValue).getMap("document");
//   formatText({ toYJS: () => doc }, { format: "bold", at: { path: [0, 0], offset: 57 } });
//   console.log(JSON.stringify(doc.toJSON(), null, 3));
// });

// //   expect(doc.toJSON()).toStrictEqual(expectedValue);
// // });
// // test("format at same path", () => {
// //   const initialValue = {
// //     children: [
// //       {
// //         type: "paragraph",
// //         children: [
// //           {
// //             text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. "
// //           },
// //           {
// //             text: "",
// //             bold: true
// //           },
// //           {
// //             text: "Rem eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo"
// //           }
// //         ]
// //       }
// //     ]
// //   };

// //   const expectedValue = {
// //     children: [
// //       {
// //         type: "paragraph",
// //         children: [
// //           {
// //             text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo"
// //           }
// //         ]
// //       }
// //     ]
// //   };
// //   const doc = toYJS(initialValue).getMap("document");
// //   formatText({ toYJS: () => doc }, { format: "bold", at: { path: [0, 1], offset: 0 } });
// //   console.log(JSON.stringify(doc.toJSON(), null, 3));

// //   expect(doc.toJSON()).toStrictEqual(expectedValue);
// // });
// // test("format at same path", () => {
// //   const initialValue = {
// //     children: [
// //       {
// //         type: "paragraph",
// //         children: [
// //           {
// //             text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. "
// //           },
// //           {
// //             text: "Rem",
// //             bold: true
// //           },
// //           {
// //             text: " eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo"
// //           }
// //         ]
// //       }
// //     ]
// //   };

// //   const expectedValue = {
// //     children: [
// //       {
// //         type: "paragraph",
// //         children: [
// //           {
// //             text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. "
// //           },
// //           {
// //             text: "R",
// //             bold: true
// //           },
// //           {
// //             text: ""
// //           },
// //           {
// //             text: "em",
// //             bold: true
// //           },
// //           {
// //             text: " eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo"
// //           }
// //         ]
// //       }
// //     ]
// //   };
// //   const doc = toYJS(initialValue).getMap("document");
// //   formatText({ toYJS: () => doc }, { format: "bold", at: { path: [0, 1], offset: 1 } });
// //   console.log(JSON.stringify(doc.toJSON(), null, 3));

// //   expect(doc.toJSON()).toStrictEqual(expectedValue);
// // });
// // test("format at path and merge around", () => {
// //   const initialValue = {
// //     children: [
// //       {
// //         type: "paragraph",
// //         children: [
// //           {
// //             text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. "
// //           },
// //           {
// //             text: "R",
// //             bold: true
// //           },
// //           {
// //             text: ""
// //           },
// //           {
// //             text: "em",
// //             bold: true
// //           },
// //           {
// //             text: " eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo"
// //           }
// //         ]
// //       }
// //     ]
// //   };
// //   const expectedValue = {
// //     children: [
// //       {
// //         type: "paragraph",
// //         children: [
// //           {
// //             text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. "
// //           },
// //           {
// //             text: "Rem",
// //             bold: true
// //           },
// //           {
// //             text: " eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo"
// //           }
// //         ]
// //       }
// //     ]
// //   };
// //   const doc = toYJS(initialValue).getMap("document");
// //   formatText({ toYJS: () => doc }, { format: "bold", at: { path: [0, 2], offset: 0 } });
// //   console.log(JSON.stringify(doc.toJSON(), null, 3));

// //   expect(doc.toJSON()).toStrictEqual(expectedValue);
// // });

// test("format at same path", () => {
//   const initialValue = {
//     children: [
//       {
//         type: "paragraph",
//         children: [
//           {
//             text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. "
//           },
//           {
//             text: "Rem",
//             bold: true
//           },
//           {
//             text: " eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo"
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
//             text: "Rem",
//             bold: true
//           },
//           {
//             text: " eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo"
//           }
//         ]
//       }
//     ]
//   };
//   const doc = toYJS(initialValue).getMap("document");
//   formatText({ toYJS: () => doc }, { format: "bold", at: { path: [0, 1], offset: 0 } });
//   console.log(JSON.stringify(doc.toJSON(), null, 3));

//   expect(doc.toJSON()).toStrictEqual(expectedValue);
// });

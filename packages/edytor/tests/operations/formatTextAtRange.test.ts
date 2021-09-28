// import { toYJS, formatText } from "../../";

// test("format range at same path", () => {
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
//   formatText(
//     { toYJS: () => doc },
//     { format: "bold", range: { start: { path: [0, 0], offset: 57 }, end: { path: [0, 0], offset: 60 } } }
//   );
//   console.log(JSON.stringify(doc.toJSON(), null, 3));

//   expect(doc.toJSON()).toStrictEqual(expectedValue);
// });

// test("format range  at same path 2", () => {
//   const initialValue = {
//     children: [
//       {
//         type: "paragraph",
//         children: [
//           {
//             text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo"
//           },
//           {
//             text: "Coucou",
//             bold: true
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
//           },
//           {
//             text: "Coucou",
//             bold: true
//           }
//         ]
//       }
//     ]
//   };
//   const doc = toYJS(initialValue).getMap("document");
//   formatText(
//     { toYJS: () => doc },
//     { format: "bold", range: { start: { path: [0, 0], offset: 57 }, end: { path: [0, 0], offset: 60 } } }
//   );

//   expect(doc.toJSON()).toStrictEqual(expectedValue);
// });

// test("format range  at same path without remaining text", () => {
//   const initialValue = {
//     children: [
//       {
//         type: "paragraph",
//         children: [
//           {
//             text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem"
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
//           }
//         ]
//       }
//     ]
//   };
//   const doc = toYJS(initialValue).getMap("document");
//   formatText(
//     { toYJS: () => doc },
//     { format: "bold", range: { start: { path: [0, 0], offset: 57 }, end: { path: [0, 0], offset: 60 } } }
//   );

//   expect(doc.toJSON()).toStrictEqual(expectedValue);
// });

// test("format at same path with already formated text", () => {
//   const initialValue = {
//     children: [
//       {
//         type: "paragraph",
//         children: [
//           {
//             text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo",
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
//             italic: true
//           },
//           {
//             text: "Rem",
//             bold: true,
//             italic: true
//           },
//           {
//             text: " eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo",
//             italic: true
//           }
//         ]
//       }
//     ]
//   };
//   const doc = toYJS(initialValue).getMap("document");
//   formatText(
//     { toYJS: () => doc },
//     { format: "bold", range: { start: { path: [0, 0], offset: 57 }, end: { path: [0, 0], offset: 60 } } }
//   );

//   expect(doc.toJSON()).toStrictEqual(expectedValue);
// });
// test("partial unformat at range", () => {
//   const initialValue = {
//     children: [
//       {
//         type: "paragraph",
//         children: [
//           {
//             text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo",
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
//             italic: true
//           },
//           {
//             text: "Rem"
//           },
//           {
//             text: " eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo",
//             italic: true
//           }
//         ]
//       }
//     ]
//   };
//   const doc = toYJS(initialValue).getMap("document");
//   formatText(
//     { toYJS: () => doc },
//     { format: "italic", range: { start: { path: [0, 0], offset: 57 }, end: { path: [0, 0], offset: 60 } } }
//   );
//   console.log(JSON.stringify(doc.toJSON(), null, 3));
//   expect(doc.toJSON()).toStrictEqual(expectedValue);
// });

// test("format at same path and then unformat", () => {
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

//   const doc = toYJS(initialValue).getMap("document");
//   formatText(
//     { toYJS: () => doc },
//     { format: "bold", range: { start: { path: [0, 0], offset: 57 }, end: { path: [0, 0], offset: 60 } } }
//   );
//   console.log(JSON.stringify(doc.toJSON(), null, 3));
//   formatText(
//     { toYJS: () => doc },
//     { format: "bold", range: { start: { path: [0, 1], offset: 0 }, end: { path: [0, 1], offset: 3 } } }
//   );
//   console.log(JSON.stringify(doc.toJSON(), null, 3));

//   expect(doc.toJSON()).toStrictEqual(initialValue);
// });

// test("partial unformat at range", () => {
//   const initialValue = {
//     children: [
//       {
//         type: "paragraph",
//         children: [
//           {
//             text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. ",
//             bold: true
//           },
//           {
//             text: "Rem"
//           },
//           {
//             text: " eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo",
//             bold: true
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
//             bold: true
//           },
//           {
//             text: "Rem",
//             italic: true
//           },
//           {
//             text: " eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo",
//             bold: true
//           }
//         ]
//       }
//     ]
//   };
//   const doc = toYJS(initialValue).getMap("document");
//   formatText(
//     { toYJS: () => doc },
//     { format: "italic", range: { start: { path: [0, 1], offset: 0 }, end: { path: [0, 1], offset: 3 } } }
//   );
//   console.log(JSON.stringify(doc.toJSON(), null, 3));
//   expect(doc.toJSON()).toStrictEqual(expectedValue);
// });

// test("partial unformat at range", () => {
//   const initialValue = {
//     children: [
//       {
//         type: "paragraph",
//         children: [
//           {
//             text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. ",
//             bold: true
//           },
//           {
//             text: "Rem"
//           },
//           {
//             text: " eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo",
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
//             bold: true
//           },
//           {
//             text: "Rem eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo",
//             italic: true
//           }
//         ]
//       }
//     ]
//   };
//   const doc = toYJS(initialValue).getMap("document");
//   formatText(
//     { toYJS: () => doc },
//     { format: "italic", range: { start: { path: [0, 1], offset: 0 }, end: { path: [0, 1], offset: 3 } } }
//   );
//   console.log(JSON.stringify(doc.toJSON(), null, 3));
//   expect(doc.toJSON()).toStrictEqual(expectedValue);
// });

// test("partial unformat at range", () => {
//   const initialValue = {
//     children: [
//       {
//         type: "paragraph",
//         children: [
//           {
//             text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. ",
//             bold: true
//           },
//           {
//             text: "Rem"
//           },
//           {
//             text: " eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo"
//           },
//           {
//             text: " eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo",
//             code: true
//           },
//           {
//             text: " eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo",
//             bold: true
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
//             bold: true
//           },
//           {
//             text: "Rem",
//             italic: true
//           },
//           {
//             text: " eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo"
//           },
//           {
//             text: " eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo",
//             code: true
//           },
//           {
//             text: " eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo",
//             bold: true
//           }
//         ]
//       }
//     ]
//   };
//   const doc = toYJS(initialValue).getMap("document");
//   formatText(
//     { toYJS: () => doc },
//     { format: "italic", range: { start: { path: [0, 1], offset: 0 }, end: { path: [0, 1], offset: 3 } } }
//   );
//   console.log(JSON.stringify(doc.toJSON(), null, 3));
//   expect(doc.toJSON()).toStrictEqual(expectedValue);
// });

// test("partial unformat at range", () => {
//   const initialValue = {
//     children: [
//       {
//         type: "paragraph",
//         children: [
//           {
//             text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. ",
//             bold: true
//           },
//           {
//             text: "Rem"
//           },
//           {
//             text: " eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo"
//           },
//           {
//             text: " eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo",
//             code: true
//           },
//           {
//             text: " eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo",
//             bold: true
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
//             bold: true
//           },
//           {
//             text: "Rem",
//             italic: true
//           },
//           {
//             text: " eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo"
//           },
//           {
//             text: " eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo",
//             code: true
//           },
//           {
//             text: " eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo",
//             bold: true
//           }
//         ]
//       }
//     ]
//   };
//   const doc = toYJS(initialValue).getMap("document");
//   formatText(
//     { toYJS: () => doc },
//     { format: "italic", range: { start: { path: [0, 1], offset: 0 }, end: { path: [0, 1], offset: 3 } } }
//   );
//   console.log(JSON.stringify(doc.toJSON(), null, 3));
//   expect(doc.toJSON()).toStrictEqual(expectedValue);
// });

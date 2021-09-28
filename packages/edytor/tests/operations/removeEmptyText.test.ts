// import { toYJS, removeEmptyText } from "../..";

// test("remove empty text", () => {
//   const initialValue = {
//     children: [
//       {
//         type: "wrap",
//         children: [
//           {
//             type: "paragraph",
//             children: [
//               { type: "link", children: [{ text: "hello" }] },
//               { type: "paragraph", children: [{ text: "bonjour" }] }
//             ]
//           }
//         ]
//       }
//     ]
//   };
//   const expectedValue = {
//     children: [
//       {
//         type: "wrap",
//         children: [{ type: "paragraph", children: [{ type: "paragraph", children: [{ text: "bonjour" }] }] }]
//       }
//     ]
//   };
//   const doc = toYJS(initialValue).getMap("document");

//   const text = doc
//     .get("children")
//     .get(0)
//     .get("children")
//     .get(0)
//     .get("children")
//     .get(0)
//     .get("children")
//     .get(0)
//     .get("text");

//   removeEmptyText(text);

//   expect(doc.toJSON()).toStrictEqual(expectedValue);
// });

// test("remove empty text", () => {
//   const initialValue = {
//     children: [
//       {
//         type: "wrap",
//         children: [
//           {
//             type: "paragraph",
//             children: [{ type: "link", children: [{ text: "hello" }] }]
//           }
//         ]
//       }
//     ]
//   };
//   const expectedValue = {
//     children: []
//   };
//   const doc = toYJS(initialValue).getMap("document");

//   const text = doc
//     .get("children")
//     .get(0)
//     .get("children")
//     .get(0)
//     .get("children")
//     .get(0)
//     .get("children")
//     .get(0)
//     .get("text");

//   removeEmptyText(text);

//   expect(doc.toJSON()).toStrictEqual(expectedValue);
// });

// test("remove empty text", () => {
//   const initialValue = {
//     children: [
//       {
//         type: "wrap",
//         children: [
//           {
//             type: "paragraph",
//             children: [{ type: "link", children: [{ text: "hello" }] }]
//           }
//         ]
//       },
//       {
//         type: "wrap",
//         children: [
//           {
//             type: "paragraph",
//             children: [
//               { type: "link", children: [{ text: "hello" }] },
//               { type: "paragraph", children: [{ text: "bonjour" }] }
//             ]
//           }
//         ]
//       }
//     ]
//   };
//   const expectedValue = {
//     children: [
//       {
//         type: "wrap",
//         children: [
//           {
//             type: "paragraph",
//             children: [
//               { type: "link", children: [{ text: "hello" }] },
//               { type: "paragraph", children: [{ text: "bonjour" }] }
//             ]
//           }
//         ]
//       }
//     ]
//   };
//   const doc = toYJS(initialValue).getMap("document");

//   const text = doc
//     .get("children")
//     .get(0)
//     .get("children")
//     .get(0)
//     .get("children")
//     .get(0)
//     .get("children")
//     .get(0)
//     .get("text");

//   removeEmptyText(text);
//   console.log(text.toJSON());
//   console.log(JSON.stringify(doc.toJSON(), null, 3));
//   expect(doc.toJSON()).toStrictEqual(expectedValue);
// });
// test("remove empty text", () => {
//   const initialValue = {
//     children: [
//       { type: "heading", children: [{ text: "L" }] },
//       { type: "paragraph", children: [{ text: "L" }, { text: "bold", bold: true }] },
//       { type: "block-quote", children: [{ text: "toBeRemove" }] },
//       { type: "paragraph", children: [{ text: "L" }, { text: "bold", bold: true }] },
//       { type: "block-quote", children: [{ text: "L" }] }
//     ]
//   };
//   const expectedValue = {
//     children: [
//       { type: "heading", children: [{ text: "L" }] },
//       { type: "paragraph", children: [{ text: "L" }, { text: "bold", bold: true }] },
//       { type: "paragraph", children: [{ text: "L" }, { text: "bold", bold: true }] },
//       { type: "block-quote", children: [{ text: "L" }] }
//     ]
//   };
//   const doc = toYJS(initialValue).getMap("document");

//   const text = doc.get("children").get(2).get("children").get(0).get("text");

//   removeEmptyText(text);

//   expect(doc.toJSON()).toStrictEqual(expectedValue);
// });

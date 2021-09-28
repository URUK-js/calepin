// import { areLeafsMergeable, mergeLeafs, toYJS } from "../../";

// test("Sould merge simple", () => {
//   const initialValue = {
//     children: [
//       {
//         type: "paragraph",
//         children: [
//           {
//             text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo"
//           },
//           {
//             text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo"
//           },
//           {
//             text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo"
//           }
//         ]
//       }
//     ]
//   };
//   const doc = toYJS(initialValue).getMap("document");
//   const nodes = doc.get("children").get(0).get("children").toArray();

//   const shouldMerge = areLeafsMergeable(nodes);
//   expect(shouldMerge).toBe(true);
// });
// test("Should merge complex", () => {
//   const initialValue = {
//     children: [
//       {
//         type: "paragraph",
//         children: [
//           {
//             text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo",
//             bold: true,
//             italic: true
//           },
//           {
//             text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo",
//             italic: true,
//             bold: true
//           },
//           {
//             text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo",
//             bold: true,
//             italic: true
//           }
//         ]
//       }
//     ]
//   };
//   const doc = toYJS(initialValue).getMap("document");
//   const nodes = doc.get("children").get(0).get("children").toArray();
//   const shouldMerge = areLeafsMergeable(nodes);
//   expect(shouldMerge).toBe(true);
// });
// test("Should not merge", () => {
//   const initialValue = {
//     children: [
//       {
//         type: "paragraph",
//         children: [
//           {
//             text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo",
//             bold: true,
//             italic: true
//           },
//           {
//             text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo",
//             italic: true
//           },
//           {
//             text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo",
//             bold: true,
//             italic: true
//           }
//         ]
//       }
//     ]
//   };
//   const doc = toYJS(initialValue).getMap("document");
//   const nodes = doc.get("children").get(0).get("children").toArray();
//   const shouldMerge = areLeafsMergeable(nodes);
//   expect(shouldMerge).toBe(false);
// });

// test("Merge leafs", () => {
//   const initialValue = {
//     children: [
//       {
//         type: "paragraph",
//         children: [
//           {
//             text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo"
//           },
//           {
//             text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo"
//           },
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
//             text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quoLorem ipsum dolor sit amet consectetur adipisicing elit. Rem eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quoLorem ipsum dolor sit amet consectetur adipisicing elit. Rem eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo"
//           }
//         ]
//       }
//     ]
//   };
//   const doc = toYJS(initialValue).getMap("document");
//   const nodes = doc.get("children").get(0).get("children");

//   mergeLeafs({ toYJS: () => doc }, nodes);

//   expect(doc.toJSON()).toStrictEqual(expectedValue);
// });

// test("Merge leafs", () => {
//   const initialValue = {
//     children: [
//       {
//         type: "paragraph",
//         children: [
//           {
//             text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo",
//             bold: true
//           },
//           {
//             text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo"
//           },
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
//             text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo",
//             bold: true
//           },
//           {
//             text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quoLorem ipsum dolor sit amet consectetur adipisicing elit. Rem eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo"
//           }
//         ]
//       }
//     ]
//   };
//   const doc = toYJS(initialValue).getMap("document");
//   const nodes = doc.get("children").get(0).get("children");

//   mergeLeafs({ toYJS: () => doc }, nodes);
//   expect(doc.toJSON()).toStrictEqual(expectedValue);
// });
// test("Merge leafs", () => {
//   const initialValue = {
//     children: [
//       {
//         type: "paragraph",
//         children: [
//           {
//             text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo"
//           },
//           {
//             text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo",
//             bold: true
//           },
//           {
//             text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo",
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
//             text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo"
//           },
//           {
//             bold: true,
//             text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quoLorem ipsum dolor sit amet consectetur adipisicing elit. Rem eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo"
//           }
//         ]
//       }
//     ]
//   };
//   const doc = toYJS(initialValue).getMap("document");
//   const nodes = doc.get("children").get(0).get("children");

//   mergeLeafs({ toYJS: () => doc }, nodes);
//   console.log(JSON.stringify(doc.toJSON(), null, 3));
//   expect(doc.toJSON()).toStrictEqual(expectedValue);
// });
// test("Do not Merge leafs", () => {
//   const initialValue = {
//     children: [
//       {
//         type: "paragraph",
//         children: [
//           { text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. " },
//           { text: "Rem", bold: true },
//           { text: " eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo" }
//         ]
//       }
//     ]
//   };
//   const expectedValue = {
//     children: [
//       {
//         type: "paragraph",
//         children: [
//           { text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. " },
//           { text: "Rem", bold: true },
//           { text: " eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo" }
//         ]
//       }
//     ]
//   };
//   const doc = toYJS(initialValue).getMap("document");
//   const nodes = doc.get("children").get(0).get("children");

//   mergeLeafs({ toYJS: () => doc }, nodes);
//   console.log(JSON.stringify(doc.toJSON(), null, 3));
//   expect(doc.toJSON()).toStrictEqual(expectedValue);
// });

// test("Merge leafs", () => {
//   const initialValue = {
//     children: [
//       {
//         type: "paragraph",
//         children: [
//           {
//             text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo",
//             bold: true
//           },
//           {
//             text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo",
//             bold: true
//           },
//           {
//             text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo"
//           },
//           {
//             text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo"
//           },
//           {
//             text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo"
//           },
//           {
//             text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo",
//             italic: true
//           },
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
//             text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quoLorem ipsum dolor sit amet consectetur adipisicing elit. Rem eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo",
//             bold: true
//           },
//           {
//             text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quoLorem ipsum dolor sit amet consectetur adipisicing elit. Rem eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quoLorem ipsum dolor sit amet consectetur adipisicing elit. Rem eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo"
//           },
//           {
//             text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quoLorem ipsum dolor sit amet consectetur adipisicing elit. Rem eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo",
//             italic: true
//           }
//         ]
//       }
//     ]
//   };
//   const doc = toYJS(initialValue).getMap("document");
//   const nodes = doc.get("children").get(0).get("children");

//   mergeLeafs({ toYJS: () => doc }, nodes);

//   expect(doc.toJSON()).toStrictEqual(expectedValue);
// });

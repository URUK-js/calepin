// import { getYNode, jsonNodeToYNode, toJSON, toYJS } from "../../src/Editor/jsonConverter";
test("ok", () => {
  expect(true).toBe(true);
});
// const value = {
//   children: [
//     {
//       type: "paragraph",
//       children: [
//         {
//           text: "Lorem ipsum dolor, sit amet consectetur adipisicing elit."
//         },
//         {
//           text: "bold",
//           bold: true
//         }
//       ]
//     },
//     {
//       type: "paragraph",
//       children: [
//         {
//           text: "italic bold",
//           bold: true,
//           italic: true
//         }
//       ]
//     }
//   ]
// };
// test("converter", () => {
//   const doc = toYJS(value);
//   expect(toJSON(doc)).toStrictEqual(value);
//   expect(toJSON(doc)).toStrictEqual(doc.getMap("document").toJSON());
// });
// test("nodeConverter", () => {
//   const doc = toYJS(value);
//   const node = doc.getMap("document").get("children").get(0);
//   const json = node.toJSON();
//   expect(jsonNodeToYNode(json).toJSON()).toStrictEqual(json);
// });

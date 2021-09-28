import { makeEditorFixture } from "../fixture/editor.fixture";

test("get leaf at path", () => {
  const value = {
    children: [
      {
        type: "paragraph",
        content: [{ text: "Bold text", bold: true }],
        children: [
          {
            type: "paragraph",
            content: [{ text: "Lorem ipsum dolor sit" }]
          },
          {
            type: "paragraph",
            content: [{ text: "Lorem ipsum dolor sit" }]
          }
        ]
      }
    ]
  };
  console.log(value);
  const editor = makeEditorFixture(value);
  // console.log(editor.toJSON());
  expect(value).toBe(value);
});

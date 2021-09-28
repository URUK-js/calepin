import { makeEditorFixture } from "../fixture/editorFixture";

test("no range", () => {
  const value = [
    {
      type: "paragraph",
      data: { comment: "hello" },
      content: [{ text: "Bold text", bold: true }],
      children: [
        {
          type: "paragraph",
          content: [{ text: "Lorem ipsum dolor sit", italic: true }]
        },
        {
          type: "paragraph",
          content: [{ text: "Lorem ipsum dolor sit", data: { comment: "hello" } }]
        }
      ]
    }
  ];

  const editor = makeEditorFixture(value);
  console.log(editor.selection());
});

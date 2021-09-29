import { deleteText } from "../..";
import { makeEditorFixture } from "../fixture/editorFixture";

test("insert hello", () => {
  const value = [
    {
      type: "paragraph",
      content: [{ text: "" }],
      children: []
    }
  ];
  const editor = makeEditorFixture(value);
  console.log(editor);

  expect(editor.doc.string()).toBe("");
});

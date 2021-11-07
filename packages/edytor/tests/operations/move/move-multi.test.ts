import { moveNode } from "../../..";
import { getNodeAtPath } from "../../../src";
import { makeEditorFixture, removeIds } from "../../fixture/editorFixture";

test("move to reorder", () => {
  const value = [
    {
      type: "paragraph",
      content: [{ text: "Lorem" }],
      children: []
    },
    {
      type: "paragraph",
      content: [{ text: "ipsum" }],
      children: []
    },
    {
      type: "paragraph",
      content: [{ text: "dolor" }],
      children: []
    }
  ];
  const expectedValue = [
    {
      type: "paragraph",
      content: [
        {
          text: "ipsum"
        }
      ],
      children: []
    },
    {
      type: "paragraph",
      content: [
        {
          text: "dolor"
        }
      ],
      children: []
    },
    {
      type: "paragraph",
      content: [
        {
          text: "Lorem"
        }
      ],
      children: []
    }
  ];
  const editor = makeEditorFixture(value);
  moveNode({
    from: { container: getNodeAtPath(editor, [1]).parent, at: [1, 2] },
    to: { container: editor.children, at: 0 }
  });
  expect(removeIds(editor.toJSON())).toStrictEqual(expectedValue);
});

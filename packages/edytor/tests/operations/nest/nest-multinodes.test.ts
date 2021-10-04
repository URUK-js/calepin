import { nestNode } from "../../..";
import { makeEditorFixture, removeIds } from "../../fixture/editorFixture";

test("nest multinodes", () => {
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
          text: "Lorem"
        }
      ],
      children: [
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
        }
      ]
    }
  ];
  const editor = makeEditorFixture(value, { start: { path: [1, 0], offset: 0 }, end: { path: [2, 0], offset: 1 } });
  nestNode(editor);

  expect(removeIds(editor.toJSON())).toStrictEqual(expectedValue);
});

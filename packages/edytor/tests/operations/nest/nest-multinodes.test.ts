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
    },
    {
      type: "paragraph",
      content: [{ text: "dolor" }],
      children: []
    }
  ];
  const editor = makeEditorFixture(value, { start: { path: [1, 0], offset: 0 }, end: { path: [2, 0], offset: 1 } });
  nestNode(editor);

  expect(removeIds(editor.toJSON())).toStrictEqual(expectedValue);
});

test("nest multinodes should fail silently", () => {
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
    },
    {
      type: "paragraph",
      content: [{ text: "dolor" }],
      children: []
    }
  ];

  const editor = makeEditorFixture(value, { start: { path: [0, 0], offset: 0 }, end: { path: [1, 0], offset: 1 } });
  nestNode(editor);

  expect(removeIds(editor.toJSON())).toStrictEqual(value);
});
test("nest multinodes nested", () => {
  const value = [
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
        },
        {
          type: "paragraph",
          content: [{ text: "sit" }],
          children: []
        }
      ]
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
          children: [
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
              content: [{ text: "sit" }],
              children: []
            }
          ]
        }
      ]
    }
  ];
  const editor = makeEditorFixture(value, {
    start: { path: [0, 1, 0], offset: 0 },
    end: { path: [0, 2, 0], offset: 1 }
  });

  nestNode(editor);

  console.log(JSON.stringify(removeIds(editor.toJSON()), null, 3));
  expect(removeIds(editor.toJSON())).toStrictEqual(expectedValue);
});

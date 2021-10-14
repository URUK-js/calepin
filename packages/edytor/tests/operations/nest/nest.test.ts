import { nestNode } from "../../..";
import { makeEditorFixture } from "../../fixture/editorFixture";

test("nest at 0 depth with prev node", () => {
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
        }
      ]
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
  ];

  const editor = makeEditorFixture(value, { start: { path: [1, 0], offset: 0 } });
  nestNode(editor);

  expect(editor.toJSON()).toStrictEqual(expectedValue);
});

test("nest deep with prev node", () => {
  const value = [
    {
      type: "paragraph",
      content: [{ text: "Lorem" }],
      children: [
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
            }
          ]
        }
      ]
    }
  ];
  const editor = makeEditorFixture(value, { start: { path: [0, 1, 0], offset: 0 } });
  nestNode(editor);

  expect(editor.toJSON()).toStrictEqual(expectedValue);
});

test("nest with prev node that do not exist", () => {
  const value = [
    {
      type: "paragraph",
      content: [{ text: "Lorem" }],
      children: [
        {
          type: "paragraph",
          content: [{ text: "ipsum" }],
          children: []
        },
        {
          type: "paragraph",
          content: [{ text: "ipsum" }],
          children: []
        }
      ]
    }
  ];
  const editor = makeEditorFixture(value, { start: { path: [0, 0, 0], offset: 0 } });
  nestNode(editor);
  expect(editor.toJSON()).toStrictEqual(value);
});

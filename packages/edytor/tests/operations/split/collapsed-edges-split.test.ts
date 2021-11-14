import { splitNode, getLeafAtPath } from "../../..";
import { makeEditorFixture, removeIds } from "../../fixture/editorFixture";

test("split at start", () => {
  const initialValue = [
    {
      type: "paragraph",
      content: [
        {
          text: "Lorem ipsum dolor"
        }
      ],
      children: []
    }
  ];

  const expectedValue = [
    {
      type: "paragraph",
      content: [
        {
          text: ""
        }
      ],
      children: []
    },
    {
      type: "paragraph",
      content: [
        {
          text: "Lorem ipsum dolor"
        }
      ],
      children: []
    }
  ];

  const editor = makeEditorFixture(initialValue, { start: { path: [0, 0], offset: 0 } });
  splitNode(editor);

  expect(removeIds(editor.toJSON())).toStrictEqual(expectedValue);
});

test("split at start nested", () => {
  const initialValue = [
    {
      type: "paragraph",
      content: [
        {
          text: "Lorem "
        }
      ],
      children: [
        {
          type: "paragraph",
          content: [
            {
              text: "ipsum "
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

  const expectedValue = [
    {
      type: "paragraph",
      content: [
        {
          text: "Lorem "
        }
      ],
      children: [
        {
          type: "paragraph",
          content: [
            {
              text: "ipsum "
            }
          ],
          children: [
            {
              type: "paragraph",
              content: [
                {
                  text: ""
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
      ]
    }
  ];

  const editor = makeEditorFixture(initialValue, { start: { path: [0, 0, 0, 0], offset: 0 } });
  splitNode(editor);
  expect(removeIds(editor.toJSON())).toStrictEqual(expectedValue);
});

//
// END
//

test("split at end", () => {
  const initialValue = [
    {
      type: "paragraph",
      content: [
        {
          text: "Lorem ipsum dolor"
        }
      ],
      children: []
    }
  ];

  const expectedValue = [
    {
      type: "paragraph",
      content: [
        {
          text: "Lorem ipsum dolor"
        }
      ],
      children: []
    },
    {
      type: "paragraph",
      content: [
        {
          text: ""
        }
      ],
      children: []
    }
  ];

  const editor = makeEditorFixture(initialValue, { start: { path: [0, 0], offset: 17 } });
  splitNode(editor);

  expect(removeIds(editor.toJSON())).toStrictEqual(expectedValue);
});

test("split at end nested", () => {
  const initialValue = [
    {
      type: "paragraph",
      content: [
        {
          text: "Lorem "
        }
      ],
      children: [
        {
          type: "paragraph",
          content: [
            {
              text: "ipsum "
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

  const expectedValue = [
    {
      type: "paragraph",
      content: [
        {
          text: "Lorem "
        }
      ],
      children: [
        {
          type: "paragraph",
          content: [
            {
              text: "ipsum "
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
              content: [
                {
                  text: ""
                }
              ],
              children: []
            }
          ]
        }
      ]
    }
  ];

  const editor = makeEditorFixture(initialValue, { start: { path: [0, 0, 0, 0], offset: 5 } });
  splitNode(editor);
  expect(removeIds(editor.toJSON())).toStrictEqual(expectedValue);
});

test("split at end nested", () => {
  const initialValue = [
    {
      type: "paragraph",
      content: [
        {
          text: "Lorem "
        }
      ],
      children: [
        {
          type: "paragraph",
          content: [
            {
              text: "ipsum "
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

  const expectedValue = [
    {
      type: "paragraph",
      content: [
        {
          text: "Lorem "
        }
      ],
      children: [
        {
          type: "paragraph",
          content: [
            {
              text: "ipsum "
            }
          ],
          children: [
            {
              type: "paragraph",
              content: [
                {
                  text: ""
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
      ]
    }
  ];

  const editor = makeEditorFixture(initialValue, { start: { path: [0, 0, 0], offset: 6 } });
  splitNode(editor);
  console.log(JSON.stringify(editor.toJSON(), null, 3), getLeafAtPath(editor, [0, 0, 0]).toJSON());
  expect(removeIds(editor.toJSON())).toStrictEqual(expectedValue);
});

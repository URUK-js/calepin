import { deleteText } from "../../..";
import { makeEditorFixture } from "../../fixture/editorFixture";

test("delete one back", () => {
  const value = [
    {
      type: "paragraph",
      content: [{ text: "hello" }],
      children: []
    }
  ];
  const expectedValue = [
    {
      type: "paragraph",
      content: [{ text: "hell" }],
      children: []
    }
  ];
  const editor = makeEditorFixture(value, { start: { path: [0, 0], offset: 4 } });
  deleteText(editor, { mode: "forward" });
  expect(editor.toJSON()).toStrictEqual(expectedValue);
  expect(editor.toRawText()).toBe("hell");
});

test("delete formward end of leaf should delete the start of the next ", () => {
  const value = [
    {
      type: "paragraph",
      content: [
        { text: "hello", bold: true },
        { text: " edytor", italic: true }
      ],
      children: []
    }
  ];
  const expectedValue = [
    {
      type: "paragraph",
      content: [
        { text: "hello", bold: true },
        { text: "edytor", italic: true }
      ],
      children: []
    }
  ];
  const editor = makeEditorFixture(value, { start: { path: [0, 0], offset: 5 } });
  deleteText(editor, { mode: "forward" });
  expect(editor.toRawText()).toBe("helloedytor");
  expect(editor.toJSON()).toStrictEqual(expectedValue);
});

test("delet deep", () => {
  const value = [
    {
      type: "paragraph",
      content: [
        { text: "hello", bold: true },
        { text: " edyt", italic: true }
      ],
      children: []
    }
  ];
  const editor = makeEditorFixture(value, { start: { path: [0, 1], offset: 4 } });
  deleteText(editor, { mode: "forward" });
  expect(editor.toRawText()).toBe("hello edy");
});

test("should fail silently", () => {
  const value = [
    {
      type: "paragraph",
      content: [{ text: "hello", bold: true }],
      children: []
    }
  ];
  const editor = makeEditorFixture(value, { start: { path: [0, 1], offset: 10 } });
  deleteText(editor, { mode: "forward" });
  expect(editor.toRawText()).toBe("hello");
});

test("delete at end to merge forward node", () => {
  const value = [
    {
      id: "delete",
      type: "paragraph",
      content: [{ text: "hello edytor" }],
      children: []
    },
    {
      id: "delete2",
      type: "paragraph",
      content: [{ text: " from the tests" }],
      children: []
    }
  ];

  const expectedValue = [
    {
      type: "paragraph",
      content: [{ text: "hello edytor from the tests" }],
      children: []
    }
  ];

  const editor = makeEditorFixture(value, { start: { path: [0, 0], offset: 12 } });
  deleteText(editor, { mode: "forward" });
  console.log(JSON.stringify(editor.toJSON(), null, 3));
  expect(editor.toJSON()).toStrictEqual(expectedValue);
});

test("delete at end deep should merge with next leaf and push up children", () => {
  const value = [
    {
      id: "delete",
      type: "paragraph",
      content: [{ text: "hello edytor" }],
      children: []
    },
    {
      id: "delete2",
      type: "paragraph",
      content: [{ text: " from the tests" }],
      children: [
        {
          id: "delete3",
          type: "paragraph",
          content: [{ text: " from the tests" }],
          children: []
        }
      ]
    }
  ];

  const expectedValue = [
    {
      type: "paragraph",
      content: [{ text: "hello edytor from the tests" }],
      children: []
    },
    {
      type: "paragraph",
      content: [{ text: " from the tests" }],
      children: []
    }
  ];

  const editor = makeEditorFixture(value, { start: { path: [0, 0], offset: 12 } });
  deleteText(editor, { mode: "forward" });

  expect(editor.toJSON()).toStrictEqual(expectedValue);
});

test("delete at end", () => {
  const value = [
    {
      id: "1",
      type: "paragraph",
      content: [{ text: "hello edytor" }],
      children: []
    },
    {
      id: "2",
      type: "paragraph",
      content: [{ text: " from the tests" }],
      children: [
        {
          id: "3",
          type: "paragraph",
          content: [{ text: " from the tests" }],
          children: []
        }
      ]
    },
    {
      id: "4",
      type: "paragraph",
      content: [{ text: "paragraph4" }],
      children: [
        {
          id: "5",
          type: "paragraph",
          content: [{ text: "paragraph5" }],
          children: [
            {
              id: "6",
              type: "paragraph",
              content: [{ text: "paragraph6" }],
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
      content: [{ text: "hello edytor" }],
      children: []
    },
    {
      type: "paragraph",
      content: [{ text: " from the tests" }],
      children: [
        {
          type: "paragraph",
          content: [{ text: " from the tests" }],
          children: []
        }
      ]
    },
    {
      type: "paragraph",
      content: [{ text: "paragraph4" }],
      children: [
        {
          type: "paragraph",
          content: [{ text: "paragraph5paragraph6" }],
          children: []
        }
      ]
    }
  ];

  const editor = makeEditorFixture(value, { start: { path: [2, 0, 0], offset: 10 } });

  deleteText(editor, { mode: "forward" });

  expect(editor.toJSON()).toStrictEqual(expectedValue);
});

test("delete at end should merge next children with current leaf and welcome its children", () => {
  const value = [
    {
      id: "delete",
      type: "paragraph",
      content: [{ text: "hello edytor" }],
      children: []
    },
    {
      id: "delete2",
      type: "paragraph",
      content: [{ text: " from the tests" }],
      children: [
        {
          id: "delete3",
          type: "paragraph",
          content: [{ text: " from the tests" }],
          children: []
        }
      ]
    },
    {
      type: "paragraph",
      content: [{ text: "COUCOU" }],
      children: []
    }
  ];

  const expectedValue = [
    {
      type: "paragraph",
      content: [{ text: "hello edytor from the tests" }],
      children: []
    },
    {
      type: "paragraph",
      content: [{ text: " from the tests" }],
      children: []
    },
    {
      type: "paragraph",
      content: [{ text: "COUCOU" }],
      children: []
    }
  ];

  const editor = makeEditorFixture(value, { start: { path: [0, 0], offset: 12 } });
  deleteText(editor, { mode: "forward" });

  expect(editor.toJSON()).toStrictEqual(expectedValue);
});

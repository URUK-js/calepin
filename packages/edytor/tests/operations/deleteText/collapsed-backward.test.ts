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
  const editor = makeEditorFixture(value, { start: { path: [0, 0], offset: 5 } });
  deleteText(editor, { mode: "backward" });
  expect(editor.doc.string()).toBe("hell");
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
  const editor = makeEditorFixture(value, { start: { path: [0, 1], offset: 5 } });
  deleteText(editor, { mode: "backward" });
  expect(editor.doc.string()).toBe("hello edy");
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
  deleteText(editor, { mode: "backward" });
  expect(editor.doc.string()).toBe("hello");
});

test("delete at start", () => {
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
      id: "delete",
      type: "paragraph",
      content: [{ text: "hello edytor from the tests" }],
      children: []
    }
  ];
  const editor = makeEditorFixture(value, { start: { path: [1, 0], offset: 0 } });
  deleteText(editor, { mode: "backward" });

  expect(editor.toJSON()).toStrictEqual(expectedValue);
});

test("delete at start deep shoul merge with prev leaf", () => {
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
      id: "delete",
      type: "paragraph",
      content: [{ text: "hello edytor from the tests" }],
      children: []
    },
    {
      id: "delete3",
      type: "paragraph",
      content: [{ text: " from the tests" }],
      children: []
    }
  ];

  const editor = makeEditorFixture(value, { start: { path: [1, 0], offset: 0 } });
  deleteText(editor, { mode: "backward" });
  expect(editor.toJSON()).toStrictEqual(expectedValue);
});

test("delete at start", () => {
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
      content: [{ text: " from the tests" }],
      children: [
        {
          id: "5",
          type: "paragraph",
          content: [{ text: " from the tests" }],
          children: [
            {
              id: "6",
              type: "paragraph",
              content: [{ text: " from the tests" }],
              children: []
            }
          ]
        }
      ]
    }
  ];

  const expectedValue = [
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
      content: [{ text: " from the tests from the tests" }],
      children: [
        {
          id: "6",
          type: "paragraph",
          content: [{ text: " from the tests" }],
          children: []
        }
      ]
    }
  ];

  const editor = makeEditorFixture(value, { start: { path: [2, 0, 0], offset: 0 } });
  deleteText(editor, { mode: "backward" });
  expect(editor.toJSON()).toStrictEqual(expectedValue);
});

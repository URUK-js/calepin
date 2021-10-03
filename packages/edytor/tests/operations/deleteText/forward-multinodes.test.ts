import { deleteText } from "../../..";
import { makeEditorFixture } from "../../fixture/editorFixture";

test("delete on multinodes single parent", () => {
  const value = [
    {
      id: "not everything",
      type: "paragraph",
      content: [{ text: "hello   ", bold: true }, { text: "   edytor" }],
      children: []
    }
  ];
  const editor = makeEditorFixture(value, {
    start: { path: [0, 0], offset: 5 },
    end: { path: [0, 1], offset: 3 }
  });
  deleteText(editor, { mode: "forward" });

  expect(editor.doc.string()).toBe("helloedytor");

  expect(editor.toJSON()).toStrictEqual([
    {
      id: "not everything",
      type: "paragraph",
      content: [{ text: "hello", bold: true }, { text: "edytor" }],
      children: []
    }
  ]);
});

test("delete multinodes", () => {
  const value = [
    {
      id: "id",
      type: "paragraph",
      content: [
        { text: "hello", bold: true },
        { text: " edyt", italic: true }
      ],
      children: []
    }
  ];

  const editor = makeEditorFixture(value, { start: { path: [0, 0], offset: 0 }, end: { path: [0, 1], offset: 5 } });
  deleteText(editor, { mode: "forward" });
  expect(editor.doc.string()).toBe("");

  expect(editor.toJSON()).toStrictEqual([
    {
      id: "id",
      type: "paragraph",
      content: [{ text: "", id: editor.toJSON()[0].content[0].id }],
      children: []
    }
  ]);
});

test("delete multinodes with a leaf in middle", () => {
  const value = [
    {
      id: "delete",
      type: "paragraph",
      content: [
        { text: "hello", bold: true },
        { text: " edyt", italic: true },
        { text: " edyt", italic: true }
      ],
      children: []
    }
  ];
  const editor = makeEditorFixture(value, { start: { path: [0, 0], offset: 0 }, end: { path: [0, 2], offset: 5 } });
  deleteText(editor, { mode: "forward" });
  expect(editor.doc.string()).toBe("");
  expect(editor.toJSON()).toStrictEqual([
    {
      id: editor.toJSON()[0].id,
      type: "paragraph",
      content: [{ text: "", id: editor.toJSON()[0].content[0].id }],
      children: []
    }
  ]);
});

test("delete range deep", () => {
  const value = [
    {
      id: "id",
      type: "paragraph",
      content: [
        { text: "hello", bold: true },
        { text: " edyt", italic: true },
        { text: "or", italic: true }
      ],
      children: [
        {
          id: "id2",
          type: "paragraph",
          content: [
            { text: "bonjour", bold: true },
            { text: " edyt", italic: true },
            { text: "or", italic: true }
          ],
          children: []
        }
      ]
    }
  ];

  const expectedValue = [
    {
      id: "id",
      type: "paragraph",
      content: [
        { text: "hello", bold: true },
        { text: " edyt", italic: true },
        { text: "or", italic: true }
      ],
      children: [
        {
          id: "id2",
          type: "paragraph",
          content: [{ text: "" }],
          children: []
        }
      ]
    }
  ];

  const editor = makeEditorFixture(value, {
    start: { path: [0, 0, 0], offset: 0 },
    end: { path: [0, 0, 2], offset: 2 },
    length: 12
  });

  deleteText(editor, { mode: "forward" });
  const v = editor.toJSON();
  console.log(JSON.stringify(v, null, 3));
  expect(editor.doc.string()).toBe("hello edytor");

  delete v[0].children[0].content[0].id;
  console.log(v[0].children[0].content[0].id);
  expect(v).toStrictEqual(expectedValue);
});

test("delete and delete node", () => {
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
      id: "delete4",
      type: "paragraph",
      content: [{ text: " from the tests" }],
      children: [
        {
          id: "delete5",
          type: "paragraph",
          content: [{ text: "from" }],
          children: [
            {
              id: "delete6",
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
      id: "delete4",
      type: "paragraph",
      content: [{ text: " from the tests" }],
      children: [
        {
          id: "delete5",
          type: "paragraph",
          content: [{ text: "" }],
          children: [
            {
              id: "delete6",
              type: "paragraph",
              content: [{ text: " from the tests" }],
              children: []
            }
          ]
        }
      ]
    }
  ];

  const editor = makeEditorFixture(value, {
    start: { path: [2, 0, 0], offset: 0 },
    end: { path: [2, 0, 0], offset: 4 }
  });
  deleteText(editor, { mode: "forward" });
  const v = editor.toJSON();
  delete v[2].children[0].content[0].id;

  expect(v).toStrictEqual(expectedValue);
});

test("delete and delete node", () => {
  const value = [
    {
      id: "delete4",
      type: "paragraph",
      content: [{ text: " from the tests " }],
      children: [
        {
          id: "delete5",
          type: "paragraph",
          content: [{ text: "from" }],
          children: [
            {
              id: "delete6",
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
      id: "delete4",
      type: "paragraph",
      content: [{ text: " from the tests" }],
      children: [
        {
          id: "delete6",
          type: "paragraph",
          content: [{ text: " from the tests" }],
          children: []
        }
      ]
    }
  ];

  const editor = makeEditorFixture(value, {
    start: { path: [0, 0], offset: 15 },
    end: { path: [0, 0, 0], offset: 4 }
  });
  deleteText(editor, { mode: "forward" });

  expect(editor.toJSON()).toStrictEqual(expectedValue);
});

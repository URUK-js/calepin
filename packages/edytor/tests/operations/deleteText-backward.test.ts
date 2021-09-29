import { deleteText } from "../..";
import { makeEditorFixture } from "../fixture/editorFixture";

test("delete one back", () => {
  const value = [
    {
      type: "paragraph",
      content: [{ text: "hello" }],
      children: []
    }
  ];
  const editor = makeEditorFixture(value, { start: { path: [0, 0], offset: 5 }, length: 0 });
  deleteText(editor, { mode: "backward" });
  expect(editor.doc.string()).toBe("hell");
});

test("delete hello", () => {
  const value = [
    {
      type: "paragraph",
      content: [{ text: "hello" }],
      children: []
    }
  ];
  const editor = makeEditorFixture(value, { start: { path: [0, 0], offset: 0 }, end: { path: [0, 0], offset: 5 } });
  deleteText(editor, { mode: "backward" });
  expect(editor.doc.string()).toBe("");
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
  const editor = makeEditorFixture(value, { start: { path: [0, 1], offset: 0 }, end: { path: [0, 1], offset: 5 } });
  deleteText(editor, { mode: "backward" });

  expect(editor.doc.string()).toBe("hello");
  // console.log(editor.toJSON())
  expect(editor.children.toJSON()).toStrictEqual([
    {
      id: editor.children.toJSON()[0].id,
      type: "paragraph",
      content: [{ text: "hello", bold: true }],
      children: []
    }
  ]);
});
test("delete not everything", () => {
  const value = [
    {
      id: "id",
      type: "paragraph",
      content: [
        { text: "hello ", bold: true },
        { text: " edytor", italic: true }
      ],
      children: []
    }
  ];
  const editor = makeEditorFixture(value, {
    start: { path: [0, 0], offset: 5 },
    end: { path: [0, 1], offset: 1 },
    length: 2
  });
  deleteText(editor, { mode: "backward" });

  expect(editor.doc.string()).toBe("helloedytor");
  console.log(editor.toJSON());
  expect(editor.children.toJSON()).toStrictEqual([
    {
      id: "id",
      type: "paragraph",
      content: [{ text: "hello", bold: true }],
      content: [{ text: "edytor", italic: true }],
      children: []
    }
  ]);
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

test("delete multinodes", () => {
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

  const editor = makeEditorFixture(value, { start: { path: [0, 0], offset: 0 }, end: { path: [0, 1], offset: 5 } });
  deleteText(editor, { mode: "backward" });
  expect(editor.doc.string()).toBe("");
});
test("delete multinodes", () => {
  const value = [
    {
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
  deleteText(editor, { mode: "backward" });
  expect(editor.doc.string()).toBe("");
  console.log(editor.children.toJSON());
  expect(editor.children.toJSON()).toStrictEqual([
    { id: editor.children.toJSON()[0].id, type: "paragraph", content: [{ text: "" }], children: [] }
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
      children: []
    }
  ];

  const editor = makeEditorFixture(value, {
    start: { path: [0, 0, 0], offset: 0 },
    end: { path: [0, 0, 2], offset: 2 },
    length: 12
  });

  deleteText(editor, { mode: "backward" });
  console.log(JSON.stringify(editor.doc.toJSON(), null, 3));
  expect(editor.doc.string()).toBe("hello edytor");

  expect(editor.children.toJSON()).toStrictEqual(expectedValue);
});

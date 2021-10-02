import { makeEditorFixture } from "../fixture/editorFixture";
import * as Y from "yjs";
import { getPath } from "../../src";
test("ok", () => {
  expect(true).toBe(true);
});
test("gatPath", () => {
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
    },
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
    },
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
  const editor = makeEditorFixture(value);
  const undo = new Y.UndoManager([editor.children]);
  editor.children
    .get(0)
    .get("children")
    .delete(0);

  undo.undo();
  expect(
    getPath(
      editor.children
        .get(0)
        .get("children")
        .get(0)
        .get("children")
        .get(0)
    )
  ).toStrictEqual([0, 0, 0]);

  editor.children.delete(1);

  expect(
    getPath(
      editor.children
        .get(1)
        .get("children")
        .get(0)
        .get("children")
        .get(0)
    )
  ).toStrictEqual([1, 0, 0]);

  undo.undo();

  console.log(
    getPath(
      editor.children
        .get(2)
        .get("children")
        .get(0)
        .get("children")
        .get(0)
    )
  );

  expect(
    getPath(
      editor.children
        .get(2)
        .get("children")
        .get(0)
        .get("children")
        .get(0)
    )
  ).toStrictEqual([2, 0, 0]);
});

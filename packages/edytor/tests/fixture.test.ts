import { makeEditorFixture } from "./fixture/editorFixture";

test("selection single leaf fixture", () => {
  const value = [
    {
      type: "paragraph",
      id: "firstParagraph",
      content: [
        { id: "firstLeaf", text: "hello" },
        { id: "secondLeaf", text: "edytor" }
      ],
      children: []
    }
  ];
  const editor = makeEditorFixture(value, { start: { path: [0, 0], offset: 0 }, end: { path: [0, 0], offset: 5 } });

  expect(editor.selection.selectedText).toBe("hello");
  expect(editor.selection.edges.startLeaf).toBe(true);
  expect(editor.selection.edges.endLeaf).toBe(true);
  expect(editor.selection.edges.startNode).toBe(true);
  expect(editor.selection.edges.endNode).toBe(false);
  expect(editor.selection.length).toBe(5);
  expect(editor.selection.type).toBe("singlenode");

  expect(editor.selection.start.leafId).toBe("firstLeaf");
  expect(editor.selection.end.leafId).toBe("firstLeaf");
  expect(editor.selection.start.leafIndex).toBe(0);
  expect(editor.selection.end.leafIndex).toBe(0);
  expect(editor.selection.start.nodeIndex).toBe(0);
  expect(editor.selection.end.nodeIndex).toBe(0);
});

test("selection multileaves fixture", () => {
  const value = [
    {
      type: "paragraph",
      id: "firstParagraph",
      content: [
        { id: "firstLeaf", text: "hello" },
        { id: "secondLeaf", text: "edytor" }
      ],
      children: []
    }
  ];
  const editor = makeEditorFixture(value, { start: { path: [0, 0], offset: 0 }, end: { path: [0, 1], offset: 6 } });

  expect(editor.selection.selectedText).toBe("helloedytor");
  expect(editor.selection.edges.startLeaf).toBe(true);
  expect(editor.selection.edges.endLeaf).toBe(true);
  expect(editor.selection.edges.startNode).toBe(true);
  expect(editor.selection.edges.endNode).toBe(true);
  expect(editor.selection.edges.startDocument).toBe(true);
  expect(editor.selection.length).toBe(11);
  expect(editor.selection.type).toBe("multileaves");

  expect(editor.selection.start.leafId).toBe("firstLeaf");
  expect(editor.selection.end.leafId).toBe("secondLeaf");
  expect(editor.selection.start.leafIndex).toBe(0);
  expect(editor.selection.end.leafIndex).toBe(1);
  expect(editor.selection.start.nodeIndex).toBe(0);
  expect(editor.selection.end.nodeIndex).toBe(0);
});
test("selection multileaves fixture 2 ", () => {
  const value = [
    {
      type: "paragraph",
      id: "firstParagraph",
      content: [
        { id: "firstLeaf", text: "hello" },
        { id: "secondLeaf", text: "edytor" }
      ],
      children: []
    }
  ];
  const editor = makeEditorFixture(value, { start: { path: [0, 0], offset: 1 }, end: { path: [0, 1], offset: 5 } });

  expect(editor.selection.selectedText).toBe("elloedyto");
  expect(editor.selection.edges.startLeaf).toBe(false);
  expect(editor.selection.edges.endLeaf).toBe(false);
  expect(editor.selection.edges.startNode).toBe(false);
  expect(editor.selection.edges.endNode).toBe(false);
  expect(editor.selection.length).toBe(9);
  expect(editor.selection.type).toBe("multileaves");
});

test("selection multileaves fixture 3 ", () => {
  const value = [
    {
      type: "paragraph",
      id: "firstParagraph",
      content: [
        { id: "firstLeaf", text: "hello" },
        { id: "secondLeaf", text: "edytor" }
      ],
      children: []
    }
  ];
  const editor = makeEditorFixture(value, { start: { path: [0, 0], offset: 1 }, end: { path: [0, 1], offset: 6 } });

  expect(editor.selection.selectedText).toBe("elloedytor");
  expect(editor.selection.edges.startLeaf).toBe(false);
  expect(editor.selection.edges.endLeaf).toBe(true);
  expect(editor.selection.edges.startNode).toBe(false);
  expect(editor.selection.edges.endNode).toBe(true);
  expect(editor.selection.length).toBe(10);
  expect(editor.selection.type).toBe("multileaves");
});

test("selection multinodes fixture", () => {
  const value = [
    {
      type: "paragraph",
      id: "firstParagraph",
      content: [
        { id: "firstLeaf", text: "hello" },
        { id: "secondLeaf", text: "edytor" }
      ],
      children: []
    },
    {
      type: "paragraph",
      id: "secondParagraph",
      content: [
        { id: "thirdLeaf", text: "hello" },
        { id: "fourthLeaf", text: "edytor" }
      ],
      children: []
    }
  ];
  const editor = makeEditorFixture(value, { start: { path: [0, 0], offset: 0 }, end: { path: [1, 1], offset: 6 } });

  expect(editor.selection.selectedText).toBe("helloedytorhelloedytor");
  expect(editor.selection.edges.startLeaf).toBe(true);
  expect(editor.selection.edges.endLeaf).toBe(true);
  expect(editor.selection.edges.startNode).toBe(true);
  expect(editor.selection.edges.endNode).toBe(true);
  expect(editor.selection.length).toBe(22);
  expect(editor.selection.type).toBe("multinodes");

  expect(editor.selection.start.leafId).toBe("firstLeaf");
  expect(editor.selection.end.leafId).toBe("fourthLeaf");
  expect(editor.selection.start.leafIndex).toBe(0);
  expect(editor.selection.end.leafIndex).toBe(1);
  expect(editor.selection.start.nodeIndex).toBe(0);
  expect(editor.selection.end.nodeIndex).toBe(1);
});

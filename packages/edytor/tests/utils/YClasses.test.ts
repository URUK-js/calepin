import * as Y from "yjs";
import { YNode, YLeaf, EdytorDoc } from "../../src/utils/yClasses";

test("new blank node", () => {
  const doc = new Y.Doc();
  doc.getMap("test").set("newNode", new YNode("paragraph"));
  const newNode = doc
    .getMap("test")
    .get("newNode")
    .toJSON();
  const nodeJSON = {
    id: newNode.id,
    data: {},
    type: "paragraph",
    content: [],
    children: []
  };

  expect(newNode).toStrictEqual(nodeJSON);
});
test("new node with data", () => {
  const doc = new Y.Doc();
  doc.getMap("test").set("newNode", new YNode("paragraph", { data: { comments: ["hello"] } }));

  const newNode = doc
    .getMap("test")
    .get("newNode")
    .toJSON();
  const nodeJSON = {
    id: newNode.id,
    type: "paragraph",
    data: { comments: ["hello"] },
    content: [],
    children: []
  };

  expect(newNode).toStrictEqual(nodeJSON);
});
test("new leaf", () => {
  const doc = new Y.Doc();
  doc.getMap("test").set("newLeaf", new YLeaf());

  const nodeJSON = {
    text: ""
  };
  expect(
    doc
      .getMap("test")
      .get("newLeaf")
      .toJSON()
  ).toStrictEqual(nodeJSON);
  expect(doc.getMap("test").get("newLeaf")).toHaveProperty("id");
});
test("new leaf with text", () => {
  const doc = new Y.Doc();
  doc.getMap("test").set("newNode", new YLeaf({ text: "hello" }));
  const nodeJSON = {
    text: "hello"
  };
  expect(
    doc
      .getMap("test")
      .get("newNode")
      .toJSON()
  ).toStrictEqual(nodeJSON);
});
test("new leaf with data", () => {
  const doc = new Y.Doc();
  doc.getMap("test").set("newNode", new YLeaf({ data: { comments: ["hello"] } }));
  const nodeJSON = {
    data: { comments: ["hello"] },
    text: ""
  };
  expect(
    doc
      .getMap("test")
      .get("newNode")
      .toJSON()
  ).toStrictEqual(nodeJSON);
});
test("new leaf with marks", () => {
  const doc = new Y.Doc();
  doc.getMap("test").set("newNode", new YLeaf({ marks: ["bold", "italic"] }));
  const nodeJSON = {
    text: "",
    bold: true,
    italic: true
  };
  console.log(
    doc
      .getMap("test")
      .get("newNode")
      .toJSON()
  );
  expect(
    doc
      .getMap("test")
      .get("newNode")
      .toJSON()
  ).toStrictEqual(nodeJSON);
});

test("new node with leaf", () => {
  const doc = new Y.Doc();

  doc.getMap("test").set("newNode", new YNode("paragraph", { content: [new YLeaf()] }));
  const newNode = doc
    .getMap("test")
    .get("newNode")
    .toJSON();
  const nodeJSON = {
    id: newNode.id,
    type: "paragraph",
    data: {},
    content: [{ text: "" }],
    children: []
  };

  expect(newNode).toStrictEqual(nodeJSON);
});
test("new node with Yarray of leaves", () => {
  const doc = new Y.Doc();

  doc.getMap("test").set("newNode", new YNode("paragraph", { content: Y.Array.from([new YLeaf()]) }));
  const newNode = doc
    .getMap("test")
    .get("newNode")
    .toJSON();
  const nodeJSON = {
    id: newNode.id,
    type: "paragraph",
    data: {},
    content: [{ text: "" }],
    children: []
  };
  expect(newNode).toStrictEqual(nodeJSON);
});
test("new node with Yarray of children", () => {
  const doc = new Y.Doc();
  doc.getMap("test").set("newNode", new YNode("paragraph", { children: Y.Array.from([new YNode("paragraph")]) }));
  const newNode = doc
    .getMap("test")
    .get("newNode")
    .toJSON();
  const nodeJSON = {
    id: newNode.id,
    type: "paragraph",
    data: {},
    content: [],
    children: [{ type: "paragraph", id: newNode.children[0].id, children: [], data: {}, content: [] }]
  };

  console.log(newNode);

  expect(newNode).toStrictEqual(nodeJSON);
});
test("to string method", () => {
  const doc = new Y.Doc();

  doc.getMap("test").set(
    "newNode",
    new YNode("paragraph", {
      children: [
        new YNode("paragraph", { content: [new YLeaf({ text: "Lorem " })] }),
        new YNode("paragraph", { content: [new YLeaf({ text: "ipsum " })] })
      ],
      content: [new YLeaf({ text: "dolor " }), new YLeaf({ text: "sic" })]
    })
  );
  const text = "Lorem ipsum dolor sic";

  expect(
    doc
      .getMap("test")
      .get("newNode")
      .string()
  ).toStrictEqual(text);
});

test("editorFixture", () => {
  const value = [
    {
      type: "paragraph",
      data: { comment: "hello" },
      content: [{ text: "Bold text", bold: true }],
      children: [
        {
          type: "paragraph",
          content: [{ text: "Lorem ipsum dolor sit", italic: true }]
        },
        {
          type: "paragraph",
          content: [{ text: "Lorem ipsum dolor sit", data: { comment: "hello" } }]
        }
      ]
    }
  ];

  const arrayJSON = [
    {
      id: "w64jUJ8tkajDeCfp7PpV",
      type: "paragraph",
      data: { comment: "hello" },
      content: [{ text: "Bold text", bold: true }],
      children: [
        {
          id: "XQ8denWELmLPRXheCP-3",
          type: "paragraph",
          data: {},
          content: [{ text: "Lorem ipsum dolor sit", italic: true }],
          children: []
        },
        {
          id: "yQrUzQPhjHJWy7wmTGtQ",
          type: "paragraph",
          data: {},
          content: [{ text: "Lorem ipsum dolor sit", data: { comment: "hello" } }],
          children: []
        }
      ]
    }
  ];
  const array = new EdytorDoc(value).getArray("children").toJSON();

  expect(array[0].data).toStrictEqual(arrayJSON[0].data);
  expect(array[0].content[0]).toStrictEqual(arrayJSON[0].content[0]);
  expect(array[0].children[0].content[0]).toStrictEqual(arrayJSON[0].children[0].content[0]);
  expect(array[0].children[1].content[0]).toStrictEqual(arrayJSON[0].children[1].content[0]);
  expect(array[0].children[1]).toHaveProperty("id");
});

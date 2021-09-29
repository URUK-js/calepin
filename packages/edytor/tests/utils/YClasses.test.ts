import * as Y from "yjs";
import { YNode, YLeaf, EdytorDoc } from "../..";

test("new blank node", () => {
  const doc = new Y.Doc();
  doc.getMap("test").set("newNode", new YNode("paragraph"));
  const N = new YNode("paragraph");
  const newNode = doc
    .getMap("test")
    .get("newNode")
    .toJSON();
  const nodeJSON = {
    id: newNode.id,
    type: "paragraph",
    content: [],
    children: []
  };

  expect(newNode).toStrictEqual(nodeJSON);
});
test("new node with data", () => {
  const doc = new Y.Doc();
  doc.getMap("test").set("newNode", new YNode("paragraph", { data: { comments: ["hello"] } }));

  const newNode = doc.getMap("test").get("newNode") as YNode;

  const nodeJSON = {
    id: newNode.get("id"),
    type: "paragraph",
    data: { comments: ["hello"], responses: ["hola"] },
    content: [],
    children: []
  };

  newNode.setData({ responses: ["hola"] });

  expect(newNode.toJSON()).toStrictEqual(nodeJSON);
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
    data: { comments: ["hello"], responses: ["hola"] },
    text: ""
  };

  const newNode = doc.getMap("test").get("newNode") as YNode;
  newNode.setData({ responses: ["hola"] });
  expect(newNode.toJSON()).toStrictEqual(nodeJSON);
});
test("new leaf with marks", () => {
  const doc = new Y.Doc();
  doc.getMap("test").set("newNode", new YLeaf({ marks: ["bold", "italic"] }));
  const nodeJSON = {
    text: "",
    bold: true,
    italic: true
  };

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

    content: [{ text: "" }],
    children: []
  };

  expect(newNode).toStrictEqual(nodeJSON);
});
test("new node with Yarray of leaves", () => {
  const doc = new Y.Doc();

  doc.getMap("test").set("newNode", new YNode("paragraph", { content: Y.Array.from([new YLeaf()]) }));
  const newNode = doc.getMap("test").get("newNode") as YNode;

  const nodeJSON = {
    id: newNode.get("id"),
    type: "paragraph",
    data: {
      lorem: "ipsum"
    },
    content: [{ text: "" }],
    children: []
  };
  newNode.setData({ lorem: "ipsum" });
  expect(newNode.toJSON()).toStrictEqual(nodeJSON);
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

    content: [],
    children: [{ type: "paragraph", id: newNode.children[0].id, children: [], content: [] }]
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
  const newNode = doc
    .getMap("test")
    .get("newNode")
    .get("children")
    .get(1) as YNode;
  console.log(newNode.node());

  expect(newNode.node()).toBe(doc.getMap("test").get("newNode"));
  expect(
    doc
      .getMap("test")
      .get("newNode")
      .string()
  ).toStrictEqual(text);
});

test("editorDoc", () => {
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
  const doc = new EdytorDoc(value);
  const jsonDoc = doc.toJSON();
  expect(jsonDoc.config).toStrictEqual({});
  const array = jsonDoc.children;
  expect(array[0].data).toStrictEqual(arrayJSON[0].data);
  expect(array[0].content[0]).toStrictEqual(arrayJSON[0].content[0]);
  expect(array[0].children[0].content[0]).toStrictEqual(arrayJSON[0].children[0].content[0]);
  expect(array[0].children[1].content[0]).toStrictEqual(arrayJSON[0].children[1].content[0]);
  expect(array[0].children[1]).toHaveProperty("id");
  expect(array[0].children[0].content[0].data).toBe(undefined);
  expect(array[0].children[1].data).toBe(undefined);

  //INTERNAL METHODS
  const leafAtPath = doc.getLeafAtPath([0, 1, 0]);
  console.log(leafAtPath.toJSON());
  expect(array[0].children[1].content[0]).toStrictEqual(leafAtPath.toJSON());

  const leafAtPathFail = doc.getLeafAtPath([0, 0, 0, 0]);
  expect(leafAtPathFail).toBe(undefined);

  const nodeAtPath = doc.getNodeAtPath([0, 1]);
  expect(array[0].children[1]).toStrictEqual(nodeAtPath.toJSON());

  const nodeAtPathFail = doc.getNodeAtPath([0, 1, 1]);
  expect(nodeAtPathFail).toBe(undefined);

  const newDoc = new EdytorDoc();
  Y.applyUpdateV2(newDoc, doc.toUpdate());
  expect(newDoc.toJSON()).toStrictEqual(jsonDoc);
});

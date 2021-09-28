import { YArray, YMap } from "yjs/dist/src/internals";
import * as Y from "yjs";
const datastructure = {
  data: {},
  children: [
    //// <== this is a the trunk
    {
      type: "paragraph", //// <== this is a node
      content: [
        // <== a node can have leaves

        { text: "Bold text", bold: true, data: { aribtrary: "data" } }, // <== this is a leaf
        {
          type: "inline",
          content: [{ text: "Inline with text", data: { aribtrary: "data" } }] // <== this is a fruit be let's call it a leaf too
        }
      ],
      children: [
        // <== a node can have branches leading to new nodes
        {
          type: "paragraph",
          content: [{ text: "Lorem ipsum dolor sit" }]
        },
        {
          type: "paragraph",
          content: [{ text: "Lorem ipsum dolor sit" }]
        }
      ]
    }
  ]
};

const old = {
  children: [
    {
      type: "paragraph",
      children: [
        {
          text:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo"
        },
        {
          text:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo"
        },
        {
          text:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo"
        }
      ]
    }
  ]
};

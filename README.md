> Warning
> this a work in progress wich is absolutly not ready for production

## Datastructure

```
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

```

## Why another text editor ?

For the past few years i've tested all rich text editor the js ecosystem have to offer. Yet, I found none to be have all the functionnality I looked for. Here is the list of thing Edytor aims to acheive.

- Enable real time collaboration out of the box.
- Offline editing by default
- Edytor should be as simple as possible in it conception. Mainly only relying on the "before input event"
- Allowing any kind of blocks to be render at any depth.
- Void block and inline blocks have to be handled.
- JSON as fallback data structure
- Performance driven: Edytor should be able to render a large amount of block without dropping performances. 5000 blocks is our goal.
- Drag and drop should be enabled by default
- It should work on mobile
- It should work with any kind of grammar corrector.

## How to achieve this ?

### Performances

Edytor takes inspiration in the amazing slate.js framework. Yet builded for React performance and implementation are hazardous.

We think that throwing away the VDOM and building an editor for frameworks like Solid.js or Svelte is the way toward a very performant editor.

But handling thousands of nodes is not something any framework can help with. We need to figure out a way to virtualize / paginate the editor.

### Colaboration

This is simple: YJS is our friend. Despite Edytor accept JSON as initial value, a YDoc is our main datastructure.

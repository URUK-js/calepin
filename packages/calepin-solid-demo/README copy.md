> Warning
> this a work in progress wich is absolutly not ready for production

## Why another text editor ?

For the past few years i've tested all rich text editor the js ecosystem have to offer. Yet, I found none to be have all the functionnality I looked for. Here is the list of thing Calepin aims to acheive.

- Enable real time collaboration out of the box.
- Offline editing by default
- Calepin should be as simple as possible in it conception. Mainly only relying on the "before input event"
- Allowing any kind of blocks to be render at any depth.
- Void block and inline blocks have to be handled.
- JSON as fallback data structure
- Performance driven: Calepin should be able to render a large amount of block without dropping performances. 5000 blocks is our goal.
- Drag and drop should be enabled by default
- It should work on mobile
- It should work with any kind of grammar corrector.

## How to achieve this ?

### Performances

Calepin takes inspiration in the amazing slate.js framework. Yet builded for React performance and implementation are hazardous.

We think that throwing away the VDOM and building an editor with Solid.js is the way toward a very performant editor.

But handling thousands of nodes is not something any framework can help with. So we plan to integrate a virtual dynamic rendering.

### Colaboration

This is simple: YJS is our friend. Despite Calepin accept JSON as initial value, a YDoc is our main datastructure.

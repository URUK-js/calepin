<p align="center">
  <img width="20%" src="logo.png" alt="Sublime's custom image"/>
</p>

> Warning
> this a work in progress wich is absolutly not ready for production

## Datastructure

```html
<editor>
  <node>
    <leaf>text</leaf>
    <node>
      <leaf>text</leaf>
    </node>
  </node>
  <node>
    <leaf>text</leaf>
  </node>
</editor>
```

```json
[
 {
   "type": "paragraph",
   "content": [
     {
       "text": "text"
     }
   ],
   "children": [
     {
       "type": "paragraph",
       "content": [
         {
           "bold": true,
           "text": "text"
         }
       ],
       "children": []
     }
   ]
 },
 {
   "type": "paragraph",
   "content": [
     {
       "text": "text"
     }
   ],
   "children": []
 }
];

```

## Why another editor ?

There is tons of js libraries or frameworks for rich content editing. None of them has been built, from the ground up to be collaborative. Moreover some are very good at text editing (prosemirror, quill) and some are good at building things like website (grapejs, slate in a way).

Edytor is a general purpose collaborative editor, it's good out of the box at realtime text editing and can be easily extend with your own logic and components to become a website editor or simply a more features rich editor.

In short Edytor wants to provide the same core functionalities as the Notion's editor :

- realtime collaboration
- offline editing
- drag and drop
- nested children
- presence indicator
- shared history undo redo
- custom text formatting
- blocks extensibility
- clean json output

## How does it works ?

Edytor is using Yjs to store and update the tree data. Thanks to this amazing library it can provide offline and online realtime edition and automatic conflict resolution. No need to build a complex server to handle an O^n operations conflicts possibilities.

## Performances

Edytor takes inspiration in the amazing Slate.js framework. Yet builded for React, Slate performances and implementation are hazardous and full of gotchas.

We think that throwing away the VDOM and building an editor for frameworks like Solid or Svelte is the way toward a very performant editor.

YJS listener combine with reactives framework allow us to perform true leaf level incremental updates which is for performances.

Beside that we try to make the api as simple, maintainable, and performant as possible so Edytor can handle thousand of nodes without lagging.

## Roadmap

✅ YJS datastructure

✅ insert text

✅ delete text forward and backward

✅ split nodes with enter

✅ nest nodes with tab

✅ merge nodes on delete at start/end

✅ un-nest nodes on delete when needed

✅ extensive selection listener

✅ demo in solid

✅ cursor positioning and repositioning

⚽ web-socket server example

⚽ realtime demo example

⚽ realtime cursor positioning

⚽ realtime awareness indicator

⚽ demo in svelte

✅ format text

✅ move nodes

✅ dnd

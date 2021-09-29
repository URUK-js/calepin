import { EdytorDoc } from "edytor/src";
import { createMemo, onMount, onCleanup, Accessor } from "solid-js";
import { UndoManager } from "yjs";
import { YMap } from "yjs/dist/src/internals";
// import { Cursor } from "../Cursor";
export const useHistory = (doc: EdytorDoc) => {
  const undoManager = createMemo(
    (): UndoManager => {
      return new UndoManager(doc.children);
    }
  );

  onMount(() => {
    // this don't work very well
    undoManager().on("stack-item-added", (event: any) => {
      // event.stackItem.meta.set("cursor-location", Cursor.getCurrentCursorPosition(editorRef()));
    });
    undoManager().on("stack-item-popped", (event: any) => {
      // console.log(event.stackItem);
      // const insertions = event.stackItem.insertions.clients;
      // let len = 0;
      // insertions.forEach((insertion) => {
      //   insertion.forEach((x) => {
      //     console.log(x.len);
      //     if (x.len) {
      //       len += x.len;
      //     }
      //   });
      // });
      // console.log({ len });
      // Cursor.setCurrentCursorPosition(event.stackItem.meta.get("cursor-location"), editorRef());
    });
  });
  onCleanup(() => {
    undoManager().destroy();
  });
  return undoManager();
};

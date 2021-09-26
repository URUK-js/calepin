// import { UndoManager } from "yjs";

export const onKeyDown = (undoManager: any, e: KeyboardEvent) => {
  if (e.key === "z" && e.metaKey) {
    return undoManager.undo();
  }
  if (e.key === "Z" && e.metaKey && e.shiftKey) {
    return undoManager.redo();
  }
};

import { Editor } from "../types";
import isHotkey, { toKeyCode } from "is-hotkey";
import { formatText, formatTextOperation } from "../operations";

export const onKeyDown = (editor: Editor, e: KeyboardEvent) => {
  if (e.metaKey) {
    if (e.key === "z" && e.metaKey) {
      e.preventDefault();
      console.log(editor.undoManager);
      return editor.undoManager.undo();
    }
    if (e.key === "Z" && e.metaKey && e.shiftKey) {
      e.preventDefault();
      return editor.undoManager.redo();
    }

    for (let i = 0; i < editor.hotkeys.length; i++) {
      const { keys, operation, data } = editor.hotkeys[i];
      if (isHotkey(keys, e)) {
        e.preventDefault();
        e.stopPropagation();
        if (typeof operation === "function") {
          return operation(editor);
        }
        switch (operation) {
          case "formatText": {
            return formatText(editor, data as formatTextOperation);
          }
        }
        break;
      }
    }
  }
};
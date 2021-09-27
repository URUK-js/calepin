import { Editor } from "../types";
import isHotkey, { toKeyCode } from "is-hotkey";
import { formatText, formatTextOperation } from "../operations";

export const onKeyDown = (editor: Editor, e: KeyboardEvent) => {
  if (e.metaKey) {
    e.preventDefault();
    e.stopPropagation();
    console.log(toKeyCode(""));

    if (e.key === "z" && e.metaKey) {
      return editor.undoManager.undo();
    }
    if (e.key === "Z" && e.metaKey && e.shiftKey) {
      return editor.undoManager.redo();
    }

    for (let i = 0; i < editor.hotkeys.length; i++) {
      const { keys, operation, data } = editor.hotkeys[i];
      if (isHotkey(keys, e)) {
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

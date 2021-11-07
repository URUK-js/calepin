import isHotkey from "is-hotkey";
import { formatText, nestNode, Editor } from "..";

export const onKeyDown = (editor: Editor, e: KeyboardEvent) => {
  if (e.key === "Tab") {
    e.preventDefault();
    editor.allowNesting && nestNode(editor);
  }
  if (e.metaKey) {
    if (e.key === "z" && e.metaKey) {
      e.preventDefault();
      return editor.undoManager.undo();
    }
    if (e.key === "Z" && e.metaKey && e.shiftKey) {
      e.preventDefault();
      return editor.undoManager.redo();
    }

    if (editor.hotkeys) {
      for (let i = 0; i < editor.hotkeys.length; i++) {
        const { keys, operation, mark } = editor.hotkeys[i];
        if (isHotkey(keys, e)) {
          e.preventDefault();
          e.stopPropagation();
          if (typeof operation === "function") {
            return operation(editor);
          }
          switch (operation) {
            case "formatText": {
              return formatText(editor, mark);
            }
          }
          break;
        }
      }
    }
  }
};

export const defaultHotkeys = [
  { operation: "formatText", keys: "mod+b", mark: { bold: true } },
  { operation: "formatText", keys: "mod+i", mark: { italic: true } },
  { operation: "formatText", keys: "mod+u", mark: { underline: true } },
  { operation: "formatText", keys: "mod+shift+c", mark: { code: true } },
  { operation: "formatText", keys: "mod+shift+x", mark: { strikethrough: true } },
  { operation: "formatText", keys: "mod+shift+h", mark: { highlight: true } }
];

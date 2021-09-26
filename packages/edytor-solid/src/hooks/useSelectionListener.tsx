import { Editor, getRange } from "edytor/src";
import { createSignal, onCleanup, onMount } from "solid-js";
import { useEditor } from "./useEditor";

export const useSelectionListener = (editor: Editor, setSelection: () => void) => {
  const onSelectionEnd = (e: Event) => {
    const editorId = e.target?.activeElement.getAttribute("data-edytor-editor");
    if (editorId === editor.editorId) {
      setSelection(getRange(editor, window.getSelection()));
      // console.log(editor.selection());
    }
  };

  onMount(() => {
    document.addEventListener("selectionchange", onSelectionEnd);
  });
  onCleanup(() => {
    document.removeEventListener("selectionchange", onSelectionEnd);
  });
};

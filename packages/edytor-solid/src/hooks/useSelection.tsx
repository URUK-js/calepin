import { EdytorSelection } from "edytor/src";
import { Accessor, createEffect, createMemo, createSignal, on, onCleanup, onMount } from "solid-js";
import { useEditor } from "./useEditor";

export const useSelection = () => {
  const editor = useEditor();
  const [selection, setSelection] = createSignal<EdytorSelection>(editor.selection);

  onMount(() => {
    editor.selection.observe(setSelection);
  });
  onCleanup(() => {
    editor.selection.unobserve(setSelection);
  });
  return selection;
};
export const useSelectionChange = (callback: (selection: EdytorSelection) => any) => {
  const editor = useEditor();
  onMount(() => {
    editor.selection.observe(callback);
  });
  onCleanup(() => {
    editor.selection.unobserve(callback);
  });
};

import { EdytorSelection } from "edytor/src";
import { Accessor, createEffect, createMemo, on } from "solid-js";
import { useEditor } from "./useEditor";

export const useSelection = () => {
  const editor = useEditor();
  const selection = createMemo(() => editor.selection());
  return selection;
};
export const useSelectionChange = (
  callback: (selection: EdytorSelection) => any
): Accessor<EdytorSelection | undefined> => {
  const selection = useSelection();
  createEffect(
    on(selection, () => {
      const s = selection();
      if (s) {
        callback(s);
      }
    })
  );
  return selection;
};

import { Range } from "calepin/src";
import { Accessor, createEffect, createMemo, on } from "solid-js";
import { useEditor } from "./useEditor";

export const useSelection = () => {
  const editor = useEditor();
  const selection = createMemo(() => editor.selection());
  return selection;
};
export const useSelectionChange = (callback: (selection: Range) => any): Accessor<Range | undefined> => {
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

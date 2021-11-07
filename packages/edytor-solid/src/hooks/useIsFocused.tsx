import { YNode } from "edytor/src";
import { useSelectionChange } from "./useSelection";
import { createSignal, createMemo } from "solid-js";

export const useIsFocused = (node: YNode) => {
  const [isFocused, setIsFocused] = createSignal(false);
  let prevFocused = false;
  useSelectionChange((selection) => {
    if (!selection?.start?.node) return;
    if (selection?.start?.node === node) {
      setIsFocused(true);
      prevFocused = true;
    } else if (prevFocused === true) {
      setIsFocused(false);
      prevFocused = false;
    }
  });
  return isFocused;
};

import { YLeaf, YNode } from "edytor";
import { createSignal, onMount, onCleanup, Accessor } from "solid-js";
import { YArray } from "yjs/dist/src/internals";

// TO DO conditionally observe if inside viewport
export const useChildren = (array: YArray<YNode | YLeaf>): Accessor<YNode | YLeaf> => {
  const [value, setValue] = createSignal(array.toArray());

  const observer = () => {
    setValue(array.toArray());
  };
  onMount(() => {
    array.observe(observer);
  });
  onCleanup(() => {
    array.unobserve(observer);
  });

  return value;
};

import { createSignal, onMount, onCleanup } from "solid-js";

import { YArray, YMap } from "yjs/dist/src/internals";

// TO DO conditionally observe if inside viewport
export const useChildren = (node: YMap<any>) => {
  const [value, setValue] = createSignal(node.get("children").toArray());

  const observer = () => {
    setValue(node.get("children").toArray());
  };
  onMount(() => {
    node.get("children").observe(observer);
  });
  onCleanup(() => {
    node.get("children")?.unobserve(observer);
  });

  return value;
};

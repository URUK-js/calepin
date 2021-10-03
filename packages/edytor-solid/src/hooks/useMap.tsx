import { createSignal, onMount, onCleanup } from "solid-js";
import { YMap } from "yjs/dist/src/internals";

export const useMap = (node: YMap<any>) => {
  const [value, setValue] = createSignal(node.toJSON());
  const observer = () => {
    setValue(node.toJSON());
  };

  onMount(() => {
    node.observe(observer);
  });
  onCleanup(() => {
    node?.unobserve(observer);
  });
  return value;
};

import { createSignal, onMount, onCleanup } from "solid-js";
import { YText } from "yjs/dist/src/internals";

export const useText = (text: YText) => {
  const [value, setValue] = createSignal(text.toString());
  const observer = ({ currentTarget }) => {
    setValue(currentTarget.toString());
  };
  onMount(() => {
    text.observe(observer);
  });
  onCleanup(() => {
    text.unobserve(observer);
  });
  return value;
};

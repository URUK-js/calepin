import { createSignal, onMount, onCleanup, Accessor } from "solid-js";
import { YMap } from "yjs/dist/src/internals";
import { useEditor } from ".";

const extractMap = (node: YMap<any>) => {
  let json = {};

  if (!node) return json;
  const keys = Array.from(node.keys());
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    Object.assign(json, { [key]: node.get(key) });
  }

  return json;
};
// TO DO conditionally observe if inside viewport
export const useNode = (node: YMap<any>) => {
  const editor = useEditor();
  const [value, setValue] = createSignal(extractMap(node));
  const observer = () => {
    setValue(extractMap(node));
  };

  onMount(() => {
    editor.ID_TO_NODE.set(node.get("id"), node);
    node.observe(observer);
  });
  onCleanup(() => {
    node?.unobserve(observer);
  });
  return value;
};
export const useNodeObservation = (node: YMap<any>, observer) => {
  const editor = useEditor();

  const o = ({ currentTarget }) => {
    observer(currentTarget);
  };
  onMount(() => {
    editor.ID_TO_NODE.set(node.get("id"), node);
    node.observe(o);
    observer(node);
  });
  onCleanup(() => {
    node?.unobserve(o);
  });
};

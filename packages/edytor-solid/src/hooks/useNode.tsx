import { createSignal, onMount, onCleanup, Accessor } from "solid-js";
import { YMap } from "yjs/dist/src/internals";
import { useEditor } from ".";

const extractMap = (node: YMap<any>) => {
  let json = {};
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
    console.log("observe");
    setValue(extractMap(node));
  };

  onMount(() => {
    console.log(editor);
    editor.ID_TO_NODE.set(node.get("id"), node);
    node.observe(observer);
    // console.log(ref);
    // const observer = new IntersectionObserver(onVisibilityChange, { threshold: 0, root: null, rootMargin: "20%" });
    // ref && observer.observe(ref());
  });
  onCleanup(() => {
    node?.unobserve(observer);
  });
  return value;
};

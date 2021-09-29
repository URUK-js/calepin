import { Editor } from "../types";

export const getLeafParent = (anchorNode: HTMLElement): HTMLElement | undefined => {
  const { parentElement } = anchorNode;

  if (anchorNode?.hasAttribute && anchorNode?.hasAttribute("data-edytor-path")) {
    return anchorNode;
  } else if (parentElement?.hasAttribute("data-edytor-leaf")) {
    return parentElement;
  } else if (parentElement) {
    return getLeafParent(parentElement);
  } else {
    return undefined;
  }
};

export const getLeaf = (editor: Editor, anchorNode: HTMLElement): [HTMLElement, number[]] => {
  let test;
  let node = anchorNode;
  let i = 0;
  while (!test && node.id !== editor.editorId) {
    test = editor.ID_TO_MAP.get(node);
    node = node.parentElement;
  }
  console.log({ test });

  const leaf = getLeafParent(anchorNode) as HTMLElement;

  return [leaf, leaf.path];
};

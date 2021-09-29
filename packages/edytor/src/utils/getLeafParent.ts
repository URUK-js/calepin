export const getLeafParent = (anchorNode: HTMLElement): HTMLElement | undefined => {
  const { parentElement } = anchorNode;

  console.log({ anchorNode });
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

export const getLeaf = (anchorNode: HTMLElement): [HTMLElement, number[]] => {
  const leaf = getLeafParent(anchorNode) as HTMLElement;

  return [leaf, leaf.path];
};

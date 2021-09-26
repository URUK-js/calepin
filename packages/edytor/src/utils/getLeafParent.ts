export const getLeafParent = (anchorNode: HTMLElement): HTMLElement | undefined => {
  const { parentElement } = anchorNode;

  if (anchorNode?.hasAttribute && anchorNode?.hasAttribute("data-edytor-path")) {
    return anchorNode;
  } else if (parentElement?.hasAttribute("data-edytor-path")) {
    return parentElement;
  } else if (parentElement) {
    return getLeafParent(parentElement);
  } else {
    return undefined;
  }
};

export const getLeaf = (anchorNode: HTMLElement): [HTMLElement, number[]] => {
  const leaf = getLeafParent(anchorNode) as HTMLElement;

  const path = leaf
    ?.getAttribute("data-edytor-path")
    ?.split(",")
    .map(Number) as number[];
  return [leaf, path];
};

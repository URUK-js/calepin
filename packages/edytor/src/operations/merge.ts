import { getIndex, YLeaf, YNode, LeavesArray } from "..";

export const areLeafsMergeable = (nodes: YNode[]) => {
  let keys = nodes.map((node) => Array.from(node.keys())).flat();
  return nodes.every((node) => {
    return keys.every((key) => node.has(key));
  });
};

export const mergeLeafs = (leafs: LeavesArray) => {
  let currentLeaf = leafs.get(0);
  let leafsToDelete = [] as YLeaf[];
  leafs.forEach((_, i) => {
    const leaf = leafs.get(i + 1);
    if (!leaf) return;

    if (areLeafsMergeable([currentLeaf, leaf])) {
      const firstText = currentLeaf.get("text");
      currentLeaf.get("text").insert(firstText.length, leaf.get("text").toString());
      leafsToDelete.push(leaf);
    } else {
      currentLeaf = leaf;
    }
  });

  leafsToDelete.forEach((leaf) => {
    leafs.delete(getIndex(leaf));
  });
};

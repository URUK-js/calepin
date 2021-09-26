import { YArray, YMap } from "yjs/dist/src/internals";
import { Editor } from "../types";

export const areLeafsMergeable = (nodes: YMap<any>[]) => {
  let keys = nodes.map((node) => Array.from(node.keys())).flat();
  return nodes.every((node) => {
    return keys.every((key) => node.has(key));
  });
};

export const mergeLeafs = (editor: Editor | Pick<Editor, "toYJS">, leafs: YArray<YMap<any>>) => {
  let currentLeaf = leafs.get(0);
  let leafsToDelete = [] as YMap<any>[];
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
    const index = leafs.toArray().indexOf(leaf);
    leafs.delete(index);
  });
};

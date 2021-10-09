import { YArray, YMap, YText } from "yjs/dist/src/internals";
import { Editor } from "../types";
import { getIndex } from "./common";
import { deleteNode, NodeHarvest } from "./nodes";
import { YLeaf, YNode } from "./yClasses";

export class LeavesHarvest {
  leaves: { [id: string]: { shouldDeleteNode: boolean; content: YArray<YLeaf>; node: YMap<any>; indexes: number[] } };
  constructor() {
    this.leaves = {};
  }

  reap = (leaf, shouldDeleteNode = false) => {
    if (!isLeafEmpty(leaf)) return;
    const id = leafNodeId(leaf);
    if (!this.leaves[id]) {
      this.leaves[id] = {
        shouldDeleteNode,
        content: leafNodeContent(leaf),
        node: leafNode(leaf),
        indexes: []
      };
    }

    this.leaves[id].indexes.push(getIndex(leaf));
  };

  burn = (editor: Editor) => {
    Object.values(this.leaves).forEach(({ shouldDeleteNode, content, node, indexes }, i) => {
      content.delete(indexes[0], indexes.length);
      if (content.length === 0 && !shouldDeleteNode) {
        content.insert(0, [new YLeaf()]);
      } else if (shouldDeleteNode) return deleteNode(node, editor?.defaultBlock);
    });
  };
}

export const leafData = (leaf): YMap<any> => leaf.get("data");
export const leafText = (leaf): YText => leaf.get("text");
export const leafLength = (leaf): number => leafText(leaf).length;
export const leafString = (leaf): string => leafText(leaf).toString();

export const isLeafEmpty = (leaf) => leafText(leaf) === undefined || leafLength(leaf) === 0;
export const deleteLeafText = (leaf, index: number, length: number, shouldRemoveIfEmpty?: boolean) => {
  leafText(leaf).delete(index, length);

  shouldRemoveIfEmpty && removeIfEmpty(leaf);
};
export const insertTextInLeaf = (leaf, index: number, text) => {
  leafText(leaf).insert(index, text);
};
export const replaceLeafText = (leaf, start: number, length: number, text: string) => {
  const currentText = leafString(leaf).split("");
  currentText.splice(start, length, ...text.split(""));
  return setLeafText(leaf, currentText.join(""));
};
export const setLeafText = (leaf, text: string) => {
  const t = leafText(leaf);
  t.delete(0, t.length);
  t.insert(0, text);
};

export const setLeafData = (leaf, data: object) => {
  if (leaf.has("data")) {
    Object.keys(data).forEach((key) => {
      leafData(leaf).set(key, data[key]);
    });
  } else {
    leaf.set("data", new Map(Object.entries(data)));
  }
};

export const removeIfEmpty = (leaf) => {
  if (isLeafEmpty(leaf)) {
    leafNodeContent(leaf).delete(getIndex(leaf));
    // if (leafNodeContentLength(leaf) === 0) {
    //   deleteNode(leafNode(leaf));
    // }
  }
};

export const leafNode = (leaf): YNode => leaf.parent.parent as YNode;
export const leafNodeId = (leaf): string => leafNode(leaf).get("id");

export const leafNodeContent = (leaf): YArray<YLeaf> => leaf.parent as YArray<YLeaf>;

export const leafNodeContentLength = (leaf): number => leafNodeContent(leaf).length;
export const leafNodeContentStringLength = (leaf): number =>
  leafNodeContent(leaf)
    .toArray()
    .reduce((acc, leaf) => acc + leafLength(leaf), 0);

export const leafNodeChildren = (leaf): YArray<YNode> => leafNode(leaf).get("children") as YArray<YNode>;

export const leafNodeChildrenLength = (leaf): number => leafNodeChildren(leaf).length;

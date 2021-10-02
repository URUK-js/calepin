import { YArray, YMap } from "yjs/dist/src/internals";
import { mergeLeafs } from "../operations";
import { Editor } from "../types";
import { getIndex, getNode } from "./common";
import { leafLength, leafString } from "./leaves";
import { EdytorDoc, YLeaf, YNode } from "./yClasses";

export class NodeHarvest {
  nodes: { [id: string]: { parent: YArray<YMap<any>>; indexes: number[] } };
  constructor() {
    this.nodes = {};
  }
  reap = (node) => {
    // si le noeud est vide
    console.log(isNodeContentEmpty(node));
    if (!isNodeContentEmpty(node)) return;
    // const id = leafNodeId(leaf);
    // if (!this.leaves[id]) {
    //   this.leaves[id] = {
    //     parent: leafNodeContent(leaf),
    //     indexes: []
    //   };
    // }

    // this.leaves[id].indexes.push(getIndex(leaf));
  };
  burn = () => {};
}

export const mergeContentWithPrevLeaf = (editor: Editor) => {
  const { start } = editor.selection();
  let prevLeaf;
  let stop = false;

  editor.doc.traverse((node, isText) => {
    console.log(node);
    if (isText) {
      if (node === start.leaf) {
        stop = true;
      } else if (!stop) {
        prevLeaf = node;
      }
    }
  });
  console.log(prevLeaf);
  if (!prevLeaf) return;

  prevLeaf.nodeContent().insert(
    prevLeaf.nodeContent().length,
    start.leaf
      .nodeContent()
      .toArray()
      .map((leaf: YLeaf) => {
        return new YLeaf(leaf.toJSON());
      })
  );
  mergeLeafs(prevLeaf.nodeContent());
  (start.leaf.parent.parent as YArray<YNode>).delete(getIndex(getNode(start.leaf)));
};

export const deleteNode = (node) => {
  if (isNodeEmpty(node)) {
    (node.parent as YArray<YNode>).delete(getIndex(node));
  } else if (isNodeContentEmpty(node)) {
    const children = getNodeChildren(node).toJSON();
    const index = getIndex(node);
    node.parent.delete(index);
    node.parent.insert(
      index,
      children.map(({ type, ...props }) => new YNode(type, props))
    );
  }
  if (node.parent === (node.doc as EdytorDoc).children && (node.doc as EdytorDoc).children.length === 0) {
    (node.parent as YArray<YNode>).insert(0, [new YNode("paragraph", { content: [new YLeaf()] })]);
  }
};

export const getNodeContainer = (node) => node.parent as YArray<YNode>;
export const getNodeChildren = (node) => node.get("children") as YArray<YNode>;
export const getNodeContent = (node) => node.get("content") as YArray<YNode>;
export const hasChildren = (node) => getNodeChildren(node).length > 0;
export const isNodeEmpty = (node) => isNodeContentEmpty(node) && !hasChildren(node);
export const isNodeContentEmpty = (node) =>
  getNodeContent(node).length === 0 ||
  getNodeContent(node)
    .toArray()
    .map(leafString)
    .join("").length === 0;

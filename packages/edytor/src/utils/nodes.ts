import { YArray, YMap } from "yjs/dist/src/internals";
import { mergeLeafs } from "../operations";
import { Editor } from "../types";
import { getIndex, getNode, traverse } from "./common";
import { leafLength, leafNodeContent, leafNodeContentLength, leafString } from "./leaves";
import { createLeaf, createNode, getChildren, YNode } from "./yClasses";

export const mergeContentWithPrevLeaf = (editor: Editor) => {
  const { start } = editor.selection;
  let prevLeaf;
  let stop = false;

  traverse(editor, (node, isText) => {
    if (isText) {
      if (node === start.leaf) {
        stop = true;
      } else if (!stop) {
        prevLeaf = node;
      }
    }
  });
  if (!prevLeaf) return;
  const prevLeafLength = leafLength(prevLeaf);
  leafNodeContent(prevLeaf).insert(
    leafNodeContentLength(prevLeaf),
    leafNodeContent(start.leaf)
      .toArray()
      .map((leaf: YMap<any>) => {
        return createLeaf(leaf.toJSON());
      })
  );
  mergeLeafs(leafNodeContent(prevLeaf));

  const children = start.node
    .get("children")
    .toArray()
    .map(copyNode);
  if (children.length) {
    start.node.parent.insert(start.nodeIndex, children);
  }
  start.node.parent.delete(start.nodeIndex + children.length);
  return [prevLeaf, prevLeafLength];
  // (start.leaf.parent.parent as YArray<YNode>).delete(index);
};

export const mergeContentWithNextLeaf = (editor: Editor) => {
  const { start } = editor.selection;

  // 1 .get the next leaf
  let nextLeaf;
  let stop = false;

  traverse(editor, (node, isText) => {
    if (isText) {
      if (node === start.leaf) {
        stop = true;
      } else if (stop) {
        nextLeaf = node;
        stop = false;
      }
    }
  });
  // end of document do nothing
  if (!nextLeaf) return;

  // 2 .merge the next leaf with the start leaf
  leafNodeContent(start.leaf).insert(
    leafNodeContentLength(start.leaf),
    leafNodeContent(nextLeaf)
      .toArray()
      .map((leaf: YMap<any>) => {
        return createLeaf(leaf.toJSON());
      })
  );
  mergeLeafs(leafNodeContent(start.leaf));

  // 3 get the merged node children if any and place it where the merged node was
  const node = getNode(nextLeaf);
  const index = getIndex(node);
  const parent = node.parent as YArray<any>;
  const children = node.get("children").toArray();
  children.length > 0 && parent.insert(index, children.map(copyNode));
  parent.delete(index + children.length);
  return nextLeaf;
};

export const deleteNode = (node, defaultBlock: string) => {
  if (isNodeEmpty(node)) {
    (node.parent as YArray<YNode>).delete(getIndex(node));
  } else if (isNodeContentEmpty(node)) {
    const children = getNodeChildren(node).toJSON();
    const index = getIndex(node);
    node.parent.delete(index);
    node.parent.insert(
      index,
      children.map(({ type, ...props }) => createNode(type, props))
    );
  }
  if (node.parent === (node.doc.getArray("children") && node.doc.getArray("children").length === 0)) {
    (node.parent as YArray<YNode>).insert(0, [createNode(defaultBlock, { content: [createLeaf()] })]);
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

export const copyNode = (node: YNode) => {
  const jsonNode = node.toJSON();
  return createNode(jsonNode.type, {
    ...jsonNode,
    children: jsonNode.children.map(getChildren),
    content: jsonNode.content.map(createLeaf)
  });
};

export const nodeString = (node: YNode) => {
  let text = "";
  getNodeContent(node).forEach((leaf) => {
    text += leafString(leaf);
  });
  getNodeChildren(node).forEach((node) => {
    text += nodeString(node);
  });
  return text;
};

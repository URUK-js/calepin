import { YArray, YMap } from "yjs/dist/src/internals";
import { mergeLeafs } from "../operations";
import { Editor } from "../types";
import { getIndex, getNode, traverse } from "./common";
import { leafNodeContent, leafNodeContentLength, leafString } from "./leaves";
import { createLeaf, createNode, EdytorDoc, getChildren, getContent, YLeaf, YNode } from "./yClasses";

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

  leafNodeContent(prevLeaf).insert(
    leafNodeContentLength(prevLeaf),
    leafNodeContent(start.leaf)
      .toArray()
      .map((leaf: YLeaf) => {
        return createLeaf(leaf.toJSON());
      })
  );
  mergeLeafs(leafNodeContent(prevLeaf));
  (start.leaf.parent.parent as YArray<YNode>).delete(getIndex(getNode(start.leaf)));
};

export const mergeContentWithNextLeaf = (editor: Editor) => {
  const { start } = editor.selection;
  let nextLeaf;
  let stop = false;

  editor.doc.traverse((node, isText) => {
    if (isText) {
      if (node === start.leaf) {
        stop = true;
      } else if (stop) {
        nextLeaf = node;
        stop = false;
      }
    }
  });

  //TODO the children should be pull to the depth level of the removed parent
  console.log(leafNodeContent(nextLeaf).toArray());
  leafNodeContent(start.leaf).insert(
    leafNodeContentLength(start.leaf),
    leafNodeContent(nextLeaf)
      .toArray()
      .map((leaf: YLeaf) => {
        return createLeaf(leaf.toJSON());
      })
  );
  mergeLeafs(leafNodeContent(start.leaf));
  console.log(start.leaf.parent.toJSON());
  const node = getNode(nextLeaf);
  if (hasChildren(node)) {
    console.log(node.get("children").toJSON());
    node.parent.insert(
      getIndex(node),
      node
        .get("children")
        .toJSON()
        .map((node) => createNode(node.type, node))
    );
  }
  node.parent.delete(getIndex(node));
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
    content: jsonNode.content.map(getContent)
  });
};

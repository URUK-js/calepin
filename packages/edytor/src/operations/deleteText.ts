import { Editor, EdytorSelection } from "../types";
import {
  copyNode,
  deleteLeafText,
  getIndex,
  getNode,
  getPath,
  hasChildren,
  leafLength,
  leafNodeChildrenLength,
  leafNodeContent,
  leafNodeContentLength,
  leafNodeContentStringLength,
  leafString,
  LeavesHarvest,
  mergeContentWithNextLeaf,
  mergeContentWithPrevLeaf,
  YLeaf
} from "../utils";
import { nestNode } from "./nestNode";

type deleteTextOpts = {
  mode: "forward" | "backward" | "none";
  selection?: EdytorSelection;
};
export const deleteText = (editor: Editor, { mode, selection }: deleteTextOpts) => {
  const { start, end, type, length, edges, setPosition } = selection || editor.selection;

  switch (type) {
    case "collapsed": {
      if (mode === "backward" && edges.startNode) {
        console.log(start.nodeIndex, leafNodeChildrenLength(start.leaf), start.path.length);
        // unnest node if its the last of its parent and if he is nested
        if (start.nodeIndex === start.node.parent.length - 1 && start.path.length > 1 && start.nodeIndex !== 0) {
          console.log(start.leafId);
          const node = copyNode(start.node);
          start.node.parent.delete(start.nodeIndex);
          start.node.parent.parent.parent.insert(getIndex(start.node.parent.parent) + 1, [node]);
          setPosition(start.leafId, { offset: 0 });
        } else {
          // merge node with the prev one if it's not the last of its parent regardless of its nesting
          mergeContentWithPrevLeaf(editor);
          return setPosition(start.leafId, { offset: 0 });
        }
      }
      if (mode === "backward" && edges.startLeaf) {
        // delete content in the prev leaf because we are at its edge start, and escape current leaf
        const prevLeaf = leafNodeContent(start.leaf).get(start.leafIndex - 1);
        deleteLeafText(prevLeaf, leafLength(prevLeaf) - 1, length || 1);
        return setPosition(prevLeaf.get("id"), { offset: leafLength(prevLeaf) });
      }

      if (mode === "forward" && edges.endNode) {
        // merge node with the next node because we are at edge end of it
        return mergeContentWithNextLeaf(editor);
      }
      if (mode === "forward" && edges.endLeaf) {
        // delete content in the next leaf because we are at its edge end
        const nextLeaf = leafNodeContent(start.leaf).get(start.leafIndex + 1);
        return deleteLeafText(nextLeaf, 0, length || 1);
      }

      deleteLeafText(start.leaf, start.offset + (mode === "backward" ? -length || -1 : length), length || 1);
      setPosition(start.leaf.get("id"), { offset: start.offset + (mode === "backward" ? -length || -1 : length) });
      break;
    }
    case "singlenode": {
      deleteLeafText(start.leaf, start.offset, length, true);
      if (hasChildren(getNode(start.leaf))) {
        leafNodeContent(start.leaf).insert(0, [new YLeaf()]);
      }
      setPosition(start.leaf.get("id"), { offset: start.offset });
      break;
    }
    case "multileaves":
    case "multinodes":
      {
        const startPathString = start.path.join(",");
        const endPathString = end.path.join(",");
        editor.doc.transact(() => {
          const { reap, burn } = new LeavesHarvest();
          editor.doc.traverse(
            (leaf, isText) => {
              if (isText) {
                const path = getPath(leaf);
                const l = leafLength(leaf);
                if (path.join(",") === startPathString) {
                  deleteLeafText(leaf, start.offset, l);
                  reap(leaf, false);
                } else if (path > start.path && path < end.path) {
                  deleteLeafText(leaf, 0, l);
                  reap(leaf, true);
                } else if (path.join(",") === endPathString) {
                  deleteLeafText(leaf, 0, end.offset);
                  reap(leaf, end.offset === l);
                }
              }
            },
            { start: start.path[0], end: end.path[0] + 1 }
          );
          return burn();
        });
      }
      setPosition(start.leaf.get("id"), { offset: start.offset });
      break;
  }
};

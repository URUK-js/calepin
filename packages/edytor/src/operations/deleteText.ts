import { Editor, EdytorSelection } from "../types";
import {
  deleteLeafText,
  getIndex,
  getNode,
  getPath,
  hasChildren,
  leafLength,
  leafNodeContent,
  leafNodeContentLength,
  leafNodeContentStringLength,
  leafString,
  LeavesHarvest,
  mergeContentWithNextLeaf,
  mergeContentWithPrevLeaf,
  YLeaf
} from "../utils";

type deleteTextOpts = {
  mode: "forward" | "backward" | "none";
  selection?: EdytorSelection;
};
export const deleteText = (editor: Editor, { mode, selection }: deleteTextOpts) => {
  const { start, end, type, length, edges } = selection || editor.selection;

  switch (type) {
    case "collapsed": {
      if (mode === "backward" && edges.startNode) {
        return mergeContentWithPrevLeaf(editor);
      }
      if (mode === "backward" && edges.startLeaf) {
        const index = getIndex(start.leaf);

        const prevLeaf = leafNodeContent(start.leaf).get(index - 1);
        return deleteLeafText(prevLeaf, leafLength(prevLeaf) - 1, length || 1);
      }

      if (mode === "forward" && edges.endNode) {
        return mergeContentWithNextLeaf(editor);
      }
      if (mode === "forward" && edges.endLeaf) {
        const index = getIndex(start.leaf);

        return deleteLeafText(leafNodeContent(start.leaf).get(index + 1), 0, length || 1);
      }

      deleteLeafText(start.leaf, start.offset + (mode === "backward" ? -length || -1 : length), length || 1);
      break;
    }
    case "singlenode": {
      deleteLeafText(start.leaf, start.offset, length, true);
      if (hasChildren(getNode(start.leaf))) {
        leafNodeContent(start.leaf).insert(0, [new YLeaf()]);
      }
      break;
    }
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
      break;
  }
};

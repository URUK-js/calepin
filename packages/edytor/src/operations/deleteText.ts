import { Editor, EdytorSelection } from "../types";
import {
  deleteLeafText,
  getNode,
  getPath,
  hasChildren,
  leafLength,
  leafNodeContent,
  leafString,
  LeavesHarvest,
  mergeContentWithPrevLeaf,
  YLeaf
} from "../utils";

const mergeWithNextBranch = (editor: Editor) => {
  const { start } = editor.selection();
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

  start.leaf.nodeContent().insert(
    start.leaf.nodeContent().length,
    nextLeaf
      .nodeContent()
      .toArray()
      .map((leaf: YLeaf) => {
        return new YLeaf(leaf.toJSON());
      })
  );
  // mergeLeafs(editor, start.leaf.parent.parent);
  // start.leaf.parent.parent.delete();
};

type deleteTextOpts = {
  mode: "forward" | "backward" | "none";
  selection?: EdytorSelection;
};
export const deleteText = (editor: Editor, { mode, selection }: deleteTextOpts) => {
  const { start, end, type, length } = selection || editor.selection();
  console.log({ type, length }, editor.selection(), editor.ID_TO_NODE);
  switch (type) {
    case "collapsed": {
      const isEmpty = leafLength(start.leaf) === 0;

      if (start.offset === 0 && mode === "backward" && !isEmpty) {
        return mergeContentWithPrevLeaf(editor);
      }
      if (
        start.offset === leafLength(start.leaf) &&
        mode === "forward" &&
        !isEmpty &&
        start.path.slice().reverse()[0] + 1 === start.leaf.nodeContentLength()
      ) {
        return mergeWithNextBranch(editor);
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

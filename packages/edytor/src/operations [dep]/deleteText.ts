import { YMap, YText } from "yjs/dist/src/internals";
import { Editor, EdytorSelection } from "../types";
import { getYNode, traverseDocument } from "../utils";
import { removeEmptyText } from "./removeEmptyText";
import * as Y from "yjs";
import { mergeLeafs } from "./merge";
const mergeWithPrevBranch = (editor: Editor) => {
  const { start } = editor.selection();
  let prevLeaf = [];
  let stop = false;
  const branches = start.leaf.parent.parent.toArray();
  traverseDocument(editor, (isText, node, path) => {
    if (isText) {
      if (node === start.leaf.parent) {
        stop = true;
      } else if (!stop) {
        prevLeaf = [node, path];
      }
    }
  });
  console.log({ prevLeaf, branches });

  prevLeaf[0].parent.insert(
    prevLeaf[1].slice().reverse()[0] + 1,
    branches.map((branch: YMap) => {
      const node = new Y.Map();
      getYNode(branch.toJSON(), node);
      const leaf = branch.get("text") as YText;
      leaf.delete(0, leaf.length);
      removeEmptyText(leaf);
      return node;
    })
  );

  start.leaf.parent.parent.delete();
};

const mergeWithNextBranch = (editor: Editor) => {
  const { start } = editor.selection();
  let nextLeaf = [];
  let stop = false;

  traverseDocument(editor, (isText, node, path) => {
    if (isText) {
      if (node === start.leaf.parent) {
        stop = true;
      } else if (stop) {
        nextLeaf = [node, path];
        stop = false;
      }
    }
  });

  const branches = nextLeaf[0].parent.toArray();
  console.log({ nextLeaf, branches, con: nextLeaf[0].parent.toJSON() });

  start.leaf.parent.parent.insert(
    start.path.slice().reverse()[0] + 1,
    branches.map((branch: YMap) => {
      const node = new Y.Map();
      getYNode(branch.toJSON(), node);
      const leaf = branch.get("text") as YText;
      leaf.delete(0, leaf.length);
      removeEmptyText(leaf);
      return node;
    })
  );
  mergeLeafs(editor, start.leaf.parent.parent);
  // start.leaf.parent.parent.delete();
};

type deleteTextOpts = {
  mode: "forward" | "backward" | "none";
  selection?: EdytorSelection;
};
export const deleteText = (editor: Editor, { mode, selection }: deleteTextOpts) => {
  const { start, end, type, length } = selection || editor.selection();

  switch (type) {
    case "collapsed": {
      const isEmpty = start.leaf.length === 0;
      if (start.offset === 0 && mode === "backward" && !isEmpty) {
        return editor.doc().transact(() => {
          mergeWithPrevBranch(editor);
        });
      }
      if (
        start.offset === start.leaf.length &&
        mode === "forward" &&
        !isEmpty &&
        start.path.slice().reverse()[0] + 1 === start.leaf.parent.parent.length
      ) {
        return mergeWithNextBranch(editor);
      }
      console.log(
        start.offset === start.leaf.length,
        mode === "forward",
        !isEmpty,
        start.path.slice().reverse()[0] + 1 === start.leaf.parent.parent.length,
        start.leaf.parent.parent.length,
        start.leaf.parent.parent
      );

      start.leaf.delete(start.offset, length || 1);
      isEmpty && start.offset === 0 && removeEmptyText(start.leaf);
      break;
    }
    case "singlenode": {
      start.leaf.delete(start.offset, length);
      console.log(start.leaf.length + 1);
      start.leaf.length === 0 && removeEmptyText(start.leaf);
      break;
    }
    case "multinodes":
      {
        const startPathString = start.path.join(",");
        const endPathString = end.path.join(",");
        traverseDocument(
          editor,
          (isText, branch, path) => {
            if (isText) {
              const leaf = branch.get("text") as YText;
              if (path.join(",") === startPathString) {
                leaf.delete(start.offset, leaf.length);
              } else if (path > start.path && path < end.path) {
                leaf.delete(0, leaf.length);
              } else if (path.join(",") === endPathString) {
                leaf.delete(0, end.offset);
              }
              if (leaf.length === 0) removeEmptyText(leaf);
            }
          },
          { start: start.path[0], end: end.path[0] + 1 }
        );
      }
      break;
  }
};

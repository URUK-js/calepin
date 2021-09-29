import { YMap, YText } from "yjs/dist/src/internals";
import { Editor, EdytorSelection } from "../types";
import { getYNode, traverseDocument, YLeaf } from "../utils";
import { removeEmptyText } from "./removeEmptyText";
import * as Y from "yjs";
import { mergeLeafs } from "./merge";
const mergeWithPrevBranch = (editor: Editor) => {
  const { start } = editor.selection();
  let prevLeaf;
  let stop = false;

  editor.doc.traverse((node, isText, path) => {
    if (isText) {
      console.log(node);
      if (node === start.leaf) {
        stop = true;
      } else if (!stop) {
        prevLeaf = node;
      }
    }
  });
  //TODO the children should be pull to the depth level of the removed parent

  editor.doc.transact(() => {
    prevLeaf.nodeContent().insert(
      prevLeaf.nodeContent().length,
      start.leaf
        .nodeContent()
        .toArray()
        .map((leaf: YLeaf) => {
          return new YLeaf(leaf.toJSON());
        })
    );
    // start.leaf.nodeContent().delete(start.path.slice().reverse()[0]);
  });
};

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
  switch (type) {
    case "collapsed": {
      const isEmpty = start.leaf.length() === 0;

      if (start.offset === 0 && mode === "backward" && !isEmpty) {
        return editor.doc.transact(() => {
          mergeWithPrevBranch(editor);
        });
      }
      if (
        start.offset === start.leaf.length() &&
        mode === "forward" &&
        !isEmpty &&
        start.path.slice().reverse()[0] + 1 === start.leaf.nodeContentLength()
      ) {
        return mergeWithNextBranch(editor);
      }
      console.log(length || 1);
      start.leaf.deleteText(start.offset + (mode === "backward" ? -length || -1 : length), length || 1);
      // isEmpty && start.offset === 0 && removeEmptyText(start.leaf);
      break;
    }
    case "singlenode": {
      start.leaf.deleteText(start.offset, length);
      break;
    }
    case "multinodes":
      {
        const startPathString = start.path.join(",");
        const endPathString = end.path.join(",");
        editor.doc.transact(() => {
          editor.doc.traverse(
            (leaf, isText, path) => {
              if (isText) {
                const l = leaf as YLeaf;
                if (path.join(",") === startPathString) {
                  l.deleteText(start.offset, l.length());
                } else if (path > start.path && path < end.path) {
                  l.deleteText(0, l.length());
                } else if (path.join(",") === endPathString) {
                  l.deleteText(0, end.offset);
                }
              }
            },
            { start: start.path[0], end: end.path[0] + 1 }
          );
        });
      }
      break;
  }
};

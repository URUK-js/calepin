import { YArray, YMap, YText } from "yjs/dist/src/internals";
import * as Y from "yjs";
import { Editor, Position, EdytorSelection } from "../types";
import { mergeLeafs, splitLeaf } from ".";
import { isLeafEmpty, leafLength } from "../utils";

export type formatTextOperation = {
  at?: Position;
  range?: EdytorSelection;
  format: string;
  yText?: YText;
};
export type formatAtEqualPathOperation = {
  format: string;
  start: EdytorSelection["start"];
  end: EdytorSelection["end"];
  length: EdytorSelection["length"];
  data?: object;
};

export const applyMarksFromParent = (parent: YMap<any>, leafs: YMap<any>[]) => {
  Array.from(parent.keys(), (key) => {
    if (key !== "text") {
      leafs.forEach((leaf) => {
        leaf.set(key, parent.get(key));
      });
    }
  });
};

export const formatAtEqualPath = ({ format, start, end, data = {} }: formatAtEqualPathOperation) => {
  const length = end.offset - start.offset;
  const leaf = start.leaf;

  const branch = leaf.parent as YMap<any>;
  const node = branch?.parent as YArray<YMap<any>>;
  const content = leaf.toString();
  const index = start.path.slice().reverse()[0] + 1;

  const isMarkActive = branch.has(format);
  const hasMarks = Array.from(branch.keys()).some((key) => key !== "text");

  if (isMarkActive && leaf.length === length) {
    branch.delete(format);
    return leaf;
  } else {
    const remainingText = content.substring(end.offset, leaf.length);
    if (remainingText.length == 0 && leaf.length === end.offset - start.offset) {
      leaf.parent.set(format, true);
      return leaf;
    } else {
      leaf.delete(start.offset, leaf.length);

      const formatedLeaf = new Y.Text(content.substring(start.offset, end.offset));

      const formatedBranch = new Y.Map();
      formatedBranch.set("text", formatedLeaf);
      formatedBranch.set(format, true);
      let newBranches = [formatedBranch];

      if (remainingText.length > 0) {
        const nonFormatedBranch = new Y.Map();
        nonFormatedBranch.set("text", new Y.Text(remainingText));
        newBranches.push(nonFormatedBranch);
      }
      Object.keys(data).forEach((key) => {
        newBranches.forEach((branch) => {
          branch.set(key, data[key]);
        });
      });
      applyMarksFromParent(branch, newBranches);

      if (isMarkActive) {
        formatedBranch.delete(format);
      }
      newBranches.length && node.insert(index, newBranches);
      return formatedLeaf;
    }
  }
};

export const formatText = (editor: Editor, { format, ...data }: formatTextOperation) => {
  let newPath = 0;
  const { start, end, type, length } = editor.selection();

  editor.doc.transact(() => {
    switch (type) {
      case "collapsed": {
        const branch = start.leaf as YMap<any>;
        const isMarkActive = start.leaf.has(format);
        const container = start.leaf.parent as YArray<any>;

        if (isMarkActive && isLeafEmpty(start.leaf)) {
          branch.delete(format);
          newPath = container.toArray().indexOf(branch);
        } else {
          if (isLeafEmpty(start.leaf)) {
            isMarkActive ? branch.delete(format) : branch.set(format, true);
          } else {
            splitLeaf(editor, { yText: start.leaf.get("text"), at: start });
            const newChild = new Y.Map();
            newChild.set("text", new Y.Text(""));
            newChild.set(format, true);

            applyMarksFromParent(branch, [newChild]);

            if (isMarkActive) newChild.delete(format);

            container.insert(start.path.slice().reverse()[0] + 1, [newChild]);

            if (isLeafEmpty(start.leaf)) {
              container.delete(start.path.slice().reverse()[0]);
            }
            newPath = container.toArray().indexOf(newChild);
          }
        }
        mergeLeafs(container);
        break;
        // return newPath;
      }
      case "singlenode": {
        const newText = formatAtEqualPath({ format, start, end, length, data });
        mergeLeafs(editor, start.leaf.parent?.parent);
        newPath = start.leaf.parent?.parent.toArray().indexOf(newText.parent);
        break;
      }
      case "multinodes": {
        const startPathString = start.path.join(",");
        const endPathString = end.path.join(",");
        editor.doc.traverse(
          (branch, isText, path) => {
            if (isText) {
              const leaf = branch.get("text") as YText;
              const node = leaf.parent?.parent as YArray<any>;
              const isStart = path.join(",") === startPathString;
              const isEnd = path.join(",") === endPathString;
              const startOffset = isStart ? start.offset : 0;
              const endOffset = isEnd ? end.offset : leaf.length;
              formatAtEqualPath({
                format,
                start: { leaf, path, offset: startOffset },
                end: { offset: endOffset },
                data
              });
              mergeLeafs(editor, node);
            }
          },
          { start: start.path[0], end: end.path[0] + 1 }
        );
        break;
      }
    }
  });

  return newPath;
};

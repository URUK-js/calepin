import { YArray, YMap, YText } from "yjs/dist/src/internals";
import * as Y from "yjs";
import { Editor, Position, EdytorSelection } from "../types";
import { mergeLeafs, splitLeaf } from ".";
import {
  deleteLeafText,
  getIndex,
  isLeafEmpty,
  leafLength,
  leafNodeChildren,
  leafNodeContent,
  leafText,
  YLeaf
} from "../utils";

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

export const formatAtEqualPath = ({ format, value, start, end }: formatAtEqualPathOperation) => {
  const length = end.offset - start.offset;
  const leaf = start.leaf;
  const text = leafText(leaf);

  const content = text.toString();
  const index = getIndex(leaf);

  const isMarkActive = leaf.has(format);

  if (isMarkActive && leafLength(leaf) === length) {
    leaf.delete(format);
  } else {
    const remainingText = content.substring(end.offset, leafLength(leaf));
    if (remainingText.length == 0 && leafLength(leaf) === end.offset - start.offset) {
      leaf.set(format, value);
    } else {
      console.log("hello");
      deleteLeafText(leaf, start.offset, leafLength(leaf));

      const formatedLeaf = new YLeaf({
        ...leaf.toJSON(),
        id: undefined,
        [format]: value,
        text: content.substring(start.offset, end.offset)
      });
      console.log(remainingText);

      let newLeaves = [formatedLeaf];

      if (remainingText.length > 0) {
        newLeaves.push(new YLeaf({ ...leaf.toJSON(), id: undefined, text: remainingText }));
      }
      // Object.keys(data).forEach((key) => {
      //   newBranches.forEach((branch) => {
      //     branch.set(key, data[key]);
      //   });
      // });

      if (isMarkActive) {
        formatedLeaf.delete(format);
      }
      newLeaves.length && leafNodeContent(leaf).insert(index + 1, newLeaves);
      return formatedLeaf;
    }
  }
};

export const formatText = (editor: Editor, mark: Record<string, any>) => {
  const [[format, value]] = Object.entries(mark);
  console.log(format);
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
            isMarkActive ? branch.delete(format) : branch.set(format, value);
          } else {
            splitLeaf(editor, { yText: start.leaf.get("text"), at: start });
            const newChild = new Y.Map();
            newChild.set("text", new Y.Text(""));
            newChild.set(format, value);

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
        const newText = formatAtEqualPath({ format, value, start, end, length });
        mergeLeafs(leafNodeContent(start.leaf));

        // newPath = start.leaf.parent?.parent.toArray().indexOf(newText.parent);
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

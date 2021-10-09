import { YArray, YMap, YText } from "yjs/dist/src/internals";
import * as Y from "yjs";
import { Editor, Position, EdytorSelection } from "../types";
import { mergeLeafs, splitLeaf } from ".";
import { deleteLeafText, getIndex, isLeafEmpty, leafLength, leafNodeContent, leafText, YLeaf } from "../utils";

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
      deleteLeafText(leaf, start.offset, leafLength(leaf));

      const formatedLeaf = new YLeaf({
        ...leaf.toJSON(),
        id: undefined,
        [format]: value,
        text: content.substring(start.offset, end.offset)
      });

      let newLeaves = [formatedLeaf];

      if (remainingText.length > 0) {
        newLeaves.push(new YLeaf({ ...leaf.toJSON(), id: undefined, text: remainingText }));
      }

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
  const { start, end, type, length, setPosition } = editor.selection;

  editor.doc.transact(() => {
    switch (type) {
      case "collapsed": {
        const isMarkActive = start.leaf.has(format);

        if (isMarkActive && isLeafEmpty(start.leaf)) {
          start.leaf.delete(format);
          newPath = leafNodeContent(start.leaf)
            .toArray()
            .indexOf(start.leaf);
        } else {
          if (isLeafEmpty(start.leaf)) {
            isMarkActive ? start.leaf.delete(format) : start.leaf.set(format, value);
          } else {
            splitLeaf(editor, { yText: start.leaf.get("text"), at: start });
            const newChild = new YLeaf({ text: "", [format]: value });
            applyMarksFromParent(start.leaf, [newChild]);

            if (isMarkActive) newChild.delete(format);

            leafNodeContent(start.leaf).insert(start.path.slice().reverse()[0] + 1, [newChild]);

            if (isLeafEmpty(start.leaf)) {
              leafNodeContent(start.leaf).delete(start.path.slice().reverse()[0]);
            }
            newPath = leafNodeContent(start.leaf)
              .toArray()
              .indexOf(newChild);
          }
        }
        mergeLeafs(leafNodeContent(start.leaf));
        break;
        // return newPath;
      }
      case "singlenode": {
        const formatedLeaf = formatAtEqualPath({ format, value, start, end, length });
        mergeLeafs(leafNodeContent(start.leaf));
        console.log({ id: formatedLeaf.get("id") });
        setTimeout(() => {
          setPosition(formatedLeaf.get("id"), { offset: 0, end: leafLength(formatedLeaf) });
        });

        break;
      }
      case "multileaves":
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
                value
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

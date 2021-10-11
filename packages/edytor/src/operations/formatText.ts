import { YMap, YText } from "yjs/dist/src/internals";
import { Editor, Position, EdytorSelection } from "../types";
import { mergeLeafs, splitLeaf } from ".";
import { deleteLeafText, getIndex, getPath, isLeafEmpty, leafLength, leafNodeContent, leafText, YLeaf } from "../utils";

export type formatTextOperation = {
  at?: Position;
  value: any;
  range?: EdytorSelection;
  format: string;
  yText?: YText;
};
export type formatAtEqualPathOperation = {
  format: string;
  value: any;
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
    return leaf;
  } else {
    const remainingText = content.substring(end.offset, leafLength(leaf));
    if (remainingText.length == 0 && leafLength(leaf) === end.offset - start.offset) {
      leaf.set(format, value);
      return leaf;
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
  const { start, end, type, length, setPosition, selectedText } = editor.selection;

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
        editor.doc.transact(() => {
          const formatedLeaf = formatAtEqualPath({ format, value, start, end, length });
          mergeLeafs(leafNodeContent(start.leaf));
          const isRemoved = formatedLeaf._item.deleted;

          if (!isRemoved) {
            setPosition(start.leaf.get("id"), { offset: start.offset });
            setTimeout(() => {
              setPosition(formatedLeaf.get("id"), { offset: 0, end: leafLength(formatedLeaf) });
            });
          } else {
            const remainingLeaf = formatedLeaf.parent.get(start.leafIndex - 1);
            const offset = leafText(remainingLeaf)
              .toJSON()
              .indexOf(selectedText);
            setTimeout(() => {
              setPosition(remainingLeaf.get("id"), {
                offset,
                end: offset + selectedText.length
              });
            });
          }
        });
        break;
      }
      case "multileaves":
      case "multinodes": {
        const startPathString = start.path.join(",");
        const endPathString = end.path.join(",");
        let started = false;
        let ended = false;

        editor.doc.traverse(
          (leaf, isText) => {
            if (isText) {
              const path = getPath(leaf);
              const isStart = path.join(",") === startPathString;
              const isEnd = path.join(",") === getPath(end.leaf).join(",");
              console.log({ isEnd }, endPathString, getPath(end.leaf).join(","), path.join(","));
              if (isStart) {
                started = true;
              }

              const startOffset = isStart ? start.offset : 0;
              const endOffset = isEnd ? end.offset : leafLength(leaf);
              started &&
                !ended &&
                formatAtEqualPath({
                  format,
                  start: { leaf, offset: startOffset },
                  end: { offset: endOffset },
                  value
                });
              console.log({ ended });
              if (isEnd) {
                ended = true;
              }

              mergeLeafs(leafNodeContent(leaf));
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

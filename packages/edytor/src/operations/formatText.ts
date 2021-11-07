import { YMap } from "yjs/dist/src/internals";
import { Editor, Position, EdytorSelection, YText, YLeaf } from "../types";
import { mergeLeafs, splitLeaf } from ".";
import {
  deleteLeafText,
  getIndex,
  getPath,
  isLeafEmpty,
  leafLength,
  leafNodeContent,
  leafText,
  createLeaf,
  traverse
} from "../utils";

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
  removeFormatIfPresent?: boolean;
};

export const applyMarksFromParent = (parent: YMap<any>, leafs: YMap<any>[]) => {
  Array.from(parent.keys(), (key) => {
    if (key !== "text" && key !== "id" && key !== "data") {
      leafs.forEach((leaf) => {
        leaf.set(key, parent.get(key));
      });
    }
  });
};

export const formatAtEqualPath = ({
  format,
  value,
  start,
  end,
  removeFormatIfPresent = true
}: formatAtEqualPathOperation) => {
  const length = end.offset - start.offset;
  const leaf = start.leaf;
  const text = leafText(leaf);

  const content = text.toString();
  const index = getIndex(leaf);

  const isMarkActive = leaf.has(format) && removeFormatIfPresent;

  if (isMarkActive && leafLength(leaf) === length) {
    leaf.delete(format);
    return leaf;
  } else {
    // we get the remaining text of the leaf that is not formated
    const remainingText = content.substring(end.offset, leafLength(leaf));
    // if there is not remaining text and the whole leaf is selected we are just applying the mark the leaf
    if (remainingText.length === 0 && leafLength(leaf) === end.offset - start.offset) {
      leaf.set(format, value);
      return leaf;
    } else {
      // delete the leaf at the start offset to split it in half and being able to apply format to the right part of it
      deleteLeafText(leaf, start.offset, leafLength(leaf));

      // create a new leaf in order to apply it the desired format and copying all previous leaf infos into it to preserve the actual format and data
      const formatedLeaf = createLeaf({
        ...leaf.toJSON(),
        id: undefined,
        [format]: value,
        text: content.substring(start.offset, end.offset)
      });

      // we create an array of leaves that will be pushed inside the parent content
      let newLeaves = [formatedLeaf];
      // if there is a remaining text that should not be formated we create a leaf with the same properties the current leaf has and push it the leaves array
      if (remainingText.length > 0) {
        newLeaves.push(createLeaf({ ...leaf.toJSON(), id: undefined, text: remainingText }));
      }
      // if the mark is active we are removing it from the selected leaf
      if (isMarkActive) {
        formatedLeaf.delete(format);
      }
      // we push the leaves array to the parent content starting at the current leaf index + 1
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
        const isMarkActive = start.leaf.has(format) && start.leaf.get(format) === value;
        if (isLeafEmpty(start.leaf)) {
          // if the leaf is empty we only toggle the mark
          isMarkActive ? start.leaf.delete(format) : start.leaf.set(format, value);
        } else {
          // if leaf is not empty we split the current leaf in half to insert an empty fragment with the desired mark
          splitLeaf(editor);
          const fragment = createLeaf({ text: "", [format]: value });
          // we are applying the current marks on the fragment
          applyMarksFromParent(start.leaf, [fragment]);
          // we remove the mark if its here
          if (isMarkActive) fragment.delete(format);
          // we insert the fragment after the spitted leaf
          leafNodeContent(start.leaf).insert(start.leafIndex + 1, [fragment]);
          // we remove the spitted leaf if empty
          if (isLeafEmpty(start.leaf)) {
            leafNodeContent(start.leaf).delete(start.leafIndex);
          }
          setTimeout(() => {
            setPosition(fragment.get("id") as string, { offset: 0 });
            console.log(leafNodeContent(start.leaf).toJSON());
          });
        }
        // we merge leaves to avoid two subsequent leaves with the same marks => clean markup
        mergeLeafs(leafNodeContent(start.leaf));
        break;
      }
      case "singlenode": {
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

        break;
      }
      case "multileaves":
      case "multinodes": {
        let leaves = [] as [boolean, YLeaf][];
        const startPathString = start.path.join(",");
        const endPathString = end.path.join(",");
        let started = false;
        let ended = false;

        traverse(
          editor,
          (leaf, isText) => {
            if (isText) {
              leaves.push([leaf.has(format), leaf]);
              const path = getPath(leaf);
              console.log(path);
              const isStart = path.join(",") === startPathString;
              const isEnd = path.join(",") === getPath(end.leaf).join(",");
              console.log({ isEnd }, endPathString, getPath(end.leaf).join(","), path.join(","));
              if (isStart) {
                started = true;
              }

              const startOffset = isStart ? start.offset : 0;
              const endOffset = isEnd ? end.offset : leafLength(leaf);
              console.log({ startOffset, endOffset });

              started &&
                !ended &&
                formatAtEqualPath({
                  format,
                  start: { leaf, offset: startOffset },
                  end: { offset: endOffset },
                  value,
                  removeFormatIfPresent: false
                });
              console.log({ ended, isEnd });
              if (isEnd) {
                ended = true;

                if (leaves.every(([hasFormat]) => hasFormat === true)) {
                  leaves.forEach(([_, leaf]) => leaf.delete(format));
                }
                mergeLeafs(leafNodeContent(leaf));
              }
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

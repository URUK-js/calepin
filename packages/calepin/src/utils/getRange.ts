import { Editor, Range } from "../types";
import { getLeaf } from ".";
import { arePathsEquals } from "./arePathsEquals";
import { getTextLeave } from "./getTextLeave";

export const getRange = (editor: Editor, selection: Selection): Range => {
  const { anchorNode, focusNode, anchorOffset, focusOffset, isCollapsed } = selection;
  const length = selection.getRangeAt(0)?.toString()?.length;
  const [leaf1, path1] = getLeaf(anchorNode as HTMLElement);
  const [leaf2, path2] = getLeaf(focusNode as HTMLElement);
  const equalPaths = arePathsEquals(path2, path1);
  const isFollowing = equalPaths ? anchorOffset < focusOffset : leaf1.compareDocumentPosition(leaf2) === 4;

  const start = {
    node: isFollowing ? anchorNode : focusNode,
    path: isFollowing ? path1 : path2,
    offset: isFollowing ? anchorOffset : focusOffset,
    leaf: getTextLeave(editor.toYJS(), isFollowing ? path1 : path2)
  };
  let range = {
    start,
    end: isCollapsed
      ? start
      : {
          node: !isFollowing ? anchorNode : focusNode,
          path: !isFollowing ? path1 : path2,
          offset: !isFollowing ? anchorOffset : focusOffset,
          leaf: getTextLeave(editor.toYJS(), !isFollowing ? path1 : path2)
        },
    arePathsEquals: equalPaths,
    length,
    domRange: isCollapsed
      ? {}
      : (() => {
          const domRange = selection.getRangeAt(0);
          return {
            ...selection,
            domRange,
            boundingRect: domRange.getBoundingClientRect()
          };
        })(),
    selection: selection,
    type: focusNode === anchorNode ? "singlenode" : "multinodes",
    editorOffset: editor.cursor().getEditorOffset(selection)
  } as Range;

  return range;
};

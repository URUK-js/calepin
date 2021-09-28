import { Editor, EdytorSelection } from "../types";
import { getLeaf } from ".";
import { arePathsEquals } from "./arePathsEquals";
import { getTextLeave } from "./getTextLeave";
// import "./nodePath";

declare global {
  interface Element {
    index: number;
    path: number[];
  }
  interface Node {
    index: number;
    path: number[];
  }
}

export const getRange = (editor: Editor, selection: Selection): EdytorSelection => {
  const { anchorNode, focusNode, anchorOffset, focusOffset, isCollapsed, rangeCount } = selection;

  if (focusNode === null) return;
  const [leaf1, path1] = getLeaf(anchorNode as HTMLElement);
  const [leaf2, path2] = getLeaf(focusNode as HTMLElement);
  const equalPaths = arePathsEquals(path2, path1);
  const isFollowing = equalPaths ? anchorOffset < focusOffset : leaf1.compareDocumentPosition(leaf2) === 4;

  const start = {
    node: isFollowing ? anchorNode : focusNode,
    path: isFollowing ? path1 : path2,

    ancestor: document.querySelector(`[data-edytor-path="${(isFollowing ? path1 : path2).slice(0, 1)}"]`),
    offset: isFollowing ? anchorOffset : focusOffset,
    leaf: getTextLeave(editor.toYJS(), isFollowing ? path1 : path2)
  };

  const end = isCollapsed
    ? start
    : {
        node: !isFollowing ? anchorNode : focusNode,
        path: !isFollowing ? path1 : path2,
        offset: !isFollowing ? anchorOffset : focusOffset,
        leaf: getTextLeave(editor.toYJS(), !isFollowing ? path1 : path2)
      };

  const range = rangeCount >= 1 ? selection?.getRangeAt(0) : undefined;

  let edytorSelection = {
    start,
    end,
    arePathsEquals: equalPaths,
    length: range && range.toString()?.length,
    range,
    boundingRect: range && range.getBoundingClientRect(),
    selection,
    edges: {
      start: start.offset === 0,
      end: end.offset === end.leaf.length
    },
    type: isCollapsed ? "collapsed" : equalPaths ? "singlenode" : "multinodes",
    editorOffset: editor.cursor().getEditorOffset(selection)
  } as EdytorSelection;

  return edytorSelection;
};

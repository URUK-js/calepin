import { Editor, EdytorSelection } from "../types";
import { getPath } from "./common";
import { leafLength } from "./leaves";

import { YLeaf } from "./yClasses";

const getLeaf = (editor: Editor, anchorNode: HTMLElement): [YLeaf, number[]] => {
  let leaf;
  let node = anchorNode;
  let i = 0;
  while (!leaf && node?.id !== editor.editorId && node && i < 100) {
    leaf = editor.ID_TO_NODE.get(node.id);
    node = node.parentElement;
    i++;
  }
  if (!leaf) return undefined;

  return [leaf, getPath(leaf)];
};

export const getRange = (editor: Editor, selection: Selection): EdytorSelection => {
  const { anchorNode, focusNode, anchorOffset, focusOffset, isCollapsed, rangeCount } = selection;

  if (focusNode === null) return;
  const [leaf1, path1] = getLeaf(editor, anchorNode as HTMLElement);
  const [leaf2, path2] = getLeaf(editor, focusNode as HTMLElement);
  if (!leaf1) return;
  const equalPaths = path1.join("") === path2.join("");
  const isFollowing = equalPaths ? anchorOffset < focusOffset : path1.join() < path2.join();

  // console.log(isFollowing, equalPaths, { path1, path2 });
  const start = {
    node: isFollowing ? anchorNode : focusNode,
    path: isFollowing ? path1 : path2,
    ancestor: document.querySelector(`[data-edytor-path="${(isFollowing ? path1 : path2).slice(0, 1)}"]`),
    offset: isFollowing ? anchorOffset : focusOffset,
    leaf: isFollowing ? leaf1 : leaf2
  };

  const end = isCollapsed
    ? start
    : {
        node: !isFollowing ? anchorNode : focusNode,
        path: !isFollowing ? path1 : path2,
        offset: !isFollowing ? anchorOffset : focusOffset,
        leaf: !isFollowing ? leaf1 : leaf2
      };

  const range = rangeCount >= 1 ? selection?.getRangeAt(0) : undefined;

  //@ts-ignore
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
      end: end.offset === leafLength(end.leaf)
    },
    type: isCollapsed ? "collapsed" : equalPaths ? "singlenode" : "multinodes",
    editorOffset: editor.cursor().getEditorOffset(selection)
  } as EdytorSelection;

  console.log({ edytorSelection });
  return edytorSelection;
};

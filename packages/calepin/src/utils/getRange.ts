import { Range } from "../types";
import { getLeaf } from "./getLeaveParent";

export const getRange = (selection: Selection): Range => {
  const { anchorNode, focusNode, anchorOffset, focusOffset } = selection;

  const [leaf1, path1] = getLeaf(anchorNode as HTMLElement);
  const [leaf2, path2] = getLeaf(focusNode as HTMLElement);
  const isFollowing = leaf1.compareDocumentPosition(leaf2) === 4;

  let range = {
    start: {
      node: isFollowing ? anchorNode : focusNode,
      path: isFollowing ? path1 : path2,
      offset: isFollowing ? anchorOffset : focusOffset
    },
    end: {
      node: !isFollowing ? anchorNode : focusNode,
      path: !isFollowing ? path1 : path2,
      offset: !isFollowing ? anchorOffset : focusOffset
    },
    type: focusNode === anchorNode ? "singlenode" : "multinodes"
  } as Range;

  if (range.end.offset < range.start.offset) {
    range = {
      ...range,
      start: range.end,
      end: range.start
    };
  }
  return range;
};

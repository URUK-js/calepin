import { YArray, YText } from "yjs/dist/src/internals";
import { Editor, Position, EdytorSelection } from "../types";
import { deleteText } from ".";
import { YNode, YLeaf } from "..";
import {
  leafNodeContent,
  leafString,
  leafLength,
  deleteLeafText,
  leafNode,
  getIndex,
  leafNodeContentLength,
  hasChildren,
  getNodeChildren
} from "../utils";

export type splitNodeOperation = {
  at: Position;
  range?: EdytorSelection;
  yText?: YText;
};

export const splitNode = (editor: Editor) => {
  const { start, end, type, length, edges } = editor.selection;

  const leaf = start.leaf;
  const leafContent = leafNodeContent(start.leaf);
  const node = leafNode(start.leaf);

  const indexOfLeaf = getIndex(start.leaf);
  const indexOfNode = getIndex(node);

  const split = () => {
    const nextLeaves = leafContent.toArray().filter((_, i) => i > indexOfLeaf);

    const rightText = leafString(start.leaf).substring(start?.offset, leafLength(start.leaf));
    deleteLeafText(start.leaf, start?.offset, rightText.length, false);

    const newParent = hasChildren(node) ? getNodeChildren(node) : (node.parent as YArray<any>);
    newParent.insert(hasChildren(node) ? 0 : indexOfNode + 1, [
      new YNode("paragraph", {
        children: [],
        content: [new YLeaf({ ...leaf.toJSON(), id: undefined, text: rightText })].concat(
          nextLeaves.map((leaf) => new YLeaf(leaf.toJSON()))
        )
      })
    ]);
    leafContent.delete(indexOfLeaf + 1, leafNodeContentLength(start.leaf) - indexOfLeaf - 1);
  };

  let doSplit = (!edges.startNode || !edges.endNode) && type === "collapsed";

  if (edges.startNode && type === "collapsed") {
    return (node.parent as YArray<any>).insert(indexOfNode, [new YNode("paragraph")]);
  }
  if (edges.endNode && type === "collapsed") {
    return (node.parent as YArray<any>).insert(indexOfNode + 1, [new YNode("paragraph")]);
  }

  switch (type) {
    case "collapsed": {
      doSplit && split();

      break;
    }
    case "singlenode": {
      deleteText(editor, { mode: "backward" });
      doSplit && split();
      break;
    }
    case "multinodes": {
      deleteText(editor, { mode: "backward" });
      doSplit && split();
    }
  }
};

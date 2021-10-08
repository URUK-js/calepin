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
  const { start, end, type, length, setPosition, edges } = editor.selection;

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
    const newLeaf = new YLeaf({ ...leaf.toJSON(), id: undefined, text: rightText });
    newParent.insert(hasChildren(node) ? 0 : indexOfNode + 1, [
      new YNode("paragraph", {
        children: [],
        content: [newLeaf].concat(nextLeaves.map((leaf) => new YLeaf(leaf.toJSON())))
      })
    ]);
    leafContent.delete(indexOfLeaf + 1, leafNodeContentLength(start.leaf) - indexOfLeaf - 1);
    setTimeout(() => {
      setPosition(newLeaf.get("id"), { offset: 0 });
    });
  };

  let doSplit = (!edges.startNode || !edges.endNode) && type !== "multinodes";

  if ((edges.endNode || edges.startNode) && type === "collapsed") {
    const newNode = new YNode("paragraph");
    (node.parent as YArray<any>).insert(indexOfNode + (edges.endNode ? 1 : 0), [newNode]);
    return setTimeout(() => {
      setPosition(
        newNode
          .get("content")
          .get(0)
          .get("id"),
        { offset: 0 }
      );
    });
  }

  switch (type) {
    case "collapsed": {
      doSplit && split();
      break;
    }
    case "singlenode": {
      deleteText(editor, { mode: "backward" });
      doSplit && split();
      !doSplit && setPosition(start.leaf.get("id"), { offset: start.offset });

      break;
    }
    case "multinodes": {
      deleteText(editor, { mode: "backward" });
      doSplit && split();
      !doSplit && setPosition(start.leaf.get("id"), { offset: start.offset });
    }
  }
};

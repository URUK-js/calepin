import {
  Editor,
  Position,
  EdytorSelection,
  deleteText,
  YArray,
  YText,
  leafNodeContent,
  leafString,
  leafLength,
  deleteLeafText,
  leafNodeContentLength,
  hasChildren,
  getNodeChildren,
  createLeaf,
  createNode
} from "..";

export type splitNodeOperation = {
  at: Position;
  range?: EdytorSelection;
  yText?: YText;
};

const split = (editor: Editor) => {
  const { start, setPosition } = editor.selection;
  const leafContent = leafNodeContent(start.leaf);

  // we get the next leaves + right text that represent the split content to move below
  const nextLeaves = leafContent.toArray().filter((_, i) => i > start.leafIndex);
  const rightText = leafString(start.leaf).substring(start?.offset, leafLength(start.leaf));

  // we delete the right text from the current leaf
  deleteLeafText(start.leaf, start?.offset, rightText.length, false);
  // we get the container to push split content into
  const newParent = hasChildren(start.node) ? getNodeChildren(start.node) : (start.node.parent as YArray<any>);
  // we create the new leaf with the right text
  const newLeaf = createLeaf({ ...start.leaf.toJSON(), id: undefined, text: rightText });
  // we insert the new leaf and the next leaves into their new parent
  newParent.insert(hasChildren(start.node) ? 0 : start.nodeIndex + 1, [
    createNode(editor.defaultBlock, {
      children: [],
      content: [newLeaf].concat(nextLeaves.map((leaf) => createLeaf(leaf.toJSON())))
    })
  ]);
  setPosition(newLeaf.get("id") as string, { offset: 0 });
  // we removes the next leaves from their original parent
  leafContent.delete(start.leafIndex + 1, leafNodeContentLength(start.leaf) - start.leafIndex - 1);
};

export const splitNode = (editor: Editor) => {
  const { start, type, setPosition, edges } = editor.selection;

  // only split if the cursor isn't edgy and on a single node
  let doSplit = (!edges.startNode || !edges.endNode) && type !== "multinodes";

  if ((edges.endNode || edges.startNode) && type === "collapsed") {
    // if cursor is at edge node with insert a default block before of after the current node
    const newNode = createNode(editor.defaultBlock);
    console.log(hasChildren(start.node) && edges.endNode);

    if (hasChildren(start.node) && edges.endNode) {
      // if node has children we insert the new node before them
      getNodeChildren(start.node).insert(0, [newNode]);
    } else {
      // if node don't have children we insert the new node after or before it
      (start.node.parent as YArray<any>).insert(start.nodeIndex + (edges.endNode ? 1 : 0), [newNode]);
    }
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
      doSplit && split(editor);
      break;
    }
    case "singlenode": {
      deleteText(editor, { mode: "backward" });
      doSplit && split(editor);
      !doSplit && setPosition(start.leafId, { offset: start.offset });

      break;
    }
    case "multileaves":
    case "multinodes": {
      deleteText(editor, { mode: "backward" });
      doSplit && split(editor);
      !doSplit && setPosition(start.leafId, { offset: start.offset });
    }
  }
};

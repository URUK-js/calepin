import { Editor, getNode, getNodeContainer, getPath } from "..";
import { copyNode, getNodeAtPath, traverse } from "../utils";

export const nestNode = (editor: Editor) => {
  const { start, type, end, setPosition } = editor.selection;
  // get a copy of the current node before it is deleted
  const nodeCopy = copyNode(start.node);
  // get the path of the current node
  const startPath = getPath(start.node);
  // get the previous node
  let newPath = startPath.slice();
  newPath[startPath.length - 1]--;
  const prevNode = getNodeAtPath(editor, newPath);
  // if no previous node (ie the focus node is first of its parent's children) do not do anything
  if (!prevNode) return;
  // get the previous node's children array where we will put the current node
  const prevChildren = prevNode.get("children");
  switch (type) {
    case "singlenode":
    case "collapsed": {
      // delete the current node from its parent array
      getNodeContainer(start.node).delete(start.nodeIndex);
      // insert the current node copy into the previous node children array
      prevChildren.insert(prevChildren.length, [nodeCopy]);
      setPosition(start.leafId, { offset: start.offset });
      break;
    }
    case "multileaves":
    case "multinodes": {
      // set the number of node that should be removed from the current node parent array
      let length = 0;
      // set the nodes that will be pasted into the previous node children's array
      let newNodes = [];
      const startPathString = start.path.slice(0, start.path.length - 1).join("");
      const endPathString = end.path.slice(0, start.path.length - 1).join("");
      traverse(
        editor,
        (node, isText, path) => {
          if (
            // only nodes
            !isText &&
            // only nodes that have the same depth of the first focused node
            path.length === startPath.length &&
            // only nodes that are between the first and last focused nodes included
            path.join("") <= endPathString &&
            path.join("") >= startPathString
          ) {
            // increment length because this node should be removed
            length++;
            // increment length because this node should be removed
            newNodes.push(copyNode(node));
          }
        },
        { start: start.path[0], end: end.path[0] + 1 }
      );
      // delete the all selected nodes current node from the current parent array
      getNodeContainer(start.node).delete(start.nodeIndex, length);
      prevChildren.insert(prevChildren.length, newNodes);
      setPosition(start.leafId, { offset: start.offset });
      break;
    }
  }
};

import { Editor, getNode, getNodeContainer, getPath, YNode, getChildren, getContent } from "..";
import { createNode, getNodeAtPath, traverse } from "../utils";

export const nestNode = (editor: Editor) => {
  const { start, type, end, setPosition } = editor.selection;

  const startNode = getNode(start.leaf);
  const startJsonNode = startNode.toJSON();
  const startPath = getPath(startNode);
  const [index, ...newPath] = startPath.slice().reverse();
  const prevNode = getNodeAtPath(editor, [...newPath, index - 1]);
  const startContainer = getNodeContainer(startNode);
  switch (type) {
    case "singlenode":
    case "collapsed": {
      if (!prevNode) return;
      const id = start.leaf.get("id");
      const prevChildren = prevNode.get("children");
      startContainer.delete(index);

      prevChildren.insert(prevChildren.length, [
        createNode(startJsonNode.type, {
          ...startJsonNode,
          children: startJsonNode.children.map(getChildren),
          content: startJsonNode.content.map(getContent)
        })
      ]);

      setPosition(id, { offset: start.offset });
      break;
    }
    case "multileaves":
    case "multinodes": {
      let length = 0;
      let newNodes = [];
      const id = start.leaf.get("id");
      const startPathString = start.path.slice(0, start.path.length - 1).join("");
      const endPathString = end.path.slice(0, start.path.length - 1).join("");
      traverse(
        editor,
        (node, isText) => {
          if (!isText) {
            const path = getPath(node).join("");

            if (path.length === startPath.length) {
              if (path <= endPathString && path >= startPathString) {
                length++;
                const jsonNode = node.toJSON();
                newNodes.push(
                  createNode(jsonNode.type, {
                    ...jsonNode,
                    children: jsonNode.children.map(getChildren),
                    content: jsonNode.content.map(getContent)
                  })
                );
              }
            }
          }
        },
        { start: start.path[0], end: end.path[0] + 1 }
      );
      if (!prevNode) return;

      const prevChildren = prevNode.get("children");

      startContainer.delete(index, length);
      prevChildren.insert(prevChildren.length, newNodes);
      setPosition(id, { offset: start.offset });
      break;
    }
  }
};

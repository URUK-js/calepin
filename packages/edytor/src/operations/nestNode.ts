import { Editor, getNode, getNodeContainer, getPath, YNode, getChildren, getContent } from "..";

export const nestNode = (editor: Editor) => {
  const { start, type, end } = editor.selection;

  const startNode = getNode(start.leaf);
  const startJsonNode = startNode.toJSON();
  const startPath = getPath(startNode);
  const [index, ...newPath] = startPath.slice().reverse();
  const prevNode = editor.doc.getNodeAtPath([...newPath, index - 1]);
  const startContainer = getNodeContainer(startNode);
  switch (type) {
    case "singlenode":
    case "collapsed": {
      if (!prevNode) return;
      const prevChildren = prevNode.get("children");
      startContainer.delete(index);
      prevChildren.insert(prevChildren.length, [
        new YNode(startJsonNode.type, {
          ...startJsonNode,
          children: startJsonNode.children.map(getChildren),
          content: startJsonNode.content.map(getContent)
        })
      ]);
      break;
    }
    case "multinodes": {
      let length = 0;
      let newNodes = [];
      const startPathString = start.path.slice(0, start.path.length - 1).join("");
      const endPathString = end.path.slice(0, start.path.length - 1).join("");
      editor.doc.traverse(
        (node, isText) => {
          if (!isText) {
            const path = getPath(node).join("");

            if (path.length === startPath.length) {
              if (path <= endPathString && path >= startPathString) {
                length++;
                const jsonNode = node.toJSON();
                newNodes.push(
                  new YNode(jsonNode.type, {
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
      break;
    }
  }
};

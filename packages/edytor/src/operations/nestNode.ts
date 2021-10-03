import { Editor, getNode, getNodeContainer, getPath, YNode, getChildren, getContent } from "../../../edytor";

export const nestNode = (editor: Editor) => {
  const { start } = editor.selection();
  const currentNode = getNode(start.leaf);
  const currentJsonNode = currentNode.toJSON();
  const currentPath = getPath(currentNode);
  const [index, ...newPath] = currentPath.slice().reverse();

  const prevNode = editor.doc.getNodeAtPath([...newPath, index - 1]);
  if (!prevNode) return;
  const prevChildren = prevNode.get("children");
  console.log(currentNode.toJSON());
  getNodeContainer(currentNode).delete(index);
  prevChildren.insert(prevChildren.length, [
    new YNode("paragraph", {
      ...currentJsonNode,
      children: currentJsonNode.children.map(getChildren),
      content: currentJsonNode.content.map(getContent)
    })
  ]);

  console.log(currentNode.toJSON());
};

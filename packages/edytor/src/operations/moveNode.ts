import { Editor, getIndex, getNodeContainer, getPath, YNode, getChildren, getContent } from "..";
import { YMap } from "yjs/dist/src/internals";

export type moveNodeOperation = {
  from: {
    node?: YMap<any>;
    path?: number[];
  };
  to: {
    node?: YMap<any>;
    path?: number[];
    index?: number;
  };
};
export const moveNode = (editor: Editor, { from, to }: moveNodeOperation) => {
  const node = from.node || editor.doc.getNodeAtPath(from.path);
  // const destinationNode = to.node || editor.doc.getNodeAtPath(to.path);
  const startContainer = getNodeContainer(node);

  const destinationContainer = editor.doc.getContainerAtPath(to.path);

  const startJsonNode = node.toJSON();
  const nodeCopy = new YNode(startJsonNode.type, {
    ...startJsonNode,
    children: startJsonNode.children.map(getChildren),
    content: startJsonNode.content.map(getContent)
  });

  destinationContainer.insert(to.index || to.path.slice().reverse()[0], [nodeCopy]);
  startContainer.delete(getIndex(node));
};

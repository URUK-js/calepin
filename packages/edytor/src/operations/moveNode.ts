import { Editor, getIndex, getNodeContainer, getPath, YNode, getChildren, getContent } from "..";
import { copyNode } from "../utils";

export type moveNodeOperation = {
  from: {
    node?: YNode;
    path?: number[];
  };
  to: {
    path?: number[];
    index?: number;
  };
};
export const moveNode = (editor: Editor, { from, to }: moveNodeOperation) => {
  const node = from.node || editor.doc.getNodeAtPath(from.path);
  const startContainer = getNodeContainer(node);
  const destinationContainer = editor.doc.getContainerAtPath(to.path);
  const nodeCopy = copyNode(node);
  destinationContainer.insert(to.index || to.path.slice().reverse()[0], [nodeCopy]);
  startContainer.delete(getIndex(node));
};

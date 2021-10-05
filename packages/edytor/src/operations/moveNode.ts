import { Editor, getIndex, getNodeContainer, getPath, YNode, getChildren, getContent } from "..";
import { YArray } from "../../../../node_modules/yjs/dist/src/internals";
import { copyNode } from "../utils";

export type moveNodeOperation = {
  from: {
    container: YArray<any>;
    at: number;
  };
  to: {
    container: YArray<any>;
    at: number;
  };
};
export const moveNode = ({ from, to }: moveNodeOperation) => {
  console.log({
    from: { ...from, container: from.container.toJSON() },
    to: { ...to, container: to.container.toJSON() }
  });
  const node = from.container.get(from.at);
  const nodeCopy = copyNode(node);
  to.container.insert(to.at, [nodeCopy]);
  from.container.delete(getIndex(node));
};
// export type moveNodeOperation = {
//   from: {
//     node?: YNode;
//     path?: number[];
//   };
//   to: {
//     path?: number[];
//     node?: YNode;
//   };
//   position?: "above" | "below";
// };
// export const moveNode = (editor: Editor, { from, to, position = "below" }: moveNodeOperation) => {
//   const node = from.node || editor.doc.getNodeAtPath(from.path);
//   const startContainer = getNodeContainer(node);
//   const destinationNode = to.node || editor.doc.getNodeAtPath(to.path);

//   console.log(destinationNode?.toJSON());
//   const destinationNodeIndex =
//     to.path.length === 1 ? to.path.length[0] : destinationNode ? getIndex(destinationNode) : 0;
//   const destinationContainer =
//     to.path.length === 1
//       ? editor.doc.children
//       : destinationNode
//       ? getNodeContainer(node)
//       : editor.doc.getNodeAtPath(to.path.slice(0, to.path.length - 1)).get("children");
//   const nodeCopy = copyNode(node);
//   destinationContainer.insert(destinationNodeIndex + (destinationNode ? (position === "above" ? 0 : 1) : 0), [
//     nodeCopy
//   ]);
//   startContainer.delete(getIndex(node));
// };

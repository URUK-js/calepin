import { getIndex } from "..";
import { YArray } from "../../../../node_modules/yjs/dist/src/internals";
import { copyNode } from "../utils";

export type moveNodeOperation = {
  from: {
    container: YArray<any> | any;
    at: number | number[];
  };
  to: {
    container: YArray<any>;
    at: number;
  };
};
export const moveNode = ({ from, to }: moveNodeOperation) => {
  const indexes = Array.isArray(from.at) ? from.at : [from.at];
  const [firstIndex] = indexes;
  const firstNode = from.container.get(firstIndex);

  const nodesCopies = indexes.map((index) => copyNode(from.container.get(index)));

  to.container.insert(to.at, nodesCopies);
  from.container.delete(getIndex(firstNode), indexes.length);
  return nodesCopies[0]
    .get("content")
    .get(0)
    .get("id");
};

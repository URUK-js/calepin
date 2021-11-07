import { getIndex, EdytorArray, copyNode } from "..";

export type moveNodeOperation = {
  from: {
    container: EdytorArray | any;
    at: number | number[];
  };
  to: {
    container: EdytorArray;
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

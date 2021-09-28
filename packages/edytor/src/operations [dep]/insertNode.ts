import { YMap } from "yjs/dist/src/internals";
import { getYNode } from "../utils";

export const insertNode = (
  doc: YMap<any>,
  at: number,
  newNode = getYNode({ type: "paragraph", children: [{ text: "" }] })
) => {
  doc.get("children").insert(at, [newNode]);
};

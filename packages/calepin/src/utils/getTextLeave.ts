import { YMap, YArray, YText } from "yjs/dist/src/internals";

export const getTextLeave = (doc: YMap<any>, path: number[]): YText => {
  let children = doc as YMap<any> | YArray<any>;
  for (let i = 0; i < path.length; i++) {
    const index = path[i];
    let c;
    //@ts-ignore
    if (children.has("children")) {
      //@ts-ignore
      c = children.get("children").get(index);
    } else {
      //@ts-ignore
      c = children.get(index);
    }
    children = c;
  }
  //@ts-ignore
  return children.get("text");
};

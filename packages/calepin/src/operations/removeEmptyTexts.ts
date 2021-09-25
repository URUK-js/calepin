import { YText, YArray } from "yjs/dist/src/internals";

export const removeEmptyTexts = (yText: YText) => {
  let parent = yText.parent?.parent as YArray<any>;
  parent.toArray().forEach((map, i) => {
    if (map.get("text").length === 0) {
      parent.delete(i);
    }
  });
  // if (parent?._length === 1 && yText.length === 0) {
  //   parent.delete(0);
  // }
  //   while (parent.length === 0) {
  //     parent.remove();
  //   }
};

import { YArray, YText, YMap } from "..";
export const removeEmptyText = (yText: YText) => {
  let array = yText?.parent?.parent as YArray<YMap<any>> | undefined;
  const index = (array: YArray<any>, node: YMap<any>) => array?.toArray().indexOf(node);
  array?.delete(index(array, yText.parent as YMap<any>)!);
  while (array && array.length === 0) {
    const pop = array.parent as YMap<any>;
    const pop_pop = pop.parent as YArray<YMap<any>>;
    if (pop_pop) {
      const i = index(pop_pop, pop);
      i !== -1 && pop_pop.delete(i);
      array = pop_pop;
    } else {
      array = undefined;
    }
  }
};

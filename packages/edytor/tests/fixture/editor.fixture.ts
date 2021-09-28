import { toYJS } from "../../";
import { arePathsEquals, Editor, EdytorSelection } from "../../src";
import { getLeafAtPath } from "../../src/utils/getLeafAtPath";
type partialSelection = {
  start: {
    path: number[];
    offset: number;
  };

  end?: {
    path: number[];
    offset: number;
  };
  length: number;
};

const makeSelectionFromPartial = (doc, selection: partialSelection): EdytorSelection => {
  let { start, end } = selection;

  start = {
    ...start,
    leaf: getLeafAtPath(doc, start.path).get("text")
  };
  const hasEnd = !!end;
  if (!hasEnd) end = start;

  end = {
    ...end,
    leaf: getLeafAtPath(doc, end.path).get("text")
  };
  const equalPaths = arePathsEquals(start.path, end.path);

  return {
    start,
    editorOffset: 0,
    end,
    edges: {
      start: start.offset === 0,
      end: end.offset === end.leaf.length
    },
    type: !end ? "collapsed" : equalPaths ? "singlenode" : "multinodes"
  } as EdytorSelection;
};

// const toYJS =(value)=>{

// }

export const makeEditorFixture = (value: any, selection?: partialSelection): Editor => {
  if (!selection) selection = { start: { path: [0, 0], offset: 0 }, length: 0 };
  const doc = toYJS(value).getMap("document");

  //@ts-ignore
  return {
    doc: () => doc.doc,
    toYJS: () => doc,
    toJSON: () => doc.toJSON(),
    selection: makeSelectionFromPartial(doc, selection)
  } as Editor;
};

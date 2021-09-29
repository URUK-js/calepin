import { Editor, EdytorDoc, jsonNode, arePathsEquals } from "../..";
import { EdytorSelection } from "../../src";

type partialSelection = {
  start: {
    path: number[];
    offset: number;
  };

  end?: {
    path: number[];
    offset: number;
  };
  length?: number;
};

const makeSelectionFromProgrammaticOperation = (doc: EdytorDoc, selection: partialSelection): EdytorSelection => {
  let { start, end, length } = selection as EdytorSelection;

  start = {
    ...start,
    leaf: doc.getLeafAtPath(start.path)
  };
  const hasEnd = !!end;
  if (!hasEnd) end = start;

  end = {
    ...end,
    leaf: doc.getLeafAtPath(end.path)
  };
  const equalPaths = arePathsEquals(start.path, end.path);
  if (!start.leaf) {
    return { type: "notInDoc" };
  } else {
    return {
      start,
      editorOffset: 0,
      end,
      length: length || end.offset - start.offset,
      edges: {
        start: start.offset === 0,
        end: end.offset === end.leaf.length
      },
      type: !hasEnd ? "collapsed" : equalPaths ? "singlenode" : "multinodes"
    } as EdytorSelection;
  }
};

export const makeEditorFixture = (value: jsonNode[], selection?: partialSelection): Editor => {
  if (!selection) selection = { start: { path: [0, 0], offset: 0 }, length: 0 };
  const doc = new EdytorDoc(value);

  //@ts-ignore
  return {
    doc,
    children: doc.getArray("children"),
    toJSON: () => {
      doc.traverse((node) => node.delete("id"));
      return doc.children.toJSON();
    },
    selection: () => makeSelectionFromProgrammaticOperation(doc, selection)
  } as Editor;
};

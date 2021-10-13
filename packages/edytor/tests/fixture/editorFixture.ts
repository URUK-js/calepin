import { Editor, EdytorDoc, jsonNode } from "../..";
import {
  DocFromJson,
  EdytorSelection,
  getIndex,
  getLeafAtPath,
  getPath,
  leafLength,
  leafNode,
  leafNodeContentLength,
  leafString,
  toString,
  traverse
} from "../../src";

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
  const startLeaf = getLeafAtPath({ children: doc.getArray("children") }, start.path);
  const endLeaf = getLeafAtPath({ children: doc.getArray("children") }, end?.path || start.path);
  if (!startLeaf) return { type: "notInDoc" };
  start = {
    ...start,
    leaf: startLeaf,
    node: leafNode(startLeaf),
    leafId: startLeaf.get("id"),
    leafIndex: getIndex(startLeaf),
    nodeIndex: getIndex(leafNode(startLeaf)),
    path: getPath(startLeaf),
    leafHtml: null,
    nodeHtml: null,
    offset: start.offset
  };
  const hasEnd = !!end;
  if (!hasEnd) end = start;

  end = {
    leaf: endLeaf,
    node: leafNode(endLeaf),
    leafId: endLeaf.get("id"),
    leafIndex: getIndex(endLeaf),
    nodeIndex: getIndex(leafNode(endLeaf)),
    path: getPath(endLeaf),
    leafHtml: null,
    nodeHtml: null,
    offset: end.offset
  };

  let selectedText = "";
  traverse({ children: doc.getArray("children") }, (leaf, isText) => {
    const startPathString = start.path.join(",");
    const endPathString = end.path.join(",");
    if (isText) {
      const path = getPath(leaf);

      if (path.join(",") === startPathString) {
        selectedText += leafString(leaf).substring(start.offset, leafLength(leaf));
      } else if (path > start.path && path < end.path) {
        selectedText += leafString(leaf);
      } else if (path.join(",") === endPathString) {
        selectedText += leafString(leaf).substring(0, end.offset);
      }
    }
  });

  const equalPaths = start.path.join("") === end.path.join("");
  if (!start.leaf) {
    return { type: "notInDoc" } as EdytorSelection;
  } else {
    //@ts-ignore
    return {
      start,
      end,
      selectedText,
      length: selectedText.length,
      edges: {
        startLeaf: start.offset === 0,
        startNode: start.offset === 0 && getIndex(start.leaf) === 0,
        endLeaf: end.offset === leafLength(end.leaf),
        endNode: end.offset === leafLength(end.leaf) && getIndex(start.leaf) === leafNodeContentLength(end.leaf) - 1
      },
      type: !hasEnd ? "collapsed" : equalPaths ? "singlenode" : start.node === end.node ? "multileaves" : "multinodes",
      setPosition: () => null
    } as EdytorSelection;
  }
};

export const makeEditorFixture = (value: jsonNode[], selection?: partialSelection): Editor => {
  if (!selection) selection = { start: { path: [0, 0], offset: 0 }, length: 0 };
  const doc = DocFromJson(value);

  return {
    doc,
    children: doc.getArray("children"),
    toJSON: (remove = true): jsonNode[] => {
      let array = [...doc.getArray("children").toJSON()];
      return remove ? removeIds(array) : array;
    },
    toRawText: () => toString({ children: doc.getArray("children") }),
    selection: makeSelectionFromProgrammaticOperation(doc, selection)
  } as Editor;
};

export const removeIds = (doc) => {
  const newValue = [...doc];
  const traverse = (node) => {
    delete node.id;
    if (!node.text) {
      const array = (node.content || []).concat(node.children || []);
      for (let i = 0; i < array.length; i++) {
        traverse(array[i]);
      }
    }
  };

  for (let i = 0; i < newValue.length; i++) {
    traverse(newValue[i]);
  }

  return newValue;
};

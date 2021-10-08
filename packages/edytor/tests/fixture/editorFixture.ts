import { encodeStateAsUpdateV2 } from "yjs";
import { Editor, EdytorDoc, jsonNode } from "../..";
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
  const equalPaths = start.path.join("") === end.path.join("");
  if (!start.leaf) {
    return { type: "notInDoc" } as EdytorSelection;
  } else {
    return {
      start,
      editorOffset: 0,
      end,
      length: length || end.offset - start.offset,
      edges: {
        start: start.offset === 0,
        end: end.offset === end.leaf.length()
      },
      type: !hasEnd ? "collapsed" : equalPaths ? "singlenode" : "multinodes",
      setPosition: () => null
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
    toJSON: (): jsonNode[] => {
      let array = doc.children.toJSON();

      const traverse = (node) => {
        if (!node.text) {
          const array = (node.content || []).concat(node.children || []);
          for (let i = 0; i < array.length; i++) {
            traverse(array[i]);
          }
        } else {
          node.id = undefined;
          delete node.id;
        }
      };

      for (let i = 0; i < array.length; i++) {
        traverse(array[i]);
      }

      return array;
    },
    removeIds: (doc) => {
      const traverse = (node) => {
        if (!node.text) {
          const array = (node.content || []).concat(node.children || []);
          for (let i = 0; i < array.length; i++) {
            traverse(array[i]);
          }
        } else {
          delete node.id;
        }
      };

      for (let i = 0; i < doc.length; i++) {
        traverse(doc[i]);
      }
      return doc;
    },
    toUpdate: () => encodeStateAsUpdateV2(doc),
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

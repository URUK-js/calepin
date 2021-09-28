import * as Y from "yjs";
import { YArray, YMap, YText } from "yjs/dist/src/internals";
import { getYNode } from "../utils";
import { Editor, Position, EdytorSelection } from "../types";
import { deleteText, insertNode } from ".";

export type splitNodeOperation = {
  at: Position;
  range?: EdytorSelection;
  yText?: YText;
};

export const splitNode = (editor: Editor | Pick<Editor, "toYJS" | "selection">) => {
  const doc = editor.toYJS();

  const { start, end, type, length, edges } = editor.selection();
  const [indexOfAncestor] = start?.path;
  const [indexOfLeaf] = start?.path.slice().reverse();
  doc.doc?.transact(() => {
    const split = () => {
      const leaf = start.leaf;
      const branch = leaf.parent as YMap<any>;
      const node = branch.parent as YArray<any>;
      const rootArray = doc.get("children") as YArray<any>;

      const rightNodes = node.toArray().filter((_, i) => i > indexOfLeaf);
      const right = leaf?.toString()?.substring(start?.offset, leaf.length);
      console.log(rightNodes);
      leaf.delete(start?.offset, right.length);
      const { text: _, ...props } = branch?.toJSON();
      const newNode = new Y.Map();
      rootArray.insert(indexOfAncestor + 1, [newNode]);
      getYNode(
        { ...props, children: [{ ...branch?.toJSON(), text: right }, ...rightNodes.map((x) => x.toJSON())] },
        newNode
      );
      node.delete(indexOfLeaf + 1, rightNodes.length);
    };

    let doSplit = !(edges.start || edges.end);
    // empty node of the node => just insert en empty paragraph before

    if (edges.end && edges.start) {
      insertNode(doc, indexOfAncestor);
    } else if (edges.end) {
      // end of the node => just insert en empty paragraph before
      insertNode(doc, indexOfAncestor + 1);
    } else if (edges.start) {
      // start of the node => just insert en empty paragraph after
      insertNode(doc, indexOfAncestor);
    }

    switch (type) {
      case "collapsed": {
        doSplit && split();

        break;
      }
      case "singlenode": {
        deleteText(editor, { start, end, length, type });
        doSplit && split();

        break;
      }
      case "multinodes": {
        deleteText(editor, { start, end, length, type });
      }
    }
  });
  return indexOfAncestor + (edges.end && edges.start ? 1 : indexOfLeaf === 0 && start.offset === 0 ? 0 : 1);
};

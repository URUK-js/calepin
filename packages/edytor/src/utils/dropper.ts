import { Editor } from "..";
import { moveNode } from "../operations";
import { YNode } from "./yClasses";

type Fragment = any;

export class Dropper {
  startPath;
  startNode;
  dropPath: number[];
  dropFragments: Fragment[];
  node: YNode[];
  editor: Editor;

  setStartPath = (path: number[]) => {
    this.startPath = path;
  };
  setDropPath = (path: number[]) => {
    this.dropPath = path;
  };
  moveNode = (editor) => {
    console.log({ from: { path: this.startPath }, to: { path: this.dropPath } });
    moveNode(editor, { from: { path: this.startPath }, to: { path: this.dropPath } });
  };
}

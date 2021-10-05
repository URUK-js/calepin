import { Editor } from "../types";
import { onMouseMove } from "./onMouseMove";

export const onDrop = (editor: Editor, e: DragEvent) => {
  //   e.preventDefault();
  console.log(editor.dropper.dropPath, editor.dropper.startPath);
  if (e.dataTransfer?.files.length > 0) {
    e.preventDefault();
    console.log(e.dataTransfer?.files);
  }
};
export const onDragOver = (editor: Editor, e: DragEvent) => {
  e.preventDefault();

  if (e.dataTransfer?.files.length > 0) {
    e.preventDefault();
    console.log(e.dataTransfer?.files);
  }
};

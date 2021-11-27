import { Editor } from "..";

export const onDrop = (editor: Editor, e: DragEvent) => {
  if (e.dataTransfer?.files.length > 0) {
    e.preventDefault();
    if (!editor.acceptedFileTypes) return;
    let files = [] as File[];
    for (let i = 0; i < e.dataTransfer.files.length; i++) {
      const file = e.dataTransfer.files[i];
      console.log(file.type);
      if (editor.acceptedFileTypes.includes(file.type)) {
        files.push(file);
      }
    }
    editor.onFileDrop && editor.onFileDrop(editor, files, editor.dropper.to);
  }
  const dndIndicator = document.getElementById("dndIndicator");
  dndIndicator.style.opacity = "0";
};
export const onDragOver = (editor: Editor, e: DragEvent) => {
  if (!editor.acceptedFileTypes) return;
  e.preventDefault();
  editor.dropper.onDrag(e);
};

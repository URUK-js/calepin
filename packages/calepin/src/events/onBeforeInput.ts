import { YText } from "yjs/dist/src/internals";
import { Cursor, getLeaf, getTextLeave, getRange, getDataTransfert } from "../utils";
import { onBeforeInputData } from "../types";
import { splitNode, insertText, deleteText, formatText } from "../operations";

let currentNode = undefined as Node | undefined;
let currentPath = undefined as string | undefined;
let currentText = undefined as YText | undefined;

const prevent = (e: InputEvent) => {
  e.preventDefault();
  e.stopPropagation();
};
export const onBeforeInput = ([doc, onChange, editor]: onBeforeInputData, e: InputEvent) => {
  prevent(e);
  // console.log(e);
  const editorDiv = e.target as HTMLDivElement;
  const selection = window.getSelection();
  if (selection === null) return;
  const { anchorNode, focusNode, anchorOffset, focusOffset, isCollapsed } = selection;

  const range = isCollapsed ? undefined : getRange(selection);

  let offset = Cursor.getCurrentCursorPosition(
    editorDiv,
    isCollapsed ? focusNode : range?.start.node,
    isCollapsed ? focusOffset : range?.start.offset
  );

  const rangeLength = selection.getRangeAt(0).toString().length;
  const [leaf, path] = getLeaf(anchorNode as HTMLElement);

  // if (currentNode !== focusNode) {

  currentNode = focusNode!;
  currentText = getTextLeave(doc(), path);
  // }
  console.log({ currentText, path, anchorNode, focusNode, selection });
  if (!currentText) return;
  const start = Math.min(anchorOffset, focusOffset);
  const setPosition = (chars: number) => Cursor.setCurrentCursorPosition(offset + chars, editorDiv, selection);

  switch (e.inputType) {
    case "insertFromPaste":
    case "insertLineBreak":
    // case "insertCompositionText":
    // case "insertFromDrop":
    case "insertText": {
      const text =
        e.inputType === "insertLineBreak"
          ? "\n"
          : e.inputType === "insertFromPaste"
          ? getDataTransfert(e)
          : (e.data as string);

      insertText(editor, {
        text,
        range,
        at: { path, node: anchorNode!, offset: anchorOffset },
        yText: currentText
      });
      if (rangeLength > 0 && anchorNode === focusNode) {
        Cursor.setCurrentCursorPosition(offset - rangeLength + text?.length, editorDiv);
      } else {
        console.log("ici");
        Cursor.setCurrentCursorPosition(offset + text?.length, editorDiv);
      }
      break;
    }
    case "deleteContentBackward": {
      deleteText(editor, {
        length: rangeLength === 0 ? 1 : rangeLength,
        range,
        at: { path, node: anchorNode!, offset: anchorOffset - 1 },
        yText: currentText
      });
      Cursor.setCurrentCursorPosition(offset, editorDiv);
      break;
    }
    case "deleteByDrag":
    case "deleteByCut":
    case "deleteContentForward": {
      deleteText(editor, {
        length: rangeLength === 0 ? 1 : rangeLength,
        range,
        at: { path, node: anchorNode!, offset: anchorOffset },
        yText: currentText
      });
      if (e.inputType !== "deleteByDrag") {
        Cursor.setCurrentCursorPosition(offset, editorDiv);
      }
      break;
    }

    case "insertParagraph": {
      const newPath = splitNode(editor, {
        at: {
          path,
          offset: Cursor.getCurrentCursorPosition(leaf, focusNode!, focusOffset!)
        },
        yText: currentText,
        range
      });

      var textNode = editorDiv.querySelector(`[data-calepin-path="${newPath},0"]`)?.firstChild;
      selection.collapse(textNode as ChildNode, 0);
      break;
    }
    // case "deleteByDrag": {
    //   console.log({ e });
    // }

    case "insertFromDrop": {
      setTimeout(() => {
        const text = e.dataTransfer?.getData("text/plain");
        if (text) {
          insertText(editor, {
            text,
            range,
            at: { path, node: anchorNode!, offset: anchorOffset },
            yText: currentText
          });
          if (rangeLength > 0 && anchorNode === focusNode) {
            Cursor.setCurrentCursorPosition(offset - rangeLength + text.length, editorDiv);
          } else {
            Cursor.setCurrentCursorPosition(offset + text.length, editorDiv);
          }
        }
      }, 50);
    }
    case "deleteSoftLineBackward": {
      break;
    }
    case "deleteWordForward": {
      break;
    }
    case "insertFromYank": {
      break;
    }
    case "formatSetBlockTextDirection": {
      break;
    }
    case "formatSetInlineTextDirection": {
      break;
    }
    case "deleteWordBackward": {
      break;
    }
    case "insertCompositionText": {
      break;
    }
    case "formatItalic":
    case "formatBold": {
      const beforeElement = editorDiv.querySelector(
        `[data-calepin-path="${[...path.slice(0, path.length - 1), path.slice().reverse()[0] - 1]}"]`
      );
      const beforeOffset = beforeElement?.textContent.length;
      const newPath = formatText(editor, {
        yText: currentText,
        at: { offset: anchorOffset, path },
        range,
        format: e.inputType === "formatItalic" ? "italic" : "bold"
      });

      // Cursor.setCurrentCursorPosition(0, focusNode, selection);

      if (range?.type === "singlenode") {
        // let newNode = editorDiv.querySelector(
        //   `[data-calepin-path="${newPath === -1 ? path : [...path.slice(0, path.length - 1), newPath]}"]`
        // );
        let newNode =
          newPath === -1
            ? beforeElement
            : editorDiv.querySelector(
                `[data-calepin-path="${
                  newPath === -1
                    ? path
                    : [...path.slice(0, path.length - 1)].concat(
                        newPath === -1 ? [path.slice().reverse()[0]] : [newPath]
                      )
                }"]`
              );
        const R = document.createRange();

        let textNode = newNode;
        while (textNode?.nodeType !== 3 && textNode?.firstChild) {
          textNode = textNode?.firstChild;
        }

        console.log({ newNode, newPath, rangeLength, textNode, beforeOffset, rangeLength });
        selection.removeAllRanges();
        R.setStart(textNode, newPath === -1 ? beforeOffset : 0);
        R.setEnd(textNode, newPath === -1 ? beforeOffset + rangeLength : rangeLength);
        selection.addRange(R);

        // R.setStart(textNode, 0);
        // R.setEnd(textNode, textNode?.textContent?.length - 1);
        // selection.selectAllChildren(textNode as ChildNode);
      }
      break;
    }

    case "insertReplacementText": {
      const dataTransfer = e.dataTransfer as DataTransfer;
      const data = dataTransfer.getData("text/plain");
      doc().doc.transact(() => {
        currentText!.delete(start, rangeLength);
        currentText?.insert(start, data);
      });
      setPosition(focusOffset - anchorOffset > 0 ? -rangeLength + data.length : 0 + data.length);
    }
  }
  // if (currentText?.length === 0) {
  //   const parent = currentText.parent?.parent as YArray<any>;
  //   const [index] = path.reverse();
  //   parent.delete(index, 1);
  //   console.log("delete", currentText.parent);
  // }
  console.log(editor.toJSON());

  onChange && onChange(editor);
};

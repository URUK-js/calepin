import { Cursor, replaceLeafText } from "../utils";
import { onBeforeInputData } from "../types";
import { splitNode, insertText, deleteText, formatText } from "../operations";

const prevent = (e: InputEvent) => {
  e.preventDefault();
  e.stopPropagation();
};

const getDataTransfer = (e: InputEvent) => e.dataTransfer.getData("text/plain");

export const onBeforeInput = ([doc, onChange, editor]: onBeforeInputData, e: InputEvent) => {
  prevent(e);
  // console.log(e);

  const editorDiv = e.target as HTMLDivElement;

  const { editorOffset, selection, start, length } = editor.selection;
  const { anchorNode, focusNode, anchorOffset, focusOffset, isCollapsed } = selection;
  const rangeLength = selection.getRangeAt(0)?.toString()?.length;

  const setPosition = (chars: number) => Cursor.setCurrentCursorPosition(editorOffset + chars, editorDiv, selection);

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
          ? getDataTransfer(e)
          : (e.data as string);

      insertText(editor, {
        text
      });

      editor.cursor().set(editorOffset + text?.length);
      break;
    }
    case "deleteContentBackward": {
      deleteText(editor, { mode: "backward" });
      console.log(editor.toJSON());

      // Cursor.setCurrentCursorPosition(
      //   rangeLength === 0 ? (anchorOffset === 1 ? editorOffset : editorOffset - 1) : editorOffset,
      //   editorDiv
      // );
      break;
    }
    case "deleteByDrag":
    case "deleteByCut":
    case "deleteContentForward": {
      deleteText(editor, { mode: "forward" });
      if (e.inputType !== "deleteByDrag") {
        Cursor.setCurrentCursorPosition(editorOffset, editorDiv);
      }
      break;
    }

    case "insertParagraph": {
      const newPath = splitNode(editor);

      var textNode = editorDiv.querySelector(`[data-edytor-path="${newPath},0"]`)?.firstChild;
      selection.collapse(textNode as ChildNode, 0);
      break;
    }

    case "insertFromDrop": {
      setTimeout(() => {
        const text = e.dataTransfer?.getData("text/plain");
        if (text) {
          insertText(editor, {
            text
          });
          if (rangeLength > 0 && anchorNode === focusNode) {
            Cursor.setCurrentCursorPosition(editorOffset - rangeLength + text.length, editorDiv);
          } else {
            Cursor.setCurrentCursorPosition(editorOffset + text.length, editorDiv);
          }
        }
      }, 50);
      break;
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
      break;
    }

    case "insertReplacementText": {
      const dataTransfer = e.dataTransfer as DataTransfer;
      const data = dataTransfer.getData("text/plain");

      doc().doc.transact(() => {
        replaceLeafText(start.leaf, start.offset, length, data);
      });
      setPosition(focusOffset - anchorOffset > 0 ? -rangeLength + data.length : 0 + data.length);
    }
  }

  onChange && onChange(editor);
};

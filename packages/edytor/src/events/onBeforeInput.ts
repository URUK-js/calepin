import { replaceLeafText } from "../utils";
import { onBeforeInputData } from "../types";
import { splitNode, insertText, deleteText, formatText } from "../operations";

const prevent = (e: any) => {
  e.preventDefault();
  e.stopPropagation();
};

const getDataTransfer = (e: any): string => e.dataTransfer.getData("text/plain");

export const onBeforeInput = ([doc, onChange, editor]: onBeforeInputData, e: InputEvent) => {
  // console.log(e);
  const { start, length, setPosition } = editor.selection;

  // if (e.composedPath().some((el) => el.getAttribute && el.getAttribute("data-edytor-void") === "true")) {
  //   return;
  // }
  const tag = e.target?.tagName;
  if (tag === "TEXTAREA" || tag === "INPUT") return;
  prevent(e);
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

      break;
    }
    case "deleteContentBackward": {
      deleteText(editor, { mode: "backward" });

      break;
    }
    case "deleteByDrag":
    case "deleteByCut":
    case "deleteContentForward": {
      deleteText(editor, { mode: "forward" });
      break;
    }

    case "insertParagraph": {
      splitNode(editor);
      break;
    }

    case "insertFromDrop": {
      setTimeout(() => {
        const text = getDataTransfer(e);
        if (text) {
          insertText(editor, {
            text
          });
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
      replaceLeafText(start.leaf, start.offset, length, getDataTransfer(e));
      setPosition(start.leafId, { offset: start.offset });
    }
  }

  onChange && onChange(editor);
};

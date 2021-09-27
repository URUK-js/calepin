import { EdytorSelection } from "../types";

export class Cursor {
  container: HTMLDivElement;
  selection: () => EdytorSelection;
  constructor({ container, selection }) {
    this.container = container;
    this.selection = selection;
  }
  getEditorOffset = (selection: Selection): number => {
    let { focusNode, focusOffset } = selection;
    var charCount = -1,
      node;
    if (!focusNode) {
      const selection = window.getSelection();
      focusNode = selection.focusNode;
      focusOffset = selection?.focusOffset;
    }

    if (focusNode) {
      if (Cursor._isChildOf(focusNode, this.container)) {
        node = focusNode;
        charCount = focusOffset;

        while (node) {
          if (node === this.container) {
            break;
          }

          if (node.previousSibling) {
            node = node.previousSibling;
            charCount += node.textContent.length;
          } else {
            node = node.parentNode;
            if (node === null) {
              break;
            }
          }
        }
      }
    }

    return charCount;
  };

  static getCurrentCursorPosition(parentElement: HTMLElement | Node, focusNode?: Node, focusOffset?: number) {
    var charCount = -1,
      node;
    if (!focusNode) {
      const selection = window.getSelection();
      focusNode = selection.focusNode;
      focusOffset = selection?.focusOffset;
    }

    if (focusNode) {
      if (Cursor._isChildOf(focusNode, parentElement)) {
        node = focusNode;
        charCount = focusOffset;

        while (node) {
          if (node === parentElement) {
            break;
          }

          if (node.previousSibling) {
            node = node.previousSibling;
            charCount += node.textContent.length;
          } else {
            node = node.parentNode;
            if (node === null) {
              break;
            }
          }
        }
      }
    }

    return charCount;
  }

  set = (offset: number) => {
    Cursor.setCurrentCursorPosition(offset, this.container, this.selection().selection);
  };
  setRange = (offset: number, length) => {
    const { range, selection } = this.selection();
    const { startNode, startOffset, endNode, endOffset } = this.getRangeBoundaries(offset, length);
    selection.removeAllRanges();

    const R = document.createRange();
    R.selectNode(this.container);
    R.setStart(startNode, startOffset);
    R.setEnd(endNode, endOffset);
    selection.addRange(R);
  };

  getRangeBoundaries = (offset: number, length) => {
    const [startNode, startOffset] = this.getRangeBoundary(this.container, { count: offset - length }, true);
    const [endNode, endOffset] = this.getRangeBoundary(this.container, { count: offset }, false);

    if (startNode.length === startOffset) {
      const getNextNode = (node: ChildNode) => {
        const childNodes = Array.from(node.parentElement.childNodes);
        const index = childNodes.indexOf(node);
        console.log({ index, childNodes, next: childNodes[index + 1] });
      };
      getNextNode(startNode);
    }
    return {
      startNode,
      startOffset,
      endNode,
      endOffset
    };
  };
  getRangeBoundary = (node, chars, isStart): [ChildNode, number] => {
    let result;
    if (chars.count === 0) {
      result = [node, chars.count];
    } else if (node && chars.count > 0) {
      if (node.nodeType === Node.TEXT_NODE) {
        if (node.textContent.length < chars.count) {
          chars.count -= node.textContent.length;
        } else {
          result = [node, chars.count];
          chars.count = 0;
        }
      } else {
        for (var lp = 0; lp < node.childNodes.length; lp++) {
          result = this.getRangeBoundary(node.childNodes[lp], chars, isStart);
          if (chars.count === 0) {
            break;
          }
        }
      }
    }

    return result;
  };

  static setCurrentCursorPosition(chars, element, s?: Selection) {
    if (chars >= 0) {
      var selection = s || window.getSelection();

      let range = Cursor._createRange(element, { count: chars });

      if (range) {
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }

  static selectNode(node, startOffset, endOffset, selection) {
    if (!selection) selection = window.getSelection();

    let textNode = node;
    while (textNode?.nodeType !== 3 && textNode?.firstChild) {
      textNode = textNode?.firstChild;
    }

    selection.removeAllRanges();
    const R = document.createRange();

    R.setStart(textNode, startOffset);
    R.setEnd(textNode, endOffset);
    selection.addRange(R);
  }

  static _createRange(node, chars, range) {
    if (!range) {
      range = document.createRange();
      range.selectNode(node);
      range.setStart(node, 0);
    }

    if (chars.count === 0) {
      range.setEnd(node, chars.count);
    } else if (node && chars.count > 0) {
      if (node.nodeType === Node.TEXT_NODE) {
        if (node.textContent.length < chars.count) {
          chars.count -= node.textContent.length;
        } else {
          range.setEnd(node, chars.count);
          chars.count = 0;
        }
      } else {
        for (var lp = 0; lp < node.childNodes.length; lp++) {
          range = Cursor._createRange(node.childNodes[lp], chars, range);

          if (chars.count === 0) {
            break;
          }
        }
      }
    }

    return range;
  }

  static _isChildOf(node, parentElement) {
    while (node !== null) {
      if (node === parentElement) return true;
      node = node.parentNode;
    }

    return false;
  }
}

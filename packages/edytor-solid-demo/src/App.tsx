import { Component } from "solid-js";
import Editor from "edytor-solid";
import "@fontsource/noto-sans-hk";
import "@fontsource/space-mono";
import "@fontsource/playfair-display";
import StyleSelector from "./Editor/StyleSelector/Menu";
import { initialValue } from "./Editor/initialValue";
import "./Editor/editor.css";
import { renderHandle } from "./Handle";
import { SelectionIndicator } from "./Editor/SelectionIndicator";
import { Cursors } from "./Cursors";
import * as monaco from "monaco-editor";
import { monacoTheme } from "./theme";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";

self.MonacoEnvironment = {
  getWorker(_moduleId: unknown, label: string) {
    switch (label) {
      case "css":
        return new cssWorker();
      case "typescript":
      case "javascript":
        return new tsWorker();
      default:
        return new editorWorker();
    }
  }
};

const Code = ({ node }) => {
  console.log({ node });
  let editorContainer;
  const onMount = (ref) => {
    editorContainer = ref;

    let prevHeight = 0;

    const updateEditorHeight = () => {
      const editorElement = editor.getDomNode();

      if (!editorElement) {
        return;
      }

      const lineHeight = editor.getOption(monaco.editor.EditorOption.lineHeight);
      const lineCount = editor.getModel()?.getLineCount() || 1;
      const height = editor.getTopForLineNumber(lineCount + 1) + lineHeight;
      console.log({ height });
      if (prevHeight !== height) {
        prevHeight = height;
        console.log({ height });
        editorElement.style.height = `${height || 19}px`;
        editor.layout();
      }
    };

    monaco.editor.defineTheme("Cobalt", monacoTheme);
    const editor = monaco.editor.create(ref, {
      value: "hello",
      language: "javascript",
      automaticLayout: true,
      readOnly: false,
      scrollBeyondLastLine: false,

      lineDecorationsWidth: 10,

      hideCursorInOverviewRuler: true,
      overviewRulerBorder: false,

      selectionHighlight: true,
      lineNumbersMinChars: 5,
      padding: { top: 15 },

      scrollbar: {
        handleMouseWheel: false,
        vertical: "hidden",
        horizontal: "auto"
      },
      theme: "Cobalt",
      minimap: {
        enabled: false
      }
    });

    updateEditorHeight(); // typing
    requestAnimationFrame(updateEditorHeight); // folding
    editor.onDidChangeModelDecorations(() => {
      updateEditorHeight(); // typing
      requestAnimationFrame(updateEditorHeight); // folding
    });
  };

  return (
    <div contentEditable={false} className="p-0 mt-3 mb-3">
      <div className=" transition-none h-auto min-h-44 shadow-lg p-5 rounded-md bg-gra bg-gray-100" ref={onMount}></div>
    </div>
  );
};

const App: Component = () => {
  return (
    <div>
      <div className="p-5 mx-auto max-w-3xl shadow-xl mt-5">
        <Code />
      </div>
      <Editor
        initialValue={{
          json: initialValue()
        }}
        blocks={{ paragraph: "p", blockquote: "blockquote", "heading-1": "h1", code: Code }}
        voids={{
          blocks: {
            code: true
          }
        }}
        dnd={{
          active: true,
          renderIndicator: () => (
            <div id="dndIndicator" className="bg-yellow-400 bg-opacity-75 shadow-lg z-30" contentEditable={false} />
          )
        }}
        collaboration={{
          user: { name: "" }
        }}
        spellcheck={false}
        renderHandle={renderHandle}
        props={{ "data-font": "sans", "data-full-width": false, "data-small-text": true }}
        renderInner={() => {
          return (
            <>
              <SelectionIndicator />
              <Cursors />
            </>
          );
        }}
        renderBefore={() => {
          return (
            <>
              <StyleSelector />
            </>
          );
        }}
      />
    </div>
  );
};

export default App;

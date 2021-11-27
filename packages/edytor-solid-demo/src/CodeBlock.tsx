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

const Code = ({ node, children }) => {
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
      editor.getScrollHeight();
      const lineHeight = editor.getOption(monaco.editor.EditorOption.lineHeight);
      const lineCount = editor.getModel()?.getLineCount() || 1;
      const height = editor.getTopForLineNumber(lineCount);
      console.log({ height, lineCount }, editor.getTopForLineNumber(lineCount), editor.getScrollHeight());
      if (prevHeight !== height) {
        prevHeight = height;
        editorElement.style.height = `${height < 39 ? 33 : height - 19}px`;
        editor.layout();
      }
    };

    monaco.editor.defineTheme("Cobalt", monacoTheme);
    const editor = monaco.editor.create(ref, {
      value: "hello",
      language: "typescript",
      automaticLayout: true,
      readOnly: false,
      scrollBeyondLastLine: false,
      lineDecorationsWidth: 10,
      hideCursorInOverviewRuler: true,
      overviewRulerBorder: false,
      selectionHighlight: true,
      lineNumbersMinChars: 5,
      padding: { top: 15 },
      lineHeight: 18,
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
    <>
      <div className="p-0 mt-3 mb-3">
        <div
          contentEditable={false}
          className="h-auto p-5 transition-none bg-gray-100 rounded-md shadow-lg min-h-44 bg-gra"
          ref={onMount}
        />
        <span className="text-sm text-gray-400">{children}</span>
      </div>
    </>
  );
};

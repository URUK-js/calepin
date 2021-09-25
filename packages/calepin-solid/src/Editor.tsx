import { createSignal, createMemo } from "solid-js";
import { renderLeaves as renderLeafDefault, renderBlock as renderBlockDefault, renderChildren } from "./components";
import { useHistory, EditorContext, useEditor, useNode } from "./hooks";
import { toJSON, toYJS, EditorProps, onDragOver, onDrop, onBeforeInput, onKeyDown } from "calepin";
import * as Y from "yjs";

export const Editor = ({
  value,
  renderBlock = renderBlockDefault,
  renderLeaf = renderLeafDefault,
  spellcheck = false,
  onChange = () => null,
  renderBefore,
  renderAfter,
  className = "sltye-editor",
  id = "sltye-editor",
  props
}: EditorProps) => {
  let [editorRef, setEditorRef] = createSignal<HTMLDivElement | undefined>();
  const doc = createMemo(() => toYJS(value).getMap("document"));
  const undoManager = useHistory(doc);
  const config = useNode(doc().doc?.getMap("config")!);
  const editor = createMemo(() => ({
    renderBlock,
    renderLeaf,
    undoManager,
    editorRef,
    doc: () => doc().doc!,
    config: () => doc().doc?.getMap("config")!,
    toYJS: doc,
    toUpdate: () => Y.encodeStateAsUpdateV2(doc().doc as Y.Doc),
    toJSON: () => toJSON(doc().doc as Y.Doc)
  }));
  return (
    <EditorContext value={editor()}>
      {renderBefore && renderBefore()}
      <div
        {...props(editor(), config())}
        onDrop={[onDrop, useEditor()]}
        onDragOver={[onDragOver, editor()]}
        onDragStart={[onDragOver, editor()]}
        className={className}
        id={id}
        spellcheck={spellcheck}
        data-calepin-editor
        data-gram={true}
        ref={setEditorRef}
        contentEditable={true}
        //@ts-ignore
        onBeforeInput={[onBeforeInput, [doc, onChange, useEditor()]]}
        onKeyDown={[onKeyDown, undoManager]}
      >
        {renderChildren({ parentAttributes: createMemo(() => ({ ["data-calepin-path"]: [] })), node: doc() })}
      </div>
      {renderAfter && renderAfter()}
    </EditorContext>
  );
};

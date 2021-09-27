import { createSignal, createMemo } from "solid-js";
import { renderLeaves as renderLeafDefault, renderBlock as renderBlockDefault, renderChildren } from "./components";
import { useHistory, EditorContext, useEditor, useNode } from "./hooks";
import { toJSON, toYJS, EditorProps, onDragOver, onDrop, onBeforeInput, onKeyDown } from "edytor";
import * as Y from "yjs";

import { useSelectionListener } from "./hooks/useSelectionListener";
import { Cursor, Editor as EditorType, EdytorSelection } from "edytor/src";

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
  let editorId = createMemo(() =>
    Math.random()
      .toString(36)
      .substring(2, 9)
  );
  let [editorRef, setEditorRef] = createSignal<HTMLDivElement | undefined>();
  let [cursor, setCursor] = createSignal<Cursor>();
  let [selection, setSelection] = createSignal<EdytorSelection | undefined>();

  const doc = createMemo(() => toYJS(value).getMap("document"));
  const undoManager = useHistory(doc);
  const config = useNode(doc().doc?.getMap("config")!);
  const editor = createMemo<EditorType>(() => ({
    editorId: editorId(),
    selection,
    cursor,
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
  useSelectionListener(editor(), setSelection);
  console.log(editor());
  return (
    <EditorContext value={editor()}>
      {renderBefore && renderBefore()}
      <div
        {...props(useEditor(), config())}
        onDrop={[onDrop, useEditor()]}
        onDragOver={[onDragOver, useEditor()]}
        onDragStart={[onDragOver, useEditor()]}
        className={className}
        id={id}
        spellcheck={spellcheck}
        data-edytor-editor={editorId()}
        data-gram={true}
        ref={(container) => {
          setCursor(new Cursor({ container, selection }));
          setEditorRef(container);
        }}
        contentEditable={true}
        //@ts-ignore
        onBeforeInput={[onBeforeInput, [doc, onChange, useEditor()]]}
        onKeyDown={[onKeyDown, undoManager]}
      >
        {renderChildren({ node: doc() })}
      </div>
      {renderAfter && renderAfter()}
    </EditorContext>
  );
};

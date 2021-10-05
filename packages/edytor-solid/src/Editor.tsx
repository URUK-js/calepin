import { createSignal, createMemo, onMount, onCleanup } from "solid-js";
import { renderLeaves as renderLeafDefault, renderBlock as renderBlockDefault, renderChildren } from "./components";
import { useHistory, EditorContext, useEditor, useNode, useSelectionListener, useMap } from "./hooks";
import {
  EditorProps,
  onDragOver,
  onDrop,
  onBeforeInput,
  onKeyDown,
  Cursor,
  Editor as EditorType,
  EdytorDoc,
  EdytorSelection
} from "edytor";
import { Dropper, onMouseMove } from "edytor/src";

export const Editor = ({
  value,
  renderBlock = renderBlockDefault,
  renderLeaf = renderLeafDefault,
  spellcheck = false,
  onChange = () => null,
  renderBefore,
  hotkeys,
  renderAfter,
  className = "sltye-editor",
  id = "sltye-editor",
  props
}: EditorProps) => {
  let editorId = Math.random()
    .toString(36)
    .substring(2, 9);
  let [editorRef, setEditorRef] = createSignal<HTMLDivElement | undefined>();
  let [cursor, setCursor] = createSignal<Cursor>();
  let [selection, setSelection] = createSignal<EdytorSelection | undefined>();

  const doc = new EdytorDoc(value);

  const onChangeObserver = () => {
    // console.log(doc.children.toJSON());
  };
  onMount(() => doc.children.observeDeep(onChangeObserver));
  onCleanup(() => doc.children.unobserveDeep(onChangeObserver));
  const undoManager = useHistory(doc);
  const config = useMap(doc.config);

  const editor = createMemo<EditorType>(() => ({
    editorId,
    dropper: new Dropper(),
    selection,
    cursor,
    hotkeys,
    renderBlock,
    renderLeaf,
    undoManager,
    editorRef,
    doc,
    children: doc.children,
    config: doc.config,
    toUpdate: doc.toUpdate,
    toString: doc.string,
    toJSON: doc.toJSON,
    ID_TO_NODE: new Map(),
    ID_TO_MAP: new WeakMap(),
    MAP_TO_ID: new WeakMap()
  }))();
  useSelectionListener(editor, setSelection);

  return (
    <EditorContext value={editor}>
      {renderBefore && renderBefore()}

      <div
        {...props(useEditor(), config())}
        onDrop={[onDrop, useEditor()]}
        onMouseMove={[onMouseMove, editor]}
        onDragOver={[onDragOver, editor]}
        onDragStart={[onDragOver, editor]}
        className={className}
        id={editor.editorId}
        spellcheck={spellcheck}
        data-edytor-editor={editorId}
        data-gram={true}
        ref={(container) => {
          setCursor(new Cursor({ container, selection }));
          setEditorRef(container);
        }}
        contentEditable={true}
        //@ts-ignore
        onBeforeInput={[onBeforeInput, [doc, onChange, editor]]}
        onKeyDown={[onKeyDown, editor]}
      >
        <div id="dndIndicator" contentEditable={false}></div>
        {renderChildren(doc.children)}
      </div>
      {renderAfter && renderAfter()}
    </EditorContext>
  );
};

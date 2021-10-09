import { createSignal, createMemo, onMount, onCleanup } from "solid-js";
import { renderLeaves as renderLeafDefault, renderBlock as renderBlockDefault, renderChildren } from "./components";
import { useHistory, EditorContext, useEditor, useNode, useMap } from "./hooks";
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
import { Dropper } from "edytor/src";
import { SelectionIndicator } from "./components/SelectionIndicator";

export const Editor = ({
  value,
  renderHandle = () => null,
  renderBlock = renderBlockDefault,
  renderLeaf = renderLeafDefault,
  spellcheck = true,
  onChange = () => null,
  renderBefore,
  hotkeys,
  defaultBlock = "paragraph",
  renderAfter,
  className = "edytor",
  props
}: EditorProps) => {
  let editorId = Math.random()
    .toString(36)
    .substring(2, 9);
  let [editorRef, setEditorRef] = createSignal<HTMLDivElement | undefined>();
  let [cursor, setCursor] = createSignal<Cursor>();
  let [_, setSelection] = createSignal<EdytorSelection | undefined>();

  const doc = new EdytorDoc(value);

  const onChangeObserver = () => {
    // console.log(doc.children.toJSON());
  };
  onMount(() => doc.children.observeDeep(onChangeObserver));
  onCleanup(() => doc.children.unobserveDeep(onChangeObserver));
  const ID_TO_NODE = new Map();
  const selection = new EdytorSelection(ID_TO_NODE, setSelection);
  const config = useMap(doc.config);
  const undoManager = useHistory(doc, selection);
  const editor = createMemo<EditorType>(() => ({
    editorId,
    defaultBlock,
    dropper: new Dropper(doc, editorId, ID_TO_NODE, selection),
    selection,
    cursor,
    hotkeys,
    renderHandle,
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
    ID_TO_NODE,
    ID_TO_MAP: new WeakMap(),
    MAP_TO_ID: new WeakMap()
  }))();

  return (
    <EditorContext value={editor}>
      {renderBefore && renderBefore()}
      <div
        {...props(useEditor(), config())}
        className={className}
        id={editorId}
        spellcheck={spellcheck}
        data-edytor={editorId}
        data-gram={true}
        ref={(container) => {
          selection.init(container);
          setCursor(new Cursor({ container, selection }));
          setEditorRef(container);
        }}
        // onMouseMove={[onMouseMove, editor]}
        onDrop={[onDrop, useEditor()]}
        onDragOver={[onDragOver, editor]}
        onDragStart={[onDragOver, editor]}
        onBeforeInput={[onBeforeInput, [doc, onChange, editor]]}
        onKeyDown={[onKeyDown, editor]}
        contentEditable={true}
      >
        <div id="dndIndicator" className="bg-yellow-400 bg-opacity-75 shadow-lg z-30" contentEditable={false} />
        <SelectionIndicator />

        {renderChildren(doc.children)}
      </div>
      {renderAfter && renderAfter()}
    </EditorContext>
  );
};

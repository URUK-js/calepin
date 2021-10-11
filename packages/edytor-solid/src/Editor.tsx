import { createMemo, onMount as onMountSolid, onCleanup } from "solid-js";
import { renderChildren } from "./components";
import { useHistory, EditorContext, useEditor, useNode, useMap } from "./hooks";
import {
  EditorProps,
  onDragOver,
  onDrop,
  onBeforeInput,
  onKeyDown,
  Editor as EditorType,
  EdytorDoc,
  EdytorSelection
} from "edytor";
import { Dropper, nanoid } from "edytor/src";

export const Editor = ({
  initialValue,
  renderInner,
  renderHandle = () => null,
  blocks,
  leaves,
  spellcheck = true,
  onChange = () => null,
  onMount = () => null,
  renderBefore,
  hotkeys,
  defaultBlock = "paragraph",
  renderAfter,
  className = "edytor",
  allowNesting = true,
  readOnly = false,
  props
}: EditorProps) => {
  let editorId = nanoid();
  let editorRef = undefined as HTMLDivElement | undefined;

  const doc = new EdytorDoc(initialValue.json);
  const onChangeObserver = () => {
    // console.log(doc.children.toJSON());
  };
  onMountSolid(() => doc.children.observeDeep(onChangeObserver));
  onCleanup(() => doc.children.unobserveDeep(onChangeObserver));

  const selection = new EdytorSelection();
  const dropper = new Dropper();

  const undoManager = useHistory(doc, selection);
  const editor = createMemo<EditorType>(() => ({
    editorId,
    readOnly,
    allowNesting,
    defaultBlock,
    dropper,
    selection,
    blocks,
    leaves,
    hotkeys,
    renderHandle,
    undoManager,
    editorRef,
    doc,
    children: doc.children,
    toString: doc.string,
    toJSON: doc.toJSON,
    ID_TO_NODE: new Map()
  }))();

  return (
    <EditorContext value={editor}>
      {renderBefore && renderBefore()}
      <div
        {...props}
        className={className}
        id={editorId}
        spellcheck={spellcheck}
        data-edytor={editorId}
        data-gram={true}
        ref={(container) => {
          editorRef = container;
          selection.init(editor, container);
          dropper.init(editor, container);
          onMount(editor);
        }}
        // onMouseMove={[onMouseMove, editor]}
        onDrop={[onDrop, useEditor()]}
        onDragOver={[onDragOver, editor]}
        onDragStart={[onDragOver, editor]}
        onBeforeInput={[onBeforeInput, [doc, onChange, editor]]}
        onKeyDown={[onKeyDown, editor]}
        contentEditable={!readOnly}
      >
        {renderInner && renderInner()}
        <div id="dndIndicator" className="bg-yellow-400 bg-opacity-75 shadow-lg z-30" contentEditable={false} />
        {renderChildren(doc.children, "node")}
      </div>
      {renderAfter && renderAfter()}
    </EditorContext>
  );
};

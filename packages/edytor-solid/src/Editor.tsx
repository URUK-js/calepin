import { createMemo, onMount as onMountSolid, onCleanup } from "solid-js";
import { renderChildren, defaultLeaves, defaultBlocks } from "./components";
import { useHistory, EditorContext, useEditor } from "./hooks";
import {
  EditorProps,
  onDragOver,
  onDrop,
  onBeforeInput,
  onKeyDown,
  Editor as EditorType,
  EdytorDoc,
  EdytorSelection,
  defaultHotkeys
  // createWSProvider
} from "edytor";
import { Dropper, nanoid } from "edytor/src";
import { useYjsContext } from "./contexts/yjsContext";

export const Editor = ({
  renderInner,
  renderHandle = () => null,
  leaves = defaultLeaves,
  blocks = defaultBlocks,
  spellcheck = true,
  onChange = () => null,
  onMount = () => null,
  renderBefore,
  hotkeys = defaultHotkeys,
  defaultBlock = "paragraph",
  renderAfter,
  className = "edytor",
  allowNesting = true,
  readOnly = false,
  props
}: EditorProps) => {
  let editorId = nanoid();
  let editorRef = undefined as HTMLDivElement | undefined;

  const { doc, children, awareness, provider } = useYjsContext();

  const onChangeObserver = () => {
    // console.log(children.toJSON());
  };
  onMountSolid(() => children.observeDeep(onChangeObserver));
  onCleanup(() => children.unobserveDeep(onChangeObserver));

  const selection = new EdytorSelection();
  const dropper = new Dropper();

  const undoManager = useHistory(children, selection);
  const editor = {
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
    children,
    // toString: doc.string,
    toJSON: children.toJSON,
    ID_TO_NODE: new Map()
  };

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
        {renderChildren(children, "root")}
      </div>
      {renderAfter && renderAfter()}
    </EditorContext>
  );
};

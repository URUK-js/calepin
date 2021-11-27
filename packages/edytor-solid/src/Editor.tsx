import { onMount as onMountSolid, onCleanup } from "solid-js";
import { renderChildren, defaultLeaves, defaultBlocks } from "./components";
import { useHistory, EditorContext } from "./hooks";
import {
  EditorProps,
  onDragOver,
  onDrop,
  onBeforeInput,
  onKeyDown,
  EdytorSelection,
  defaultHotkeys
  // createWSProvider
} from "edytor";
import { Dropper, nanoid, toString } from "edytor/src";
import { useYjsContext } from "./contexts/yjsContext";

export const Editor = ({
  documentId = nanoid(),
  user = { id: nanoid(), name: nanoid() },
  renderHandle = () => null,
  renderDndIndicator,
  leaves = defaultLeaves,
  blocks = defaultBlocks,
  voids,
  spellcheck = true,
  onChange = () => null,
  collaboration,
  Inner,
  Before,
  After,
  onMount = () => null,
  hotkeys = defaultHotkeys,
  defaultBlock = "paragraph",
  className = "edytor",
  allowNesting = true,
  readOnly = false,
  accept,
  props,
  onFileDrop
}: EditorProps) => {
  let editorRef = undefined as HTMLDivElement | undefined;

  const { doc, children, awareness, provider } = useYjsContext();

  const onChangeObserver = () => {
    console.log(editor.toString());
  };
  onMountSolid(() => children.observeDeep(onChangeObserver));

  onCleanup(() => {
    children.unobserveDeep(onChangeObserver);
    if (provider) provider.disconnect();
  });

  const selection = new EdytorSelection();
  const dropper = new Dropper();
  awareness?.setLocalStateField("user", {
    ...user
  });
  const undoManager = useHistory(children, selection);
  const editor = {
    documentId,
    user,
    readOnly,
    collaboration,
    voids,
    awareness,
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
    onFileDrop,
    acceptedFileTypes: accept,
    toString: (separator?: string) => toString(children, separator),
    // toString: doc.string,
    toJSON: children.toJSON,
    ID_TO_NODE: new Map()
  };

  return (
    <EditorContext value={editor}>
      {Before && <Before editor={editor} />}
      <div
        {...props}
        className={className}
        id={documentId}
        spellcheck={spellcheck}
        data-edytor={documentId}
        data-gram={true}
        ref={(container) => {
          editorRef = container;
          selection.init(editor, container);
          renderDndIndicator && dropper.init(editor, container);
          onMount(editor);
        }}
        // onMouseMove={[onMouseMove, editor]}
        onDrop={[onDrop, editor]}
        onDragOver={[onDragOver, editor]}
        onBeforeInput={[onBeforeInput, [doc, onChange, editor]]}
        onKeyDown={[onKeyDown, editor]}
        contentEditable={!readOnly}
      >
        {Inner && <Inner editor={editor} />}
        {renderDndIndicator && renderDndIndicator({ id: "dndIndicator", contentEditable: false })}
        {renderChildren(children, "root")}
      </div>
      {After && <After editor={editor} />}
    </EditorContext>
  );
};

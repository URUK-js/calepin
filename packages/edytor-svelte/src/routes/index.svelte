<script>
	import {
		nanoid,
		onDrop,
		onDragOver,
		onBeforeInput,
		onKeyDown,
		EdytorSelection,
		Dropper,
		defaultHotkeys
	} from 'edytor';
	import { DocFromJson } from 'edytor/src';
	import { Doc } from 'yjs';
	export let props = {};
	export let dnd = {};
	export let collaboration = {};
	export let voids = {};
	export let className = '';
	export let editorId = nanoid();
	export let spellcheck = false;
	export let readOnly = false;
	export let allowNesting = false;
	export let defaultBlock = 'paragraph';
	export let leaves = {};
	export let blocks = {};
	export let onMount = () => null;
	export let renderHandle = () => null;
	const doc = DocFromJson([{ type: 'paragraph', content: [{ text: 'eazeza' }], children: [] }]);
	const children = doc.getArray('children');
	const selection = new EdytorSelection();
	const dropper = new Dropper();
	const editor = {
		editorId,
		dnd,
		readOnly,
		collaboration,
		voids,
		awareness: undefined,
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
</script>

<div class="shadow-xl max-w-2xl mx-auto rounded-md p-10 mt-10">
	<div
		{...props}
		class={className}
		id={editorId}
		{spellcheck}
		data-edytor={editorId}
		data-gram={true}
		ref={(container) => {
			//   editorRef = container;
			//   selection.init(editor, container);
			//   dropper.init(editor, container);
			onMount(editor);
		}}
		on:dragOver={[onDragOver, editor]}
		on:dragStart={[onDragOver, editor]}
		on:beforeInput={[onBeforeInput, [doc, onChange, editor]]}
		on:keyDown={[onKeyDown, editor]}
		contentEditable={!readOnly}
	>
		<!-- on:drop={[onDrop, editor]} -->
		eaze
	</div>
</div>

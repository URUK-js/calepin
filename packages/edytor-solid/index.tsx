import { EditorProps } from "edytor/src";
import { YjsContextWrapper } from "./src/contexts/yjsContext";
export * from "./src";
import { Editor } from ".";
const WrappedEditor = (props: EditorProps) => {
  return (
    <YjsContextWrapper
      documentId={props.documentId}
      collaborativeServerEndpoint={props.collaborativeServerEndpoint}
      initialValue={props.initialValue}
      renderChildren={() => <Editor {...props} />}
    />
  );
};

export default WrappedEditor;

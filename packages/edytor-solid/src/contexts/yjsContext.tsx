import { createContext, Show, createSignal, onMount, useContext } from "solid-js";
import * as awarenessProtocol from "y-protocols/awareness";
import { WebsocketProvider } from "y-websocket";
import { createWSProvider, DocFromJson, EditorProps, YNode, YArray, Doc } from "edytor";

const YjsContext = createContext<YjsContextType | undefined>();
type YjsContextType = {
  doc: Doc;
  children: YArray<YNode>;
  provider: WebsocketProvider | undefined;
  awareness: awarenessProtocol.Awareness | undefined;
};

interface YjsContextWrapperProps extends Pick<EditorProps, "initialValue"> {
  renderChildren: () => any;
  documentId?: string;
  collaborativeServerEndpoint?: string;
}
export const useYjsContext = (): YjsContextType => {
  return useContext(YjsContext) as YjsContextType;
};
export const YjsContextWrapper = ({
  initialValue,
  renderChildren,
  documentId,
  collaborativeServerEndpoint
}: YjsContextWrapperProps) => {
  const [contextValue, setContextValue] = createSignal<YjsContextType>();
  onMount(() => {
    let doc, children;
    if (!collaborativeServerEndpoint || !documentId) {
      if (initialValue instanceof YArray) {
        children = initialValue;
        doc = children.doc as Doc;
      } else {
        doc = DocFromJson(initialValue);
        children = doc.getArray("children");
      }
      setContextValue({ doc, children, provider: undefined, awareness: undefined });
    } else {
      createWSProvider(documentId, collaborativeServerEndpoint).then((provider) => {
        setContextValue({
          doc: provider.doc,
          children: provider.doc.getArray("children"),
          provider,
          awareness: provider.awareness
        });
      });
    }
  });

  return (
    <Show when={contextValue()} fallback={<div>Loading...</div>}>
      {(value) => <YjsContext.Provider value={value}>{renderChildren()}</YjsContext.Provider>}
    </Show>
  );
};

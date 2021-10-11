import { Component } from "solid-js";
import Editor from "edytor-solid";
import "@fontsource/noto-sans-hk";
import "@fontsource/space-mono";
import "@fontsource/playfair-display";
import StyleSelector from "./Editor/StyleSelector/Menu";
import { initialValue } from "./Editor/initialValue";
import "./Editor/editor.css";
import { renderHandle } from "./Handle";
import { SelectionIndicator } from "./Editor/SelectionIndicator";

const Paragraph = ({ children }) => {
  return <p>{children}</p>;
};
const Blockquote = ({ children }) => {
  return <blockquote>{children}</blockquote>;
};
const Heading = ({ children }) => {
  return <h1>{children}</h1>;
};
const Strike = ({ children }) => {
  return <span style={{ "text-decoration": "line-through" }}>{children}</span>;
};
const App: Component = () => {
  return (
    <div>
      <Editor
        initialValue={{
          json: initialValue()
        }}
        leaves={{
          bold: "strong",
          italic: "i",
          underline: "u",
          code: "code",
          strikethrough: Strike,
          highlight: "mark"
        }}
        blocks={{
          paragraph: Paragraph,
          blockquote: Blockquote,
          heading: Heading
        }}
        spellcheck={false}
        readOnly={false}
        defaultBlock="paragraph"
        renderHandle={renderHandle}
        hotkeys={[
          { operation: "formatText", keys: "mod+b", mark: { bold: true } },
          { operation: "formatText", keys: "mod+i", mark: { italic: true } },
          { operation: "formatText", keys: "mod+u", mark: { underline: true } },
          { operation: "formatText", keys: "mod+shift+c", mark: { code: true } },
          { operation: "formatText", keys: "mod+shift+x", mark: { strikethrough: true } },
          { operation: "formatText", keys: "mod+shift+h", mark: { highlight: true } }
        ]}
        props={{ "data-font": "sans", "data-full-width": false, "data-small-text": true }}
        renderInner={() => {
          return (
            <>
              <SelectionIndicator />
            </>
          );
        }}
        renderBefore={() => {
          return (
            <>
              <StyleSelector />
            </>
          );
        }}
      />
    </div>
  );
};

export default App;

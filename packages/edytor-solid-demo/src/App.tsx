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
        spellcheck={false}
        readOnly={false}
        defaultBlock="paragraph"
        renderHandle={renderHandle}
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

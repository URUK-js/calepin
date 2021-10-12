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
import { Cursors } from "./Cursors";
const App: Component = () => {
  return (
    <div>
      <Editor
        initialValue={{
          json: initialValue()
        }}
        dnd={{
          active: true,
          renderIndicator: () => (
            <div id="dndIndicator" className="bg-yellow-400 bg-opacity-75 shadow-lg z-30" contentEditable={false} />
          )
        }}
        collaboration={{
          user: { name: "" }
        }}
        spellcheck={false}
        renderHandle={renderHandle}
        props={{ "data-font": "sans", "data-full-width": false, "data-small-text": true }}
        renderInner={() => {
          return (
            <>
              <SelectionIndicator />
              <Cursors />
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

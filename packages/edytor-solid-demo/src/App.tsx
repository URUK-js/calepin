import { Component } from "solid-js";
import { Editor } from "edytor-solid";
import "@fontsource/noto-sans-hk";
import "@fontsource/space-mono";
import "@fontsource/playfair-display";
import StyleSelector from "./Editor/StyleSelector/Menu";
import { initialValue } from "./Editor/initialValue";
import "./Editor/editor.css";
const App: Component = () => {
  return (
    <div>
      <Editor
        value={initialValue()}
        props={(editor, config) => ({
          "data-font": config.font || "sans",
          "data-full-width": !!config.fullWidth,
          "data-small-text": !!config.smallText
        })}
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

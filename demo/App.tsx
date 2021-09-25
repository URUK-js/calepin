import { Component, createMemo } from "solid-js";
import Editor from "./Editor/Editor";
import "@fontsource/noto-sans-hk";
import "@fontsource/space-mono";
import "@fontsource/playfair-display";
import StyleSelector from "./Editor/StyleSelector/Menu";

const App: Component = () => {
  return (
    <div>
      <Editor
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

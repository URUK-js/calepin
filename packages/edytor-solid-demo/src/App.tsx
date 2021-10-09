import { Component } from "solid-js";
import { Editor } from "edytor-solid";
import "@fontsource/noto-sans-hk";
import "@fontsource/space-mono";
import "@fontsource/playfair-display";
import StyleSelector from "./Editor/StyleSelector/Menu";
import { initialValue } from "./Editor/initialValue";
import "./Editor/editor.css";
import { renderHandle } from "./Handle";
const App: Component = () => {
  return (
    <div>
      <Editor
        defaultBlock="blockquote"
        renderHandle={renderHandle}
        hotkeys={[
          { operation: "formatText", keys: "mod+b", mark: { bold: true } },
          { operation: "formatText", keys: "mod+i", mark: { italic: true } },
          { operation: "formatText", keys: "mod+u", mark: { underline: true } },
          { operation: "formatText", keys: "mod+shift+c", mark: { code: true } },
          { operation: "formatText", keys: "mod+shift+x", mark: { strikethrough: true } },
          { operation: "formatText", keys: "mod+shift+h", mark: { highlight: true } }
        ]}
        value={initialValue()}
        props={(_, config) => ({
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

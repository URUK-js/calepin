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
        renderHandle={renderHandle}
        hotkeys={[
          { operation: "formatText", keys: "mod+b", data: { format: "bold" } },
          { operation: "formatText", keys: "mod+i", data: { format: "italic" } },
          { operation: "formatText", keys: "mod+u", data: { format: "underline" } },
          { operation: "formatText", keys: "mod+shift+c", data: { format: "code" } },
          { operation: "formatText", keys: "mod+shift+x", data: { format: "strikethrough" } },
          { operation: "formatText", keys: "mod+shift+h", data: { format: "highlight", color: "purple" } }
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

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
import { nanoid } from "edytor/src";

const App: Component = () => {
  return (
    <div>
      <Editor
        documentId="edytor"
        initialValue={initialValue()}
        user={{ name: "John Casey", id: nanoid(), color: "#42b883" }}
        renderDndIndicator={(props) => <div className="z-30 bg-yellow-400 bg-opacity-75 shadow-lg h-44" {...props} />}
        spellcheck={false}
        // collaborativeServerEndpoint={ process.env.NODE_ENV === "production" ? "wss://edytor-production.up.railway.app" : "ws://localhost:1234"}
        renderHandle={renderHandle}
        className="max-w-6xl pb-40 mx-auto"
        Inner={() => {
          return (
            <>
              <SelectionIndicator />
              <Cursors />
            </>
          );
        }}
        accept={["image/jpg", "image/jpeg", "image/png"]}
        Before={() => {
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

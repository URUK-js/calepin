import { createMemo, createSignal } from "solid-js";
import { useEditor, useMap } from "edytor-solid";
import Toggle from "./Toggle";
import { HooverMenu } from "../HooverMenu";
import { leafString } from "edytor/src";
const Menu = ({}) => {
  const [open, setOpen] = createSignal<boolean>(false);
  const editor = useEditor();
  const config = useMap(editor.doc.getMap("config"));

  const count = createMemo(() => {
    let blocks = 0;
    let leafs = 0;
    let characters = 0;

    editor.doc.traverse((node, isText) => {
      if (isText) {
        characters += leafString(node);
        leafs++;
      } else {
        blocks++;
      }
    });
    return { blocks, leafs, characters };
  });

  let ref;
  return (
    <>
      <HooverMenu />
      <div className="flex w-full z-10 sticky top-0 left-0 h-8 bg-white  justify-end px-10 items-center">
        <div className=" mx-10">
          {count().blocks}-{count().leafs}-{count().characters.length}
        </div>

        <button
          onClick={() => {
            if (!open()) {
              ref.style.display = "grid";
            }
            setTimeout(() => {
              setOpen((open) => !open);
            }, 100);
          }}
          className="p-1 h-full hover:bg-gray-100 "
        >
          <Icon className="text-black w-5 h-5 " />
        </button>
        <div
          onTransitionEnd={(e) => {
            if (!open()) {
              e.target.style.display = "none";
            }
          }}
          ref={(r) => {
            r.style.display = "none";
            ref = r;
          }}
          className={` w-56 z-10 grid bg-white origin-top-right  shadow fixed right-2 top-12 items-center ${
            open() ? " scale-100 opacity-100" : "scale-90 opacity-0"
          } transition-all  `}
        >
          <div className=" grid gap-2 grid-cols-3 p-2">
            {["Sans", "Serif", "Mono"].map((font) => {
              const isActive = createMemo(() => (config().font || "sans") === font.toLowerCase());
              return (
                <div
                  onClick={() => {
                    editor.config.set("font", font.toLowerCase());
                  }}
                  className={`hover:bg-gray-100 rounded-sm justify-center rounded-sm p-2 grid h-20 cursor-pointer items-center`}
                >
                  <div
                    className={`${font === "Sans" ? "font-sans" : font === "Serif" ? "font-serif" : "font-mono"} ${
                      isActive() ? "text-yellow-400" : ""
                    } text-xl text-center`}
                  >
                    Ag
                  </div>
                  <div className=" text-gray-400 text-sm  ">{font}</div>
                </div>
              );
            })}
          </div>
          <hr className="my-1 bg-gray-100 text-gray-200" />
          <Toggle
            onChange={(value) => {
              editor.config?.set("fullWidth", value);
            }}
            label={"Full width"}
            value={createMemo(() => !!config().fullWidth)}
          />
          <Toggle
            onChange={(value) => {
              editor.config?.set("smallText", value);
            }}
            label={"Small text"}
            value={createMemo(() => !!config().smallText)}
          />
          <Toggle
            onChange={(value) => {
              editor.config?.set("showCover", value);
            }}
            label={"Show cover"}
            value={createMemo(() => !!config().showCover)}
          />
        </div>
      </div>
      <img
        className={` w-full object-cover ${config().showCover ? "h-72 opacity-100" : "h-0 opacity-0"} transition-all  `}
        src="https://images.unsplash.com/photo-1587262538177-842ad13e290c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80"
        alt=""
      />
    </>
  );
};

export default Menu;

const Icon = ({ className }: { className: string }) => {
  return (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <g strokeLinecap="round" stroke="currentColor" fill="none" strokeLinejoin="round">
        <path d="M21.5 5.5v13M5.5 2.5h13M2.5 18.5v-13M18.5 21.5h-13M1 3.498a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5zM21 3.498a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5zM1 23.498a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5zM21 23.498a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5zM7 8.5V7h0a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 .5.5s0 0 0 0v1.5M12 6.5v12M10.5 18.5h3" />
      </g>
    </svg>
  );
};

import { createMemo, createSignal } from "solid-js";
import { useEditor, useNode } from "calepin-solid";
import { traverseDocument } from "calepin";
import Toggle from "./Toggle";
const Menu = ({}) => {
  const [open, setOpen] = createSignal<boolean>(false);
  const editor = useEditor();
  const configMap = editor.toYJS().doc?.getMap("config");
  const config = useNode(configMap!);

  const count = createMemo(() => {
    let blocks = 0;
    let leafs = 0;
    let characters = 0;

    traverseDocument(editor, (isText, node) => {
      if (isText) {
        leafs++;
        characters += node.toString().length;
      } else {
        blocks++;
      }
    });
    return { blocks, leafs, characters };
  });

  console.log(config());
  let ref;
  return (
    <>
      <div className="flex w-full z-10 sticky top-0 left-0 h-10 bg-gray-50 shadow-sm justify-end px-10 items-center">
        <div className=" mx-10">
          {count().blocks}-{count().leafs}-{count().characters}
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
          className="p-2 hover:bg-gray-100 "
        >
          <Icon className="text-black w-5 h-5 " />
        </button>
        <div
          onTransitionEnd={(e) => {
            if (!open()) {
              e.target.style.display = "none";
            }
          }}
          ref={ref}
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
                    const config = editor.config();
                    config.set("font", font.toLowerCase());
                  }}
                  className={`justify-center rounded-sm p-2 grid h-20 cursor-pointer items-center`}
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
              configMap?.set("fullWidth", value);
            }}
            label={"Full width"}
            value={createMemo(() => !!config().fullWidth)}
          />
          <Toggle
            onChange={(value) => {
              configMap?.set("smallText", value);
            }}
            label={"Small text"}
            value={createMemo(() => !!config().smallText)}
          />
        </div>
      </div>
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

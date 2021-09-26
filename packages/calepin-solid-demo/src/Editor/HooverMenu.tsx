import { useEditor, useSelectionChange } from "../../../calepin-solid/src";
import {
  TextBolder,
  TextItalic,
  TextUnderline,
  TextStrikethrough,
  CodeSimple,
  HighlighterCircle
} from "phosphor-solid";
import { formatText } from "calepin/src";

const iconsProps = {};
export const HooverMenu = ({}) => {
  let ref = undefined as undefined | HTMLDivElement;
  const editor = useEditor();
  const selection = useSelectionChange((s) => {
    const { boundingRect } = s.domRange;

    if (!ref) return;
    if (!boundingRect) {
      ref.style.transform = `scale(0)`;
      ref.style.opacity = "0";
    } else {
      console.log(s);
      ref.style.opacity = "1";
      ref.style.transform = `scale(1)`;
      ref.style.top = `${boundingRect.top + window.pageYOffset - ref.offsetHeight - 5}px`;
      ref.style.left = `${boundingRect.left + window.pageXOffset - ref.offsetWidth / 2 + boundingRect.width / 2}px`;
      ref.style.transition = `opacity 0.4s, transform 0s ease-in-out`;
    }
  });

  const icons = [
    {
      Icon: TextBolder,
      format: "bold"
    },
    { Icon: TextUnderline, format: "underline" },
    { Icon: TextItalic, format: "italic" },
    { Icon: TextStrikethrough, format: "strikethrough" },
    { Icon: CodeSimple, format: "code" },
    { Icon: HighlighterCircle, format: "code" }
  ];

  return (
    <>
      <div className="shadow-lg fixed bg-white z-10 overflow-hidden rounded-md h-8  transition-all" ref={ref}>
        {icons.map(({ Icon, format }) => {
          return (
            <button
              onClick={() => {
                formatText(editor, { range: selection(), format });
              }}
              className="p-1 h-full hover:bg-gray-100 "
            >
              <Icon weight="bold" />
            </button>
          );
        })}
      </div>
    </>
  );
};

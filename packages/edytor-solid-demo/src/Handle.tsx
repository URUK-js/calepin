import { DotsNine } from "phosphor-solid";
import { useEditor } from "../../edytor-solid/src";
export const renderHandle = ({ node, attributes }) => {
  const editor = useEditor();
  return (
    <>
      <div className={` z-10  absolute top-0  select-none`} style={{ left: "-40px" }} {...attributes}>
        <DotsNine weight="bold" />
      </div>
    </>
  );
};

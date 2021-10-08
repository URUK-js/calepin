import { DotsNine } from "phosphor-solid";
import { useEditor } from "../../edytor-solid/src";
export const renderHandle = ({ node, attributes }) => {
  const editor = useEditor();
  return (
    <>
      <div className={` z-10  select-none`} {...attributes}>
        <DotsNine weight="bold" />
      </div>
    </>
  );
};

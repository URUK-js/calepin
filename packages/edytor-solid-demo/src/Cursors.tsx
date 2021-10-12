import { useEditor, useSelectionChange } from "edytor-solid/src";
import { onMount, onCleanup, createSignal, mapArray } from "solid-js";

export const Cursors = () => {
  const [usersGroups, setUserGroups] = createSignal([]);
  const editor = useEditor();
  const onUpdate = () => {
    const groups = Array.from(editor.awareness.getStates().values()).reduce((acc, { user, position }) => {
      if (!position || user.id === editor.collaboration.user.id) return acc;
      if (!acc[position.node]) {
        acc[position.node] = [{ user, position }];
      } else {
        acc[position.node].push({ user, position });
      }
      return acc;
    }, {});
    console.log({ groups });
    setUserGroups(Object.values(groups));
  };
  onMount(() => {
    editor.awareness?.on("update", onUpdate);
  });
  onCleanup(() => {
    editor.awareness?.off("update", onUpdate);
  });

  return mapArray(usersGroups, (group) => {
    return <CursorGroup group={group} />;
  });
};

const CursorGroup = ({ group }) => {
  const [{ position, user }] = group;

  const rect = document.getElementById(position.node)?.getBoundingClientRect();
  if (!rect) return null;
  return group.map(({ user }, i) => {
    return (
      <img
        style={{ top: rect?.top - 15 + "px", left: rect?.left - 20 + i * 20 + "px" }}
        className=" w-8 z-10 select-none pointer-events-none transition-all bg-white p-1 shadow-sm rounded-full absolute  object-cover "
        src={`https://avatars.dicebear.com/api/bottts/${user.id}.svg`}
        alt=""
      />
    );
  });
};

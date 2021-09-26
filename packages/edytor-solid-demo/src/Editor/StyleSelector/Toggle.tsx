import { Accessor, createSignal } from "solid-js";

type toggleProps = {
  label: string;
  value: Accessor<boolean>;
  onChange: (value: boolean) => void;
};
const Toggle = ({ label, value, onChange }: toggleProps) => {
  return (
    <>
      <div
        className="w-full px-2 py-2 flex justify-between items-center  cursor-pointer hover:bg-gray-100"
        onClick={() => onChange(!value())}
      >
        <div className="text-xs text-gray-500">{label}</div>
        <div className="relative ml-5 bg-gray-200 h-6 flex items-center justify-start rounded-xl  w-12">
          <div
            style={{ left: !value() ? "calc(0% + 2px)" : "calc(100% - 2px - 20px)" }}
            // style={{ transform: isActive() ? "translateX(calc(0% + 2px))" : "translateX(calc(100% - 2px))" }}
            className={`${
              value() ? " bg-yellow-400" : "bg-white"
            } shadow-sm absolute rounded-full h-5 w-5 transition-all`}
          ></div>
        </div>
      </div>
    </>
  );
};

export default Toggle;

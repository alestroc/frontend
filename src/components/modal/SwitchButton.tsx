import CachedIcon from "@mui/icons-material/Cached";

type SwitchButtonProps = {
  setIsSingleDayMode: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function SwitchButton({
  setIsSingleDayMode,
}: SwitchButtonProps) {
  return (
    <div className="flex">
      <button
        type="button"
        onClick={() => setIsSingleDayMode((prev: boolean) => !prev)}
        className=" flex justify-center self-center w-15 h-10 rounded-md border border-slate-300  text-sm font-medium text-white hover:bg-slate-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      >
        <CachedIcon fontSize={"large"} />
      </button>
    </div>
  );
}

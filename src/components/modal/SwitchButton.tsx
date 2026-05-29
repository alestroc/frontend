type SwitchButtonProps = {
  setIsSingleDayMode: React.Dispatch<React.SetStateAction<boolean>>;
  isSingleDayMode: boolean;
};

export default function SwitchButton({
  setIsSingleDayMode,
  isSingleDayMode,
}: SwitchButtonProps) {
  return (
    <div className="flex">
      <button
        type="button"
        onClick={() => setIsSingleDayMode((prev) => !prev)}
        className=" flex justify-center  self-center px-4 py-2 rounded-md border bg-surface-strong border-divider  text-sm font-medium text-primary hover:bg-surface-raised transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
      >
        {isSingleDayMode ? "Inserimento Multiplo" : "Inserimento Singolo"}
      </button>
    </div>
  );
}

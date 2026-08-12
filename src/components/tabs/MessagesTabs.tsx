import Image from "next/image";

type ViewMode = "inbox" | "compose";

type Props = {
  mode: ViewMode;
  setMode: (mode: ViewMode) => void;
};

export default function MessagesTabs({ mode, setMode }: Props) {
  return (
    <div className="py-3 flex items-center justify-center gap-2 border-b-2">
      <div className="relative flex items-center flex-row-reverse hover:scale-105 ">
        <TabButton
          active={mode === "inbox"}
          onClick={() => setMode("inbox")}
          className="pr-5 mr-5"
          label="Inbox"
        />
        <span className="absolute rounded-full bg-white">
          <Image src={"/tabs/mail.svg"} alt="mail" width={36} height={36} />
        </span>
      </div>
      <div className="relative flex items-center hover:scale-105 ">
        <span className="absolute">
          <Image
            src={"/tabs/at_pet.svg"}
            alt="at_play"
            width={41}
            height={41}
          />
        </span>
        <TabButton
          active={mode === "compose"}
          onClick={() => setMode("compose")}
          label="Compose"
          className="pl-5 ml-5"
        />
      </div>
    </div>
  );
}

function TabButton({
  active,
  label,
  className,
  onClick,
}: {
  active: boolean;
  label: string;
  className: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-[25px] flex items-center rounded-[15px] px-2 border hover:bg-primary ${className} ${
        active ? "bg-primary text-black" : "bg-white text-black"
      }`}
    >
      {label}
    </button>
  );
}

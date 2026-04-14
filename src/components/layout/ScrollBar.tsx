import Image from "next/image";
import up_button from "@/public/buttons/Up.svg";
import down_button from "@/public/buttons/Down.svg";
import ShelterLinks from "../template/ShelterLink";
import BackButton from "../ui/BackButton";

type Props = {
  onNext: () => void;
  onPrev: () => void;
  hasNext: boolean;
  hasPrev: boolean;
  isShelter?: boolean;
  isAdmin?: boolean;

  onOpenCreation?: () => void;
  onCloseCreation?: () => void;
  isCreationOpen?: boolean;
};

export default function ScrollBar({
  onNext,
  onPrev,
  hasNext,
  hasPrev,
  isShelter,
  isAdmin,
  onOpenCreation,
  onCloseCreation,
  isCreationOpen,
}: Props) {
  return (
    <div className="flex h-svh flex-col items-center justify-between py-6">
      {/* TOP */}
      <div className="flex flex-col items-center gap-2">
        {isShelter || isAdmin ? (
          isCreationOpen ? (
            <BackButton
              onClick={onCloseCreation}
              className="hover:scale-105 flex h-15 w-15 items-center justify-center rounded-full bg-primary shadow-sm transition hover:brightness-95"
            />
          ) : (
            onOpenCreation && (
              <ShelterLinks onOpenCreation={onOpenCreation} isAdmin={isAdmin} />
            )
          )
        ) : null}
      </div>

      {/* CENTER */}
      <div className="flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={onPrev}
          className={`h-20 w-20 hover:scale-105 ${
            hasPrev ? "" : "pointer-events-none opacity-50"
          }`}
        >
          <Image src={up_button} alt="up-button" />
        </button>

        <button
          type="button"
          onClick={onNext}
          className={`h-20 w-20 hover:scale-105 ${
            hasNext ? "" : "pointer-events-none opacity-50"
          }`}
        >
          <Image src={down_button} alt="down-button" />
        </button>
      </div>

      {/* BOTTOM */}
      <div className={isShelter ? "h-30" : "h-0"} />
    </div>
  );
}

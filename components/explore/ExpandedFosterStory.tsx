"use client";

import { useMemo, useState } from "react";
import { ExplorePet } from "@/components/explore/types";

type ExpandedFosterStoryProps = {
  item: ExplorePet;
  onClose: () => void;
};

const pickDisplayPhoto = (item: ExplorePet) => {
  const photoUrls = item.pet_media
    .filter((media) => media.type === "photo" && Boolean(media.url))
    .map((media) => media.url);

  if (photoUrls.length === 0) {
    return undefined;
  }

  const randomIndex = crypto.getRandomValues(new Uint32Array(1))[0] % photoUrls.length;
  const index = randomIndex;
  return photoUrls[index];
};

export default function ExpandedFosterStory({
  item,
  onClose,
}: ExpandedFosterStoryProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const randomPhoto = useMemo(() => pickDisplayPhoto(item), [item]);

  const storyCaption = item.pet_media.find((media) => media.caption?.trim())
    ?.caption;
  const fullCaption =
    storyCaption && storyCaption.trim().length > 0
      ? storyCaption.trim()
      : "This pet is currently featured in Foster's story. Tap more info to see full details once a longer story is available.";

  const petName = item.name ?? "Unnamed";
  const breed = item.shelter?.shelter_name ?? "Ilonggo Puspins";
  const title = '"Miracle Cancer Survivor"';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-2xl rounded-2xl border-2 border-[#f3be0f] bg-[#fff9ed] overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-gray-600 hover:text-gray-800"
          aria-label="Close"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-[300px] bg-[#f3be0f] p-4 relative">
            {randomPhoto ? (
              <img
                className="w-full h-[250px] rounded-lg object-cover"
                alt={`${petName} - ${breed}`}
                src={randomPhoto}
              />
            ) : (
              <div className="w-full h-[250px] rounded-lg bg-white" />
            )}

            <div className="mt-3 w-full h-[30px] relative">
              <div className="absolute inset-0 bg-white rounded-[10px] border-[1.5px] border-solid border-[#f3be0f]" />
              <div className="absolute inset-0 flex items-center justify-center [-webkit-text-stroke:1.5px_#f3be0f] [font-family:'SF_Pro-Semibold',Helvetica] font-normal text-transparent text-[13px] text-center whitespace-nowrap">
                {title}
              </div>
            </div>

            <button
              type="button"
              className="mt-4 relative w-[84px] h-[30px] cursor-pointer"
              onClick={() => setIsExpanded(!isExpanded)}
              aria-label="More information about pet"
              aria-expanded={isExpanded}
            >
              <span className="absolute inset-0 flex items-center justify-center [font-family:'SF_Pro-Heavy',Helvetica] font-normal text-black text-[11px] text-center tracking-[0] leading-[20px] whitespace-nowrap z-10">
                {isExpanded ? "less" : "more"} info
              </span>
              <div className="absolute inset-0 rounded-[11.25px] border border-solid border-white" />
            </button>

            <div className="mt-4 relative">
              <h3 className="[font-family:'SF_Pro-Heavy',Helvetica] font-normal text-black text-[24px] leading-[20px]">
                {petName}
              </h3>
              <p className="mt-2 [font-family:'SF_Pro-Semibold',Helvetica] font-normal text-black text-[12px] leading-[16px]">
                {breed}
              </p>
            </div>
          </div>

          <div className="flex-1 p-6 relative bg-[#fff9ed]">
            <div className="h-5 bg-[#f3be0f] rounded-t-xl border-2 border-solid border-[#f3be0f]" />
            <div className="h-2.5 bg-[#f3be0f] border-x-2 border-solid border-[#f3be0f]" />
            <div className="border-2 border-t-0 border-solid border-[#f3be0f] rounded-b-xl p-5 max-h-96 overflow-y-auto">
              <h2 className="[font-family:'SF_Pro-Heavy',Helvetica] font-normal text-black text-[32px] tracking-[-0.49px] leading-[28px]">
                {title}
              </h2>
              <p className="mt-4 [font-family:'SF_Pro-Semibold',Helvetica] font-normal text-black text-[14px] tracking-[-0.48px] leading-[18px] whitespace-pre-wrap">
                {fullCaption}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

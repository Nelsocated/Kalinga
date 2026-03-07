"use client";

import { useMemo, useState } from "react";
import { ExplorePet } from "@/components/explore/types";
import ExpandedFosterStory from "@/components/explore/ExpandedFosterStory";

type FosterStoryBoxProps = {
  item: ExplorePet;
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

export default function FosterStoryBox({ item }: FosterStoryBoxProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const randomPhoto = useMemo(() => pickDisplayPhoto(item), [item]);

  const storyCaption = useMemo(() => {
    const caption = item.pet_media.find((media) => media.caption?.trim())?.caption;
    if (caption && caption.trim().length > 0) {
      return caption.trim();
    }
    return "This pet is currently featured in Foster's story. Tap more info to see full details once a longer story is available.";
  }, [item.pet_media]);

  const preview = isExpanded
    ? storyCaption
    : `${storyCaption.slice(0, 260)}${storyCaption.length > 260 ? "..." : ""}`;

  const petName = item.name ?? "Unnamed";
  const breed = item.shelter?.shelter_name ?? "Ilonggo Puspins";
  const title = '"Miracle Cancer Survivor"';

  return (
    <>
      <div className="mt-6 flex items-start min-w-[300px] w-full">
        <div className="w-full rounded-2xl border-2 border-[#f3be0f] bg-[#fff9ed] overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-[240px] bg-[#f3be0f] p-3 relative">
              {randomPhoto ? (
                <img
                  className="w-full h-[163px] rounded-lg object-cover"
                  alt={`${petName} - ${breed}`}
                  src={randomPhoto}
                />
              ) : (
                <div className="w-full h-[163px] rounded-lg bg-white" />
              )}

              <div className="mt-2 w-full h-[27px] relative">
                <div className="absolute inset-0 bg-white rounded-[10px] border-[1.5px] border-solid border-[#f3be0f]" />
                <div className="absolute inset-0 flex items-center justify-center [-webkit-text-stroke:1.5px_#f3be0f] [font-family:'SF_Pro-Semibold',Helvetica] font-normal text-transparent text-[12px] text-center whitespace-nowrap">
                  {title}
                </div>
              </div>

              <button
                type="button"
                className="mt-3 relative w-[84px] h-[30px] cursor-pointer"
                onClick={() => setIsExpanded(true)}
                aria-label="More information about pet"
              >
                <span className="absolute inset-0 flex items-center justify-center [font-family:'SF_Pro-Heavy',Helvetica] font-normal text-black text-[10px] text-center tracking-[0] leading-[20px] whitespace-nowrap z-10">
                  more info
                </span>
                <div className="absolute inset-0 rounded-[11.25px] border border-solid border-white" />
              </button>

              <div className="mt-3 relative h-[42px]">
                <h3 className="[font-family:'SF_Pro-Heavy',Helvetica] font-normal text-black text-[20px] leading-[18px]">
                  {petName}
                </h3>
                <p className="mt-1 [font-family:'SF_Pro-Semibold',Helvetica] font-normal text-black text-[11px] leading-[15px] whitespace-nowrap">
                  {breed}
                </p>
              </div>
            </div>

            <div className="flex-1 p-4 relative bg-[#fff9ed]">
              <div className="h-5 bg-[#f3be0f] rounded-t-xl border-2 border-solid border-[#f3be0f]" />
              <div className="h-2.5 bg-[#f3be0f] border-x-2 border-solid border-[#f3be0f]" />
              <div className="border-2 border-t-0 border-solid border-[#f3be0f] rounded-b-xl p-4 min-h-[180px]">
                <h2 className="[font-family:'SF_Pro-Heavy',Helvetica] font-normal text-black text-[28px] tracking-[-0.49px] leading-[25px]">
                  {title}
                </h2>
                <p className="mt-2 [font-family:'SF_Pro-Semibold',Helvetica] font-normal text-black text-[13.7px] tracking-[-0.48px] leading-[13.7px]">
                  {preview}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isExpanded && (
        <ExpandedFosterStory
          item={item}
          onClose={() => setIsExpanded(false)}
        />
      )}
    </>
  );
}

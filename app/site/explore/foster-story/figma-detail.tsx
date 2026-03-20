"use client";

import NavBar from "@/components/layout/NavBar";
import Image from "next/image";
import heart from "@/public/buttons/Like.svg";
import icon from "@/public/icons/Explore.svg";

export default function FigmaDetailedPetStory() {
  return (
    <div className="flex min-h-svh bg-[#fff9ed]">
      <NavBar />
      <main className="flex-1 flex justify-center items-start relative overflow-x-auto">
        {/* Outer yellow card */}
        <div className="absolute top-0 left-[471px] w-[969px] h-[1024px] bg-[#f3be0f] rounded-[15px] -z-10" />
        {/* Inner cream card */}
        <div className="absolute top-[50px] left-[521px] w-[869px] h-[924px] bg-[#fff9ed] rounded-[15px] -z-10" />
        <div className="relative w-[869px] h-[924px] flex">
          {/* Left: Image gallery */}
          <div className="relative w-[405px] h-full pt-[74px] pl-[40px]">
            {/* Main image */}
            <div className="absolute w-[78.29%] h-[56.99%] top-[2.13%] left-[9.90%] bg-[#f08c00] rounded-[16.43px]" />
            {/* Small images */}
            <div className="absolute top-[63.66%] left-[9.90%] flex gap-4 w-[81.2%]">
              <div className="w-[24.29%] h-[25.76%] bg-[#f08c00] rounded-[16.43px]" />
              <div className="w-[24.29%] h-[25.76%] bg-[#f3c52a] rounded-[16.43px]" />
              <div className="w-[24.29%] h-[25.76%] bg-[#ffec99] rounded-[16.43px]" />
            </div>
            {/* More info button */}
            <button className="absolute top-[89%] left-[38%] w-[219px] h-12 bg-[#f3be0f] rounded-[16.43px] text-white text-2xl font-bold tracking-wide">more info</button>
          </div>
          {/* Right: Story and info */}
          <div className="relative flex-1 pt-[74px] pl-[60px] pr-[40px]">
            {/* Pet name */}
            <h1 className="text-3xl font-bold tracking-wide mb-8">Pet Name</h1>
            {/* Story title */}
            <h2 className="font-bold text-3xl mb-4">“Miracle Cancer Survivor”</h2>
            {/* Story text */}
            <p className="text-xl font-light text-justify leading-[25px] mb-8">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eu arcu at massa dapibus tincidunt. Pellentesque maximus mollis augue sit amet euismod. Mauris sit amet ornare turpis, non suscipit purus. Aenean pellentesque id lacus et elementum. Morbi non fermentum felis, id cursus enim. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Mauris non metus metus. Phasellus a gravida ante, nec finibus mi. Sed risus velit, aliquet dictum lectus eu, egestas tempor elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eu arcu at massa dapibus tincidunt. Pellentesque maximus mollis augue sit amet euismod. Mauris sit amet ornare turpis, non suscipit purus. Aenean pellentesque id lacus et elementum. Morbi non fermentum felis, id cursus enim. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Mauris non metus metus. Phasellus a gravida ante, nec finibus mi. Sed risus velit, aliquet dictum lectus eu, egestas tempor elit.
            </p>
            {/* Shelter info */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-[70px] h-[70px] rounded-full bg-[#d9d9d9]" />
              <div>
                <div className="text-2xl font-normal">Shelter Name</div>
                <div className="text-xl font-normal">Location</div>
              </div>
            </div>
            {/* Heart button */}
            <button className="absolute top-[20px] right-[20px] w-[40px] h-[40px] flex items-center justify-center">
              <Image src={heart} alt="heart" width={32} height={32} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

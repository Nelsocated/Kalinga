"use client";

import NavBar from "@/components/layout/NavBar";

export default function FosterStoryDetail() {
  return (
    <div className="flex min-h-svh gap-6 bg-[#E8E2D9] px-6 md:px-8 lg:gap-8 xl:px-10">
      <NavBar />
      <main className="min-w-0 flex-1 flex justify-center items-start py-10">
        <div className="w-[900px] bg-[#F5F1E8] rounded-2xl p-10 relative">
          {/* Top Icons */}
          <div className="flex justify-between mb-6">
            <button className="cursor-pointer p-2 hover:bg-gray-200 rounded-full">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <button className="cursor-pointer p-2 hover:bg-gray-200 rounded-full">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            </button>
          </div>
          <div className="flex gap-10">
            {/* LEFT SIDE */}
            <div className="flex flex-col items-start">
              {/* Main Image */}
              <div className="w-[250px] h-[200px] bg-orange-500 rounded-xl mb-4"></div>
              {/* Small Images */}
              <div className="flex gap-3 mb-5">
                <div className="w-[70px] h-[60px] bg-orange-500 rounded-lg"></div>
                <div className="w-[70px] h-[60px] bg-yellow-400 rounded-lg"></div>
                <div className="w-[70px] h-[60px] bg-yellow-200 rounded-lg"></div>
              </div>
              {/* Button */}
              <button className="bg-yellow-500 text-white px-6 py-2 rounded-full font-semibold">
                more info
              </button>
            </div>
            {/* RIGHT SIDE */}
            <div className="max-w-[420px]">
              {/* Pet Name */}
              <h2 className="text-2xl font-bold mb-4">Pet Name</h2>
              {/* Shelter Info */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">Shelter Name</p>
                  <p className="text-xs text-gray-500">Location</p>
                </div>
              </div>
              {/* Story Title */}
              <h3 className="font-bold text-lg mb-2">“Miracle Cancer Survivor”</h3>
              {/* Story Text */}
              <p className="text-sm text-gray-600 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eu
                arcu at massa dapibus tincidunt. Pellentesque maximus mollis
                augue sit amet euismod. Mauris sit amet ornare turpis, non
                suscipit purus. Aenean pellentesque id lacus et elementum.
                Morbi non fermentum felis, id cursus enim.
                Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
                posuere cubilia curae; Mauris non metus metus. Phasellus a
                gravida ante, nec finibus mi.
                Sed risus velit, aliquet dictum lectus eu, egestas tempor elit.
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eu
                arcu at massa dapibus tincidunt. Pellentesque maximus mollis
                augue sit amet euismod.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

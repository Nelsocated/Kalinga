"use client";




import NavBar from "@/components/layout/NavBar";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";

export default function PetDetailClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const moreInfoRef = useRef<HTMLDivElement>(null);
  const [liked, setLiked] = useState(false);

  const handleBack = () => {
    router.push("/site/explore/foster-story");
  };

  const handleMoreInfo = () => {
    // Get pet id from the URL (dynamic route)
    const pathParts = window.location.pathname.split("/");
    const petId = pathParts[pathParts.length - 1];
    // Get name and shelter from query params if available
    const name = searchParams.get("name") || "";
    const shelter = searchParams.get("shelter") || "";
    const params = new URLSearchParams();
    if (name) params.set("name", name);
    if (shelter) params.set("shelter", shelter);
    const qs = params.toString();
    router.push(`/site/pet/${petId}${qs ? `?${qs}` : ""}`);
  };

  const handleLike = () => {
    setLiked((prev) => !prev);
  };

  return (
    <div className="flex bg-[#EDE7DB] min-h-screen">
      <NavBar />
      <div className="flex-1 flex items-center justify-center p-10">
        {/* Yellow Container */}
        <div className="bg-[#F2B705] p-10 rounded-xl w-245">
          {/* Card */}
          <div className="bg-[#F4EFE6] rounded-xl p-10 flex gap-12">
            {/* LEFT SIDE */}
            <div className="flex flex-col">
              {/* Back Button */}
              <button onClick={handleBack} className="mb-4 cursor-pointer" style={{ display: 'inline-block', width: 24, height: 24, background: 'none', border: 'none', padding: 0 }} aria-label="Back to foster story list">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              {/* Main Image */}
              <div className="w-62.5 h-50 bg-[#F28C00] rounded-lg mb-6 flex items-center justify-center overflow-hidden">
                <img
                  src="/foster-stories/cat1.jpg"
                  alt="Fostered cat resting on a blanket"
                  className="object-cover w-full h-full rounded-lg"
                  style={{ maxHeight: 200 }}
                />
              </div>
              {/* Gallery */}
              <div className="flex gap-3 mb-6">
                <div className="w-17.5 h-17.5 bg-[#F28C00] rounded-md"></div>
                <div className="w-17.5 h-17.5 bg-[#F2B705] rounded-md"></div>
                <div className="w-17.5 h-17.5 bg-[#E9D98A] rounded-md"></div>
              </div>
              {/* Button */}
              <button
                className="flex justify-center mt-2 bg-[#F2B705] text-white text-sm font-semibold px-6 py-2 rounded-full shadow hover:bg-[#e0a800] transition-colors focus:outline-none focus:ring-2 focus:ring-[#F2B705] focus:ring-offset-2 mx-auto"
                onClick={handleMoreInfo}
                type="button"
              >
                more info
              </button>
            </div>
            {/* RIGHT SIDE */}
            <div className="flex-1" ref={moreInfoRef}>
              {/* Top Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-[#333333]">Pet Name</h2>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                    <div className="text-sm text-[#777777] leading-4">
                      <p>Shelter Name</p>
                      <p>Location</p>
                    </div>
                  </div>
                </div>
                <button
                  className="text-[#F2B705] cursor-pointer"
                  style={{ display: 'inline-block', width: 24, height: 24, background: 'none', border: 'none', padding: 0 }}
                  aria-label="Like"
                  onClick={handleLike}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill={liked ? "#F2B705" : "none"}
                    stroke="#F2B705"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </button>
              </div>
              {/* Story Title */}
              <h3 className="font-semibold mt-6 mb-3 text-[#333333]">
                “Miracle Cancer Survivor”
              </h3>
              {/* Story Text */}
              <p className="text-sm text-[#555] leading-relaxed max-w-105">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eu
                arcu ut massa dapibus tincidunt. Pellentesque maximus mollis
                augue sit amet euismod. Mauris sit amet ornare turpis, non
                suscipit purus. Aenean pellentesque id lacus et elementum.
                Morbi non fermentum felis, id cursus enim. Vestibulum ante
                ipsum primis in faucibus orci luctus et ultrices posuere
                cubilia curae; Mauris non metus metus. Phasellus a gravida
                ante, nec finibus mi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

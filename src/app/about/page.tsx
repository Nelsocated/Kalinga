import React from "react";
import Image from "next/image";
import logo from "@/public/kalinga_logo.svg";

export default function Page() {
  return (
    <main className="h-screen overflow-y-scroll snap-y snap-mandatory">
      <section className="h-screen snap-start">
        <Section>
          <div>
            <Image src={logo} alt="kalinga-logo" width={100} height={100} />
            <span>
              Give Care. Give Love. <br />A Home for Every Paw
            </span>
          </div>
        </Section>
      </section>

      <section className="h-screen snap-start">
        <Section>
          <div>
            <div>
              <div>Our Mission</div>
              <div className="text-center line-clamp-3">
                To connect people with pets in need by making adoption simple
                and accessible while empowering shelters with tools to reach
                more adopters and find loving homes faster.
              </div>
            </div>
            <div>
              <div>Our Vision</div>
              <div>
                To create a platform that maximizs visibility for every shelter
                and pets, making it eassier for people everywhere to discover,
                connect, and adopt.
              </div>
            </div>
          </div>
          <div>
            <span></span>
          </div>
        </Section>
      </section>

      <section className="h-screen snap-start">
        <Section>
          <div>Page 3</div>
        </Section>
      </section>
    </main>
  );
}

function Section({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-svh overflow-hidden bg-primary p-3 sm:p-4 lg:p-6">
      <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-center rounded-[15px] bg-innerbg shadow-lg">
        {children}
      </div>
    </div>
  );
}

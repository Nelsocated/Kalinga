"use client";

import React from "react";
import Image, { StaticImageData } from "next/image";
import BackButton from "@/src/components/ui/BackButton";
import logo from "@/public/kalinga_logo.svg";
import Arian from "@/public/team/Arian.png";
import Chrisciel from "@/public/team/Chrisciel.png";
import Nelson from "@/public/team/Nelson.png";
import Nino from "@/public/team/Nino.png";

export default function Page() {
  const [heroRef, heroVisible] = useInView();
  const [missionRef, missionVisible] = useInView();
  const [teamRef, teamVisible] = useInView();

  return (
    <main className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth no-scrollbar">
      {/* BACK BUTTON */}
      <div className="fixed top-25 left-25 z-50">
        <BackButton />
      </div>

      {/* HERO */}
      <section className="h-screen snap-start">
        <Section>
          <div
            ref={heroRef}
            className={`flex flex-col items-center text-center transition-all duration-700 ${
              heroVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <Image
              src={logo}
              alt="kalinga-logo"
              width={200}
              height={200}
              className="mb-6 animate-float"
            />

            <span className="text-title font-semibold leading-tight bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
              Give Care. Give Love. <br />A Home for Every Paw
            </span>

            <div className="mt-15 text-sm opacity-70 animate-bounceHint">
              ↓ Scroll
            </div>
          </div>
        </Section>
      </section>

      {/* MISSION */}
      <section className="h-screen snap-start">
        <Section>
          <div
            ref={missionRef}
            className={`grid max-w-3xl gap-10 text-center transition-all duration-700 ${
              missionVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div>
              <div className="text-subheader font-bold mb-2 text-secondary">
                Our Mission
              </div>
              <p className="text-subtitle leading-relaxed">
                To connect people with pets in need by making adoption simple
                and accessible while empowering shelters to reach more adopters.
              </p>
            </div>

            <div>
              <div className="text-subheader font-bold mb-2 text-secondary">
                Our Vision
              </div>
              <p className="text-subtitle leading-relaxed">
                To maximize visibility for every shelter and pet, making it
                easier for people everywhere to discover and adopt.
              </p>
            </div>
          </div>
        </Section>
      </section>

      {/* TEAM */}
      <section className="h-screen snap-start">
        <Section>
          <div
            ref={teamRef}
            className={`flex flex-col items-center gap-8 transition-all duration-700 ${
              teamVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="text-primary font-extrabold text-name text-center">
              SE-4 <br />
              <span className="text-secondary">404NotFound</span>
            </div>

            <div className="text-title font-bold text-secondary">
              Meet The Team
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <Team
                image={Chrisciel}
                name="Chrisciel Joy A."
                family="Catedrilla"
              />
              <Team image={Nelson} name="Nelson A." family="Lago III" />
              <Team image={Arian} name="Elijah Arian G." family="Mardoquio" />
              <Team image={Nino} name="Niño Kriebel C." family="Olmo" />
            </div>
          </div>
        </Section>
      </section>

      {/* PAGE-SCOPED CSS ONLY */}
      <style jsx global>{`
        /* HIDE SCROLLBAR ONLY FOR THIS PAGE */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          scrollbar-width: none;
        }

        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        @keyframes bounceHint {
          0%,
          100% {
            transform: translateY(0);
            opacity: 0.6;
          }
          50% {
            transform: translateY(8px);
            opacity: 1;
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-bounceHint {
          animation: bounceHint 1.5s infinite;
        }
      `}</style>
    </main>
  );
}

function Section({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-screen bg-primary px-6 py-6 overflow-hidden">
      {/* background glow */}
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-secondary rounded-full animate-float" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary rounded-full animate-float" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-secondary rounded-full animate-float" />

      <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl items-center justify-center rounded-[20px] bg-innerbg shadow-xl">
        {children}
      </div>
    </div>
  );
}

function useInView() {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, visible] as const;
}

type Props = {
  image: StaticImageData;
  name: string;
  family: string;
};

function Team({ image, name, family }: Props) {
  return (
    <div className="group relative flex flex-col items-center rounded-[15px] border-2 border-primary transition duration-500 hover:-translate-y-3 hover:shadow-2xl">
      <div className="absolute inset-0 rounded-[15px] opacity-0 group-hover:opacity-100 transition bg-linear-to-br from-primary/10 to-secondary/10 blur-xl" />

      <div className="relative h-40 w-40 overflow-hidden rounded-[10px]">
        <Image
          src={image}
          alt={name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110 group-hover:rotate-2"
        />
      </div>

      <div className="py-2 flex flex-col items-center">
        <div className="text-primary text-subtitle font-bold">{family}</div>
        <div className="text-sm font-semibold">{name}</div>
      </div>
    </div>
  );
}

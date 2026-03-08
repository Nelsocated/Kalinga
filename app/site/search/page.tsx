"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/NavBar";
import Button from "@/components/ui/Button";
import Gender from "@/public/icons/Gender.svg";
import Dog from "@/public/icons/Dog.svg";
import Cat from "@/public/icons/Cat.svg";
import Species from "@/public/icons/Species.svg";
import Meet from "@/public/icons/meet.svg";
import male_icon from "@/public/icons/male-icon.svg";
import female_icon from "@/public/icons/female-icon.svg";
import Age from "@/public/icons/Age.svg";
import Size from "@/public/icons/Size.svg";
import Image from "next/image";

const PATH = "/site/search/results";

function toggleValue(
  value: string,
  setter: React.Dispatch<React.SetStateAction<string[]>>,
) {
  setter((prev) =>
    prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
  );
}
const spaceStyle = "flex gap-2 flex-wrap ml-3";
const titleStyle = "text-xl font-semibold flex items-start";

export default function SearchPage() {
  const router = useRouter();

  const [species, setSpecies] = useState<string[]>([]);
  const [sex, setSex] = useState<string[]>([]);
  const [age, setAge] = useState<string[]>([]);
  const [size, setSize] = useState<string[]>([]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const params = new URLSearchParams();
    if (species.length) params.set("species", species.join(","));
    if (sex.length) params.set("sex", sex.join(","));
    if (age.length) params.set("age", age.join(","));
    if (size.length) params.set("size", size.join(","));

    router.push(`${PATH}?${params.toString()}`);
  }

  const btn = (active: boolean) =>
    `px-3 py-1 rounded-md border w-auto flex justify-center items-center ${active ? "bg-primary text-black" : "bg-background text-black"}`;

  return (
    <div className="min-h-screen bg-background flex">
      <div className="pl-10">
        <Navbar />
      </div>

      <div className="flex-1 flex pl-20">
        <div className="w-full max-w-5xl rounded-xl bg-primary">
          <div className="p-5 text-6xl font-bold ml-6">Search</div>

          <main className="h-screen w-full rounded-2xl bg-white border-4 border-primary overflow-y-auto">
            <div className="flex flex-col gap-3 m-4">
              <form onSubmit={handleSubmit}>
                <div className="space-y-3">
                  <>
                    <div className={titleStyle}>
                      <Image
                        src={Species}
                        alt="species-icon"
                        width={25}
                        height={25}
                      />
                      Species
                    </div>
                    <div className={spaceStyle}>
                      <Button
                        type="button"
                        className={btn(species.includes("dog"))}
                        onClick={() => toggleValue("dog", setSpecies)}
                      >
                        <Image
                          src={Dog}
                          alt="dog-icon"
                          width={25}
                          height={25}
                        />
                        Dog
                      </Button>
                      <Button
                        type="button"
                        className={btn(species.includes("cat"))}
                        onClick={() => toggleValue("cat", setSpecies)}
                      >
                        <Image
                          src={Cat}
                          alt="cat-icon"
                          width={25}
                          height={25}
                        />
                        Cat
                      </Button>
                    </div>
                  </>

                  <>
                    <div className={titleStyle}>
                      <Image
                        src={Gender}
                        alt="gender-icon"
                        width={25}
                        height={25}
                      />
                      Gender
                    </div>
                    <div className={spaceStyle}>
                      <Button
                        type="button"
                        className={btn(sex.includes("male"))}
                        onClick={() => toggleValue("male", setSex)}
                      >
                        <Image
                          src={male_icon}
                          alt="male-icon"
                          width={25}
                          height={25}
                          className="text-black"
                        />
                        Male
                      </Button>
                      <Button
                        type="button"
                        className={btn(sex.includes("female"))}
                        onClick={() => toggleValue("female", setSex)}
                      >
                        <Image
                          src={female_icon}
                          alt="female-icon"
                          width={25}
                          height={25}
                          className="text-black"
                        />
                        Female
                      </Button>
                    </div>
                  </>

                  <>
                    <div className={titleStyle}>
                      <Image src={Age} alt="age-icon" width={25} height={25} />
                      Age Range
                    </div>
                    <div className={spaceStyle}>
                      <Button
                        type="button"
                        className={btn(age.includes("puppy/kitten"))}
                        onClick={() => toggleValue("puppy/kitten", setAge)}
                      >
                        Puppy/Kitten
                      </Button>
                      <Button
                        type="button"
                        className={btn(age.includes("young_adult"))}
                        onClick={() => toggleValue("young_adult", setAge)}
                      >
                        Young
                      </Button>
                      <Button
                        type="button"
                        className={btn(age.includes("adult"))}
                        onClick={() => toggleValue("adult", setAge)}
                      >
                        Adult
                      </Button>
                      <Button
                        type="button"
                        className={btn(age.includes("senior"))}
                        onClick={() => toggleValue("senior", setAge)}
                      >
                        Senior
                      </Button>
                    </div>
                  </>

                  <>
                    <div className={titleStyle}>
                      <Image
                        src={Size}
                        alt="species-icon"
                        width={25}
                        height={25}
                      />
                      Size
                    </div>
                    <div className={spaceStyle}>
                      <Button
                        type="button"
                        className={btn(size.includes("small"))}
                        onClick={() => toggleValue("small", setSize)}
                      >
                        Small
                      </Button>
                      <Button
                        type="button"
                        className={btn(size.includes("medium"))}
                        onClick={() => toggleValue("medium", setSize)}
                      >
                        Medium
                      </Button>
                      <Button
                        type="button"
                        className={btn(size.includes("large"))}
                        onClick={() => toggleValue("large", setSize)}
                      >
                        Large
                      </Button>
                    </div>
                  </>
                </div>

                <div>
                  <Button type="submit">
                    <div className={titleStyle}>
                      <Image
                        src={Meet}
                        alt="meet-icon"
                        width={25}
                        height={25}
                      />
                      See Pets
                    </div>
                  </Button>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

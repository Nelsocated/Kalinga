"use client";

import { useRouter } from "next/navigation";
import { ExplorePet } from "@/components/explore/types";

const RESIDENT_BADGE_TEMPLATES = [
	"Long-Stay Hero",
	"Waiting Patiently",
	"Ready for Adoption",
	"Calm and Loving",
	"Shelter Favorite",
	"Forever Home Ready",
];

const pickResidentBadge = (resident: ExplorePet) => {
	const key = resident.id ?? resident.name ?? "resident";
	const hash = Array.from(key).reduce((acc, char) => acc + char.charCodeAt(0), 0);
	const template = RESIDENT_BADGE_TEMPLATES[hash % RESIDENT_BADGE_TEMPLATES.length];
	return `\"${resident.name ?? "This pet"} - ${template}\"`;
};

type LongestResidentsProps = {
	items: ExplorePet[];
	showAdoptionPosts: boolean;
	onToggleAdoptionPosts: () => void;
};

export default function LongestResidents({
	items,
	showAdoptionPosts,
	onToggleAdoptionPosts,
}: LongestResidentsProps) {
	const router = useRouter();
	const featuredResidents = items.slice(0, 4);

	const PET_NAMES = ["Brownie", "Luna", "Mochi", "Biscuit", "Coco", "Peanut", "Kimchi", "Patches", "Shadow", "Ginger", "Tofu", "Nugget", "Pepper", "Oreo", "Caramel", "Mocha"];
	const SHELTERS = ["Paws of Hope", "Kalinga Shelter", "Happy Tails", "Furry Friends", "Safe Haven", "Second Chance", "New Beginnings", "Loving Paws"];
	const COLORS = ["bg-[#f08c00]", "bg-[#f3c52a]", "bg-[#ffec99]", "bg-[#e8bf42]", "bg-[#d4a017]", "bg-[#fcd34d]"];

	const expandedItems = Array.from({ length: 16 }, (_, i) => {
		const base = items[i % items.length] ?? items[0];
		return {
			...base,
			name: PET_NAMES[i % PET_NAMES.length],
			shelter: { shelter_name: SHELTERS[i % SHELTERS.length] },
			_key: `gen-${i}`,
			_color: COLORS[i % COLORS.length],
		};
	});

	const openResidentProfile = (id: string, name?: string | null, shelterName?: string | null) => {
		const params = new URLSearchParams();
		if (name) params.set("name", name);
		if (shelterName) params.set("shelter", shelterName);
		const qs = params.toString();
		router.push(`/site/pet/${id}${qs ? `?${qs}` : ""}`);
	};

	return (
		<div className="mb-8">
			<div className="mb-5 flex items-center justify-between">
				<h2 className="text-3xl font-bold text-black">Our longest residents</h2>
				<button
					type="button"
					onClick={onToggleAdoptionPosts}
					aria-label={showAdoptionPosts ? "Back to longest residents" : "Show pet adoption posts"}
					className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e8bf42] bg-white text-xl font-bold text-black"
				>
					{showAdoptionPosts ? "<" : ">"}
				</button>
			</div>

			{showAdoptionPosts ? (
				<div className="max-h-[60vh] overflow-y-auto pr-2">
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
						{expandedItems.map((resident) => {
							const firstPhoto = resident.pet_media.find((media) => media.type === "photo");
							const fallbackSubtitle = resident.shelter?.shelter_name ?? "Available for adoption";
							const residentBadge = pickResidentBadge(resident);

							return (
								<article
									key={resident._key}
									className="rounded-2xl border border-[#e8bf42] bg-[#f6cf55] p-3"
								>
									<div className="relative">
										<div className="absolute -top-5 left-1/2 z-10 min-w-55 -translate-x-1/2 rounded-full border-2 border-[#f3be0f] bg-white px-5 py-1 text-center text-xs font-semibold text-[#f3be0f] shadow">
											{residentBadge}
										</div>
										{firstPhoto ? (
											<img
												src={firstPhoto.url}
												alt={resident.name ?? "Resident pet"}
												className="h-40 w-full rounded-xl bg-white object-cover"
											/>
										) : (
											<div className="h-40 rounded-xl bg-white" />
										)}
									</div>
									<div className="mt-3 flex w-full items-center justify-between gap-3">
										<div className="flex flex-col">
											<h3 className="text-2xl font-bold text-black">{resident.name ?? "Unnamed"}</h3>
											<p className="mt-1 text-sm text-black/70">{fallbackSubtitle}</p>
										</div>
										<button
											type="button"
											onClick={() => openResidentProfile(resident.id, resident.name, resident.shelter?.shelter_name)}
											className="rounded-full border border-[#f3be0f] bg-white px-4 py-1 text-sm font-semibold text-[#f3be0f] hover:bg-[#f3be0f] hover:text-white"
										>
											More Info
										</button>
									</div>
								</article>
							);
						})}
					</div>
				</div>
			) : (
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
					{featuredResidents.map((resident) => {
						const firstPhoto = resident.pet_media.find((media) => media.type === "photo");
						const fallbackSubtitle = resident.shelter?.shelter_name ?? "Available for adoption";
						const residentBadge = pickResidentBadge(resident);

						return (
							<article
								key={resident.id}
								className="rounded-2xl border border-[#e8bf42] bg-[#f6cf55] p-3"
							>
								<div className="relative">
									<div className="absolute -top-5 left-1/2 z-10 min-w-55 -translate-x-1/2 rounded-full border-2 border-[#f3be0f] bg-white px-5 py-1 text-center text-xs font-semibold text-[#f3be0f] shadow">
										{residentBadge}
									</div>
									{firstPhoto ? (
										<img
											src={firstPhoto.url}
											alt={resident.name ?? "Resident pet"}
											className="h-40 w-full rounded-xl bg-white object-cover"
										/>
									) : (
										<div className="h-40 rounded-xl bg-white" />
									)}
								</div>
								<div className="mt-3 flex w-full items-center justify-between gap-3">
									<div className="flex flex-col">
										<h3 className="text-2xl font-bold text-black">{resident.name ?? "Unnamed"}</h3>
										<p className="mt-1 text-sm text-black/70">{fallbackSubtitle}</p>
									</div>
									<button
										type="button"
										onClick={() => openResidentProfile(resident.id, resident.name, resident.shelter?.shelter_name)}
										className="rounded-full border border-[#f3be0f] bg-white px-4 py-1 text-sm font-semibold text-[#f3be0f] hover:bg-[#f3be0f] hover:text-white"
									>
										More Info
									</button>
								</div>
							</article>
						);
					})}
				</div>
			)}
		</div>
	);
}

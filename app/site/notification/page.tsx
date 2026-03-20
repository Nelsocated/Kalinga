import NotifClient from "./NotifClient";
import { getUserId } from "@/lib/utils/getUserId";
import { getUserAdoptionNotifications } from "@/lib/services/adoption/adoptionService";
import { fetchShelterById } from "@/lib/services/shelterService";
import { getPetById } from "@/lib/services/pet/petService";

export type NotificationStatus =
  | "pending"
  | "under_review"
  | "contacting_applicant"
  | "not_approved"
  | "approved"
  | "withdrawn"
  | "adopted";

export type NotificationItem = {
  id: string;
  shelter: string;
  petName: string;
  date: string;
  status: NotificationStatus;
  title: string;
  shortMessage: React.ReactNode;
  fullMessage: React.ReactNode;
};

type RawNotification = {
  id: string;
  shelter_id: string | null;
  pet_id: string | null;
  created_at: string;
  updated_at: string;
  status: string;
};

function buildNotificationContent(
  petName: string,
  shelterName: string,
  status: NotificationStatus,
) {
  switch (status) {
    case "pending":
      return {
        title: "Application Submitted",
        shortMessage: (
          <>
            Your application for{" "}
            <span className="font-semibold">{petName}</span> was submitted to $
            {shelterName}.
          </>
        ),
        fullMessage: (
          <>
            Your application to adopt {petName} has been{" "}
            <span className="font-semibold">successfully submitted</span>. Thank
            you for your interest and for giving Nelson the opportunity to find
            a loving furever home.
            {"\n"}
            The {shelterName} will review your application and reach out to you
            if there are any updates or next steps. Thank you for choosing
            adoption and helping give pets like{" "}
            <span className="font-semibold">{petName}</span> a brighter future
            🐶
          </>
        ),
      };

    case "under_review":
      return {
        title: "Under Review",
        shortMessage: (
          <>
            Your application for{" "}
            <span className="font-semibold">{petName}</span> is now under review
            by the shelter, {shelterName}.
          </>
        ),
        fullMessage: (
          <>
            Great news! Your adoption status for{" "}
            <span className="font-semibold">{petName}</span> is now{" "}
            <span className="font-semibold text-under_review">
              “Under Review.”
            </span>{" "}
            {shelterName} is reviewing your response and will get back to you
            shortly. Thanks for your patience 📞
          </>
        ),
      };

    case "contacting_applicant":
      return {
        title: "Shelter Reached Out",
        shortMessage: (
          <>
            <span className="font-semibold">{petName}</span> is contacting you
            about {petName}.
          </>
        ),
        fullMessage: (
          <>
            {shelterName} has{" "}
            <span className="font-semibold text-contacting">reached out</span>{" "}
            to you regarding your adoption application for{" "}
            <span className="font-semibold">{petName}</span>. Please check your
            messages or email to view their response and learn about the next
            steps in the adoption process 📩
          </>
        ),
      };

    case "approved":
      return {
        title: "Application Approved",
        shortMessage: (
          <>
            Your application for{" "}
            <span className="font-semibold">{petName}</span> was approved by
            {shelterName}.
          </>
        ),
        fullMessage: (
          <>
            Wonderful news! 🎉 Your adoption application for{" "}
            <span className="font-semibold">{petName}</span> has been{" "}
            <span className="font-semibold text-approved">reached out</span>.
            {"\n"}
            Please keep an eye out for a message from the {shelterName} team,
            who will reach out soon with the next steps to finalize the adoption
            process.
          </>
        ),
      };

    case "not_approved":
      return {
        title: "Application Not Approved",
        shortMessage: (
          <>
            Your application for{" "}
            <span className="font-semibold">{petName}</span> was not approved.
          </>
        ),
        fullMessage: (
          <>
            Thank you for your interest in adopting{" "}
            <span className="font-semibold">{petName}</span> and for taking the
            time to submit an application. Unfortunately, the shelter has
            decided{" "}
            <span className="font-semibold text-reject">
              not to proceed with the application
            </span>{" "}
            at this time.{"\n"}
            This decision does not lessen our appreciation for your desire to
            adopt. We encourage you to continue exploring other pets who may
            find their furever home with you 🐾
          </>
        ),
      };

    case "withdrawn":
      return {
        title: "Application Withdrawn",
        shortMessage: (
          <>
            Your application for{" "}
            <span className="font-semibold">{petName}</span> has been withdrawn.
          </>
        ),
        fullMessage: (
          <>
            You’ve decided to{" "}
            <span className="font-semibold text-withdrawn">withdrawn</span> your
            adoption application for{" "}
            <span className="font-semibold">{petName}</span>.{"\n"}
            No worries! Thank you for checking our pets, and maybe another furry
            friend is waiting for you. 🏡
          </>
        ),
      };

    case "adopted":
      return {
        title: "Pet Adopted!",
        shortMessage: (
          <>
            <span className="font-semibold">{petName}</span> has been adopted.
          </>
        ),
        fullMessage: (
          <>
            <span className="font-semibold">{petName}</span> has officially been
            <span className="font-semibold text-adopted">adopted</span>.{"\n"}
            Thank you for showing interest in giving{" "}
            <span className="font-semibold">{petName}</span> a loving home. Your
            support for pet adoption helps more animals find their furever
            families. 🏡❤️{" "}
          </>
        ),
      };
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();

  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);

  // 🔥 If within 1 hour → show minutes
  if (diffMinutes < 60) {
    return `${diffMinutes} min${diffMinutes === 1 ? "" : "s"} ago`;
  }

  // 🔥 If within 24 hours → show hours
  if (diffHours < 24) {
    return `${diffHours} hr${diffHours === 1 ? "" : "s"} ago`;
  }

  // 🔥 Otherwise → full date
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

async function getNotifications(): Promise<NotificationItem[]> {
  const userId = await getUserId();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const data = (await getUserAdoptionNotifications(
    userId,
  )) as RawNotification[];

  const notifications = await Promise.all(
    data.map(async (item) => {
      const [shelter, pet] = await Promise.all([
        item.shelter_id
          ? fetchShelterById(item.shelter_id)
          : Promise.resolve(null),
        item.pet_id ? getPetById(item.pet_id) : Promise.resolve(null),
      ]);

      const shelterName = shelter?.shelter_name || "Unknown Shelter";
      const petName = pet?.pet_name || "Unknown Pet";
      const status = item.status as NotificationStatus;

      const content = buildNotificationContent(petName, shelterName, status);

      return {
        id: item.id,
        shelter: shelterName,
        petName,
        date: formatDate(item.updated_at ?? item.created_at),
        status,
        title: content.title,
        shortMessage: content.shortMessage,
        fullMessage: content.fullMessage,
      };
    }),
  );

  return notifications;
}

export default async function Page() {
  const notifications = await getNotifications();

  return <NotifClient notifications={notifications} />;
}

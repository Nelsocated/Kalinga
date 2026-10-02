import type { Metadata } from "next";
import ContentPage, { type ContentSection } from "@/src/components/content/ContentPage";
import { CONTACT_EMAIL, LEGAL_UPDATED } from "@/src/lib/constants/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "What Kalinga collects, who can see it, and how to have it deleted.",
};

const SECTIONS: ContentSection[] = [
  {
    id: "what-we-collect",
    title: "What we collect",
    content: (
      <>
        <p>We only collect what Kalinga needs to work:</p>
        <ul>
          <li>
            <strong>Your account:</strong> email address, password, username and full name. Our sign-in provider stores
            your password in a protected (hashed) form; we never see it.
          </li>
          <li>
            <strong>Your profile:</strong> anything you add, such as a photo, a short bio and contact details.
          </li>
          <li>
            <strong>Adoption requests:</strong> the full name, email, phone number, address, occupation and reason you
            enter, and the care confirmations you tick (for example, that you can afford food and vet visits).
          </li>
          <li>
            <strong>Shelter applications:</strong> the shelter&apos;s name and full address, its registration
            certificate, the owner&apos;s valid ID, the lease contract and a photo of the shelter.
          </li>
          <li>
            <strong>What shelters post:</strong> pet profiles, photos, videos, foster stories and donation details.
          </li>
          <li>
            <strong>Messages</strong> between you and shelters.
          </li>
          <li>
            <strong>Activity:</strong> the pets and shelters you like, and video views. A view records the video, the
            time and either your account or, if you aren&apos;t signed in, a random ID saved in your browser. We use
            views to show shelters how many people watch their videos.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "how-we-use-it",
    title: "How we use it",
    content: (
      <ul>
        <li>To run your account and keep you signed in.</li>
        <li>To show pets, videos and shelters in the feed and on profiles.</li>
        <li>To pass your adoption request to the shelter you sent it to, and to deliver messages.</li>
        <li>To check that shelters are real before they can post.</li>
        <li>To show shelters simple counts, like views and likes, on their posts.</li>
      </ul>
    ),
  },
  {
    id: "who-can-see-it",
    title: "Who can see what",
    content: (
      <ul>
        <li>
          <strong>Everyone:</strong> pet profiles, videos, foster stories, shelter profiles (including the shelter
          photo) and the donation details a shelter lists.
        </li>
        <li>
          <strong>Your profile page</strong> (name, username, photo, bio and the contact details on your profile) can
          be opened by anyone with its link. Shelters see it when you send them an adoption request.
        </li>
        <li>
          <strong>Adoption requests</strong> are seen only by you and the shelter you sent them to.
        </li>
        <li>
          <strong>Messages</strong> are seen only by you and the other side of the conversation.
        </li>
        <li>
          <strong>Shelter documents</strong> (registration certificate, owner&apos;s ID and lease) are kept in private
          storage. Only Kalinga admins can open them, through links that expire, to review the application.
        </li>
        <li>Your likes are not shown to other people.</li>
      </ul>
    ),
  },
  {
    id: "storage",
    title: "Where it's stored",
    content: (
      <p>
        Kalinga&apos;s database, sign-in and file storage run on Supabase, a cloud provider that stores the data on our
        behalf. We don&apos;t sell your data, and we don&apos;t use advertising or analytics trackers.
      </p>
    ),
  },
  {
    id: "cookies",
    title: "Cookies and browser storage",
    content: (
      <p>
        We use cookies only to keep you signed in. If you watch videos without signing in, your browser keeps a random
        ID so repeat views aren&apos;t counted twice. Clearing your browser&apos;s site data removes both.
      </p>
    ),
  },
  {
    id: "deleting",
    title: "Keeping and deleting your data",
    content: (
      <>
        <p>
          We keep your data while your account exists. You can delete your account from Settings. This removes your
          account, profile, likes, messages and adoption requests.
        </p>
        <p>
          Files you uploaded, such as a profile photo or shelter documents, may stay in storage after your account is
          deleted. Email us and we&apos;ll remove them.
        </p>
      </>
    ),
  },
  {
    id: "your-rights",
    title: "Your rights",
    content: (
      <>
        <p>
          You can ask to see the personal data we hold about you, correct it, or have it deleted. You can also object
          to how we use it. Email us and we&apos;ll reply as soon as we can.
        </p>
        <p>
          If you are in the Philippines, you have these rights under the Data Privacy Act of 2012, and you can complain
          to the National Privacy Commission if you think we have mishandled your data.
        </p>
      </>
    ),
  },
  {
    id: "security",
    title: "Security",
    content: (
      <p>
        Data travels over encrypted connections, private documents sit in storage that isn&apos;t public, and access
        to accounts and records is limited by role (adopter, shelter or admin). No system is perfectly secure, so if
        you notice something wrong, tell us.
      </p>
    ),
  },
  {
    id: "age",
    title: "Age",
    content: <p>Kalinga accounts are for people aged 18 and over. We don&apos;t knowingly collect data from children.</p>,
  },
  {
    id: "changes",
    title: "Changes to this policy",
    content: (
      <p>When we change this policy, we update the date at the top of this page.</p>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    content: (
      <p>
        For privacy questions or requests, email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <ContentPage
      title="Privacy Policy"
      intro="What Kalinga collects, who can see it, and how to have it deleted."
      updated={LEGAL_UPDATED}
      sections={SECTIONS}
    />
  );
}

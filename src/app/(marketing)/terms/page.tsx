import type { Metadata } from "next";
import Link from "next/link";
import ContentPage, { type ContentSection } from "@/src/components/content/ContentPage";
import { CONTACT_EMAIL, LEGAL_UPDATED } from "@/src/lib/constants/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "The rules for using Kalinga as an adopter or a shelter.",
};

const SECTIONS: ContentSection[] = [
  {
    id: "about-kalinga",
    title: "About Kalinga",
    content: (
      <>
        <p>
          Kalinga is a website where animal shelters share adoptable dogs and cats through profiles, short videos and
          foster stories, and where people can find those pets and ask to adopt them. Kalinga is built and run by the
          Kalinga team.
        </p>
        <p>
          By creating an account or using Kalinga, you agree to these terms. If you don&apos;t agree, please don&apos;t
          use Kalinga.
        </p>
      </>
    ),
  },
  {
    id: "accounts",
    title: "Your account",
    content: (
      <ul>
        <li>You must be at least 18 years old to create an account.</li>
        <li>Give accurate information when you sign up, apply to adopt or apply as a shelter.</li>
        <li>An account is for one person or one shelter. Don&apos;t share it or sign up as someone else.</li>
        <li>Keep your password private. You are responsible for what happens under your account.</li>
      </ul>
    ),
  },
  {
    id: "adoption-requests",
    title: "Adoption requests",
    content: (
      <>
        <p>
          Kalinga does not own, house or sell any of the animals shown on it. Each pet is cared for by the shelter that
          posted it.
        </p>
        <ul>
          <li>Sending an adoption request does not mean the pet is yours. The shelter decides who adopts each pet.</li>
          <li>Shelters may ask for more information, a visit, an interview or a fee, following their own process.</li>
          <li>The adoption itself is an agreement between you and the shelter. Kalinga is not a party to it.</li>
        </ul>
      </>
    ),
  },
  {
    id: "shelters",
    title: "Shelter accounts",
    content: (
      <>
        <p>
          Shelters apply with their registration certificate, the owner&apos;s valid ID, a lease contract and a photo
          of the shelter. A Kalinga admin reviews each application and may approve or reject it.
        </p>
        <ul>
          <li>Approved shelters must keep their pet profiles, videos and stories honest and up to date.</li>
          <li>Shelters are responsible for the care of their animals and for running adoptions lawfully.</li>
          <li>We may suspend or remove a shelter account that breaks these terms or misleads adopters.</li>
        </ul>
      </>
    ),
  },
  {
    id: "donations",
    title: "Donations to shelters",
    content: (
      <p>
        Shelters can list ways to donate, such as items they need or payment details. Kalinga does not collect,
        process or hold any money. A donation is between you and the shelter, so check the details before you give.
      </p>
    ),
  },
  {
    id: "content",
    title: "What you post",
    content: (
      <>
        <p>
          You keep ownership of the photos, videos, text and messages you post. You give Kalinga permission to store
          them and show them on Kalinga so the service can work, for as long as they stay on Kalinga.
        </p>
        <p>
          <strong>Don&apos;t post</strong> anything that is false or misleading, that you don&apos;t have the right to
          share, that harasses or threatens anyone, that shows cruelty to animals, or that breaks the law.
        </p>
        <p>We may remove content that breaks these terms.</p>
      </>
    ),
  },
  {
    id: "fair-use",
    title: "Using Kalinga fairly",
    content: (
      <ul>
        <li>Don&apos;t send spam or unwanted messages.</li>
        <li>Don&apos;t try to get into accounts or data that aren&apos;t yours, or interfere with how Kalinga runs.</li>
        <li>Don&apos;t copy content from Kalinga in bulk with automated tools.</li>
      </ul>
    ),
  },
  {
    id: "ending",
    title: "Closing your account",
    content: (
      <p>
        You can delete your account at any time from Settings. We may suspend or close an account that breaks these
        terms. What happens to your data is explained in the <Link href="/privacy">Privacy Policy</Link>.
      </p>
    ),
  },
  {
    id: "disclaimers",
    title: "Limits of our responsibility",
    content: (
      <>
        <p>
          Kalinga is provided as it is. We work to keep it running and accurate, but we can&apos;t promise it will
          always be available or free of errors.
        </p>
        <p>
          Information about each pet, including its health and behavior, comes from the shelter. To the extent the law
          allows, Kalinga is not responsible for an animal&apos;s health or behavior, for a shelter&apos;s decisions or
          conduct, or for any arrangement between adopters and shelters.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    title: "Changes to these terms",
    content: (
      <p>
        We may update these terms as Kalinga changes. When we do, we change the date at the top of this page. Using
        Kalinga after an update means you accept the new terms.
      </p>
    ),
  },
  {
    id: "law",
    title: "Governing law",
    content: <p>These terms are governed by the laws of the Republic of the Philippines.</p>,
  },
  {
    id: "contact",
    title: "Contact",
    content: (
      <p>
        Questions about these terms? Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <ContentPage
      title="Terms of Use"
      intro="The rules for using Kalinga, whether you're looking for a pet or helping pets find homes."
      updated={LEGAL_UPDATED}
      sections={SECTIONS}
    />
  );
}

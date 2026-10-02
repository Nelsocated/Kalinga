import type { Metadata } from "next";
import Link from "next/link";
import { CaretDown } from "@phosphor-icons/react/dist/ssr";
import ContentPage, { type ContentSection } from "@/src/components/content/ContentPage";
import { CONTACT_EMAIL } from "@/src/lib/constants/site";

export const metadata: Metadata = {
  title: "Help",
  description: "Answers for adopters and shelters: finding pets, adoption requests, shelter approval and your account.",
};

type Faq = { q: string; a: React.ReactNode };

/** Native disclosure rows: keyboard and screen-reader friendly, open without JS. */
function FaqList({ items }: { items: Faq[] }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item) => (
        <details key={item.q} className="group">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-lg font-semibold text-ink [&::-webkit-details-marker]:hidden">
            {item.q}
            <CaretDown
              size={20}
              aria-hidden="true"
              className="shrink-0 transition-transform duration-200 ease-out-expo group-open:rotate-180"
            />
          </summary>
          <div className="flex flex-col gap-3 pb-5">{item.a}</div>
        </details>
      ))}
    </div>
  );
}

const ADOPTERS: Faq[] = [
  {
    q: "Do I need an account to look around?",
    a: (
      <p>
        No. Anyone can watch the feed and open pet and shelter profiles. You need an account to like pets, message
        shelters and apply to adopt.
      </p>
    ),
  },
  {
    q: "How do I find a pet?",
    a: (
      <p>
        Scroll the <Link href="/site/home">For You</Link> feed, browse <Link href="/site/explore">Explore</Link>, or open
        a shelter from the <Link href="/site/shelters">Shelters</Link> list. On Explore, Lookup filters pets by what you&apos;re looking for.
      </p>
    ),
  },
  {
    q: "How do I apply to adopt?",
    a: (
      <>
        <p>
          Open the pet&apos;s profile and choose <strong>Apply to adopt</strong>. Fill in your details, tell the shelter
          why you&apos;d like to adopt, and confirm you can care for the pet. You can send one request per pet.
        </p>
        <p>The shelter decides who adopts each pet and may contact you for more information or a visit.</p>
      </>
    ),
  },
  {
    q: "What do the statuses on my requests mean?",
    a: (
      <>
        <p>Your requests and their status are on your Notifications page.</p>
        <ul>
          <li><strong>Submitted:</strong> the shelter has your request.</li>
          <li><strong>Under review:</strong> the shelter is looking at it.</li>
          <li><strong>Contacting:</strong> the shelter is getting in touch with you.</li>
          <li><strong>Approved</strong> or <strong>Not approved:</strong> the shelter&apos;s decision.</li>
          <li><strong>Adopted:</strong> the pet has gone home.</li>
          <li><strong>Withdrawn:</strong> the request was withdrawn.</li>
        </ul>
      </>
    ),
  },
  {
    q: "How do I message a shelter?",
    a: (
      <p>
        Like the shelter first, then open Messages and choose <strong>New message</strong>. Shelters you&apos;ve liked
        show up as recipients.
      </p>
    ),
  },
];

const SHELTERS: Faq[] = [
  {
    q: "How does my shelter join Kalinga?",
    a: (
      <>
        <p>
          <Link href="/shelterSignup">Apply as a shelter</Link> with your shelter&apos;s name and full address, your
          registration certificate, the owner&apos;s valid ID, your lease contract and a photo of the shelter.
        </p>
        <p>A Kalinga admin reviews every application. Your shelter can post once it&apos;s approved.</p>
      </>
    ),
  },
  {
    q: "Who sees our documents?",
    a: (
      <p>
        Only Kalinga admins, to verify your shelter. The documents are kept in private storage and are never shown on
        your profile. The shelter photo is the only upload that appears publicly.
      </p>
    ),
  },
  {
    q: "What can we post?",
    a: (
      <p>
        From Create you can <strong>Add a pet</strong>, <strong>Post a video</strong> of a pet, or <strong>Write a
        foster story</strong>. Videos go into the feed, where people can like them and open the pet&apos;s profile.
      </p>
    ),
  },
  {
    q: "Where do adoption requests show up?",
    a: (
      <p>
        On your Notifications page, with each applicant&apos;s details. Your dashboard shows total views, likes and
        completed adoptions.
      </p>
    ),
  },
];

const ACCOUNT: Faq[] = [
  {
    q: "How do I change my password?",
    a: <p>Go to Settings, confirm your email and current password, then set a new one.</p>,
  },
  {
    q: "How do I delete my account?",
    a: (
      <p>
        Go to Settings and choose <strong>Delete account</strong> under Danger zone. This removes your profile, likes,
        messages and adoption requests, and can&apos;t be undone. The <Link href="/privacy">Privacy Policy</Link> has
        the details.
      </p>
    ),
  },
];

const SECTIONS: ContentSection[] = [
  { id: "adopters", title: "For adopters", content: <FaqList items={ADOPTERS} /> },
  { id: "shelters", title: "For shelters", content: <FaqList items={SHELTERS} /> },
  { id: "account", title: "Your account", content: <FaqList items={ACCOUNT} /> },
  {
    id: "contact",
    title: "Still stuck?",
    content: (
      <p>
        Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and tell us what you were trying to do.
      </p>
    ),
  },
];

export default function HelpPage() {
  return (
    <ContentPage
      title="Help"
      intro="Quick answers about finding pets, applying to adopt and running a shelter on Kalinga."
      sections={SECTIONS}
    />
  );
}

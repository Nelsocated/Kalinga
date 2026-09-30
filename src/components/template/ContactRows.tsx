import { EnvelopeSimple, Phone } from "@phosphor-icons/react/dist/ssr";

/** Email and phone as tappable rows; renders a note when neither is set. */
export default function ContactRows({
  email,
  phone,
  emptyText = "No contact details yet.",
}: {
  email?: string | null;
  phone?: string | null;
  emptyText?: string;
}) {
  if (!email && !phone) return <p className="text-sm text-muted">{emptyText}</p>;

  const row =
    "flex w-fit max-w-full items-center gap-2 rounded-full py-1 text-sm font-medium text-ink underline-offset-4 hover:underline";

  return (
    <div className="flex flex-col gap-1">
      {email ? (
        <a href={`mailto:${email}`} className={row}>
          <EnvelopeSimple size={18} aria-hidden="true" className="shrink-0" />
          <span className="truncate">{email}</span>
        </a>
      ) : null}
      {phone ? (
        <a href={`tel:${phone.replace(/\s+/g, "")}`} className={row}>
          <Phone size={18} aria-hidden="true" className="shrink-0" />
          <span className="truncate">{phone}</span>
        </a>
      ) : null}
    </div>
  );
}

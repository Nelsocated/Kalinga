import Link from "next/link";
import ChangePasswordView from "@/src/components/views/ChangePasswordView";
import DeleteAccountView from "@/src/components/views/DeleteAccountView";
import WebTemplate from "@/src/components/template/WebTemplate";
import LogoutButton from "@/src/components/ui/LogoutButton";

/** One settings group; groups sit in the page panel, split by Line dividers (no cards in the card). */
function SettingsSection({
  title,
  description,
  children,
  danger = false,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <section className="py-6 first:pt-2 last:pb-0">
      <h2 className={danger ? "text-lg font-semibold text-reject-text" : "text-lg font-semibold text-ink"}>{title}</h2>
      {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}
      <div className="mt-5">{children}</div>
    </section>
  );
}

const linkClass = "text-sm font-medium text-ink underline-offset-4 hover:underline";

export default function SettingsPage() {
  return (
    <WebTemplate
      header="Settings"
      main={
        <div className="flex max-w-2xl flex-col divide-y divide-line">
          <SettingsSection title="Password" description="Confirm your account email and current password to set a new one.">
            <ChangePasswordView />
          </SettingsSection>

          <SettingsSection title="Session">
            <LogoutButton className="w-fit" />
          </SettingsSection>

          <SettingsSection title="About Kalinga">
            <nav aria-label="Kalinga pages" className="flex flex-wrap gap-x-5 gap-y-2">
              <Link href="/about" className={linkClass}>About</Link>
            </nav>
          </SettingsSection>

          <SettingsSection title="Danger zone" description="Permanently delete your Kalinga account." danger>
            <DeleteAccountView />
          </SettingsSection>
        </div>
      }
    />
  );
}

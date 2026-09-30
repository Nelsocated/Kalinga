import Link from "next/link";
import ChangePasswordView from "@/src/components/views/ChangePasswordView";
import DeleteAccountView from "@/src/components/views/DeleteAccountView";
import WebTemplate from "@/src/components/template/WebTemplate";
import LogoutButton from "@/src/components/ui/LogoutButton";
import Card from "@/src/components/ui/Card";

function SettingsCard({
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
    <Card className={danger ? "border-reject/30 p-5 sm:p-6" : "p-5 sm:p-6"}>
      <h2 className={danger ? "text-lg font-semibold text-reject-text" : "text-lg font-semibold text-ink"}>{title}</h2>
      {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}
      <div className="mt-5">{children}</div>
    </Card>
  );
}

const linkClass = "text-sm font-medium text-ink underline-offset-4 hover:underline";

export default function SettingsPage() {
  return (
    <WebTemplate
      header="Settings"
      main={
        <div className="flex max-w-2xl flex-col gap-5">
          <SettingsCard title="Password" description="Confirm your account email and current password to set a new one.">
            <ChangePasswordView />
          </SettingsCard>

          <SettingsCard title="Session">
            <LogoutButton className="w-fit" />
          </SettingsCard>

          <SettingsCard title="About Kalinga">
            <nav aria-label="Kalinga pages" className="flex flex-wrap gap-x-5 gap-y-2">
              <Link href="/about" className={linkClass}>About</Link>
            </nav>
          </SettingsCard>

          <SettingsCard title="Danger zone" description="Permanently delete your Kalinga account." danger>
            <DeleteAccountView />
          </SettingsCard>
        </div>
      }
    />
  );
}

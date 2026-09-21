import { ProfileForm } from "@/components/profile-form";
import { SiteShell } from "@/components/site-shell";
import { getSettings } from "@/lib/queries";

export default async function ProfilePage() {
  const site = await getSettings();

  return (
    <SiteShell className="py-8 md:py-10">
      <p className="kicker">Presence</p>
      <h1 className="mt-2 mb-8 font-display text-4xl">Profile & portrait</h1>
      <ProfileForm
        displayName={site.displayName}
        tagline={site.tagline}
        bio={site.bio}
        portraitPath={site.portraitPath}
        welcomeLine={site.welcomeLine}
        titleLine={site.titleLine}
        accentWord={site.accentWord}
        closingNote={site.closingNote}
      />
    </SiteShell>
  );
}

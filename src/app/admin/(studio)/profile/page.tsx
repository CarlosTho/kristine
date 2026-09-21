import { ProfileForm } from "@/components/profile-form";
import { getSettings } from "@/lib/queries";

export default async function ProfilePage() {
  const site = await getSettings();

  return (
    <div className="site-shell ml-[3.75rem] mr-4 w-[min(1120px,calc(100%-4.75rem))] py-8 md:ml-[5.75rem] md:mr-8 md:w-[min(1120px,calc(100%-7.75rem))] md:py-10">
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
    </div>
  );
}

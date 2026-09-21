import type { Metadata } from "next";
import { Instrument_Serif, Sora } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getSettings } from "@/lib/queries";
import { isAdmin } from "@/lib/auth";
import { JsonLd } from "@/components/json-ld";
import { rootMetadata } from "@/lib/seo";
import { websiteGraph } from "@/lib/structured-data";
import "./globals.css";

const display = Instrument_Serif({
  variable: "--font-display-face",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const sans = Sora({
  variable: "--font-sans-face",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  return rootMetadata(await getSettings());
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const site = await getSettings();
  const admin = await isAdmin();

  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="relative min-h-full flex flex-col" suppressHydrationWarning>
        <JsonLd data={websiteGraph(site)} />
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
          <span className="absolute inset-y-0 left-[2.15rem] w-0.5 bg-[#c43e3e]/55 md:left-[3.9rem]" />
          <div className="absolute top-6 left-2 flex flex-col items-center gap-24 md:left-5 md:gap-52">
            {Array.from({ length: 28 }, (_, index) => (
              <span
                key={index}
                className="size-3.5 shrink-0 rounded-full bg-[#d4c6b2] ring-1 ring-[#8a7d70] md:size-6"
              />
            ))}
          </div>
        </div>
        <SiteHeader name={site.displayName} isAdmin={admin} />
        <main className="relative z-10 min-w-0 flex-1 overflow-x-clip">{children}</main>
        <SiteFooter name={site.displayName} isAdmin={admin} closingNote={site.closingNote} />
      </body>
    </html>
  );
}

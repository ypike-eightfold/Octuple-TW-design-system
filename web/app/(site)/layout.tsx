export default function SiteLayout({ children }: { children: React.ReactNode }) {
  // No width constraint here. The homepage hero wants to render full-bleed,
  // so each individual page is responsible for adding its own readable
  // wrapper (mx-auto max-w-6xl px-6 py-10) where appropriate.
  return <>{children}</>;
}

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  // Constrains landing, gallery, docs, signin to the readable width.
  // /components is OUTSIDE this route group so it can render full-width
  // (the component catalog has full-width Navbar examples).
  return <div className="mx-auto max-w-6xl px-6 py-10">{children}</div>;
}

import App from "./App";

export const metadata = {
  title: "Components — Eightfold Design System",
};

// Renders the catalog full-width. The route is outside the (site) route group,
// so it isn't constrained by the max-w-6xl wrapper that landing/gallery use.
export default function ComponentsPage() {
  return <App />;
}

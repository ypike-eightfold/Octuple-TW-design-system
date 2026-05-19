/** @type {import('next').NextConfig} */
const nextConfig = {
  // Designs are static HTML in /public/content/designs/<category>/<slug>/index.html.
  // We serve them in an iframe from the design detail page. They are NOT framed
  // from any other origin — so a same-origin iframe policy is fine.
  // Keep images unoptimized for thumbnails so the gallery can grow without
  // touching next/image config.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

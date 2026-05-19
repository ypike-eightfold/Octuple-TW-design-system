import { handlers } from "@/auth";

// Auth.js v5 exposes the route handlers under a single `handlers` object.
// Destructure them here so /api/auth/* serves the standard endpoints.
export const { GET, POST } = handlers;

import { createCookie } from "@remix-run/node"; // or cloudflare/deno

export const activity = createCookie("activity", {
  maxAge: 604_800, // one week
});
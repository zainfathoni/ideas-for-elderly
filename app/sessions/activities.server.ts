import { createCookieSessionStorage } from "@remix-run/node";
import { Activity } from "~/models/chat-gpt";

type SessionData = {
  data: Activity[];
};

type SessionFlashData = {
  error: string;
};

export const activitiesCookie = createCookieSessionStorage<
  SessionData,
  SessionFlashData
>({
  // a Cookie from `createCookie` or the CookieOptions to create one
  cookie: {
    name: "activities",
    httpOnly: true,
    // one week
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET ?? "any-random-string-would-do"],
    secure: true,
  },
});

import { createCookieSessionStorage } from "@remix-run/node";
import { Info } from "~/models/chat-gpt";

type SessionData = {
  data: Info;
};

type SessionFlashData = {
  error: string;
};

export const infoCookie = createCookieSessionStorage<
  SessionData,
  SessionFlashData
>({
  // a Cookie from `createCookie` or the CookieOptions to create one
  cookie: {
    name: "info",
    httpOnly: true,
    // one week
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET ?? "any-random-string-would-do"],
    secure: true,
  },
});

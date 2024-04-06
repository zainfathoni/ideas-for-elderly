import { createCookieSessionStorage } from "@remix-run/node";
import { DetailedActivity } from "~/models/chat-gpt";

type SessionData = {
  "0": DetailedActivity;
  "1": DetailedActivity;
  "2": DetailedActivity;
};

type SessionFlashData = {
  error: string;
};

export const activityCookie = createCookieSessionStorage<
  SessionData,
  SessionFlashData
>({
  cookie: {
    name: "activity",
    httpOnly: true,
    // one week
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
    sameSite: "lax",
    secrets: ["s3cret1"],
    secure: true,
  },
});

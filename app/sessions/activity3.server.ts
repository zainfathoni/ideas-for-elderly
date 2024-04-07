import { createCookieSessionStorage } from "@remix-run/node";
import { DetailedActivity } from "~/models/chat-gpt";

type SessionData = {
  data: DetailedActivity;
};

type SessionFlashData = {
  error: string;
};

export const activity3Cookie = createCookieSessionStorage<
  SessionData,
  SessionFlashData
>({
  cookie: {
    name: "activity_3",
    httpOnly: true,
    // one week
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
    sameSite: "lax",
    secrets: ["s3cret1"],
    secure: true,
  },
});

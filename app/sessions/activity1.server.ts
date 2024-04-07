import { createCookieSessionStorage } from "@remix-run/node";
import { DetailedActivity } from "~/models/chat-gpt";

type SessionData = {
  data: DetailedActivity;
};

type SessionFlashData = {
  error: string;
};

export const activity1Cookie = createCookieSessionStorage<
  SessionData,
  SessionFlashData
>({
  cookie: {
    name: "activity_1",
    httpOnly: true,
    // one week
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
    sameSite: "lax",
    secrets: ["s3cret1"],
    secure: true,
  },
});

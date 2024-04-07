import { activity1Cookie } from "./activity1.server";
import { activity2Cookie } from "./activity2.server";
import { activity3Cookie } from "./activity3.server";

export const pickActivityCookie = (index: number) => {
  switch (index) {
    case 0:
      return activity1Cookie;
    case 1:
      return activity2Cookie;
    case 2:
      return activity3Cookie;
    default:
      return null;
  }
};

import {
  BuildingLibraryIcon,
  ClockIcon,
  CloudIcon,
  MapPinIcon,
  StarIcon,
} from "@heroicons/react/20/solid";
import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { DetailedActivity } from "~/models/chat-gpt";
import { pickActivityCookie } from "~/sessions/activity.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { index } = params;
  if (!index || (index !== "0" && index !== "1" && index !== "2")) {
    // Redirect to the activities page if the index is invalid.
    return redirect("/activities");
  }

  const activityCookie = pickActivityCookie(parseInt(index));
  if (!activityCookie) {
    // Redirect to the activities page if the index is invalid.
    return redirect("/activities");
  }

  const activitySession = await activityCookie.getSession(
    request.headers.get("Cookie"),
  );

  if (!activitySession.has("data")) {
    // Redirect to the activities page if there is no element in the index.
    return redirect("/activities");
  }

  return json({ activity: activitySession.get("data") });
};

export default function Activity() {
  const { activity } = useLoaderData<{
    activity: DetailedActivity;
  }>();
  console.debug(activity);

  return (
    <div className="relative bg-white">
      <div className="mx-auto max-w-7xl">
        <div className="">
          <div className="relative h-80">
            <img
              className="absolute inset-0 h-full w-full bg-gray-50 object-cover rounded-b-lg"
              src={`https://picsum.photos/seed/${activity.name}/720/320`}
              alt=""
            />
          </div>
        </div>
        <div className="px-6">
          <div className="mx-auto max-w-2xl pb-24 pt-16 sm:pb-32 sm:pt-20">
            <p className="text-base font-semibold leading-7 text-indigo-600">
              {activity.int}
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {activity.name}
            </h1>
            <p className="mt-6 text-xl leading-8 text-gray-700">
              {activity.desc}
            </p>
            <div className="mt-10 max-w-xl text-base leading-7 text-gray-700">
              <p>{activity.steps}</p>
              <ul className="mt-8 space-y-8 text-gray-600">
                <li className="flex gap-x-3">
                  <BuildingLibraryIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" />
                  <span>
                    <strong className="font-semibold text-gray-900">
                      Potential Service Provider
                    </strong>
                    .{" "}
                    {activity.provLink?.length ? (
                      <a
                        target="_blank"
                        rel="noreferrer noopener"
                        href={activity.provLink}
                        className="hover:text-gray-900 hover:underline"
                      >
                        {activity.prov}
                      </a>
                    ) : (
                      <span>{activity.prov}</span>
                    )}
                  </span>
                </li>
                <li className="flex gap-x-3">
                  <MapPinIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" />
                  <span>
                    <strong className="font-semibold text-gray-900">
                      Potential Location
                    </strong>
                    . {activity.loc}
                  </span>
                </li>
                <li className="flex gap-x-3">
                  <ClockIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" />
                  <span>
                    <strong className="font-semibold text-gray-900">
                      Suitable Timing
                    </strong>
                    . {activity.time}
                  </span>
                </li>
                <li className="flex gap-x-3">
                  <CloudIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" />
                  <span>
                    <strong className="font-semibold text-gray-900">
                      Appropriate Weather
                    </strong>
                    . {activity.aptWeather}
                  </span>
                </li>
                <li className="flex gap-x-3">
                  <StarIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" />
                  <span>
                    <strong className="font-semibold text-gray-900">
                      Potential Rewards
                    </strong>
                    . {activity.pts}
                  </span>
                </li>
              </ul>
              <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">
                Things to prepare
              </h2>
              <p className="mt-6">{activity.things}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

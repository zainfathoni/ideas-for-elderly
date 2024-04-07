import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import { ChatGPTResponse, DetailedActivity } from "~/models/chat-gpt";
import { getActivityPrompt } from "~/services/ai";
import { activitiesCookie } from "~/sessions/activities.server";
import { activityCookie } from "~/sessions/activity.server";
import { infoCookie } from "~/sessions/info.server";
import { classNames } from "~/utils/class-names";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const infoSession = await infoCookie.getSession(
    request.headers.get("Cookie"),
  );
  const activitiesSession = await activitiesCookie.getSession(
    request.headers.get("Cookie"),
  );

  if (!infoSession.has("data") || !activitiesSession.has("data")) {
    // Redirect to the info page if there are either missing info or activities.
    return redirect("/info");
  }

  return json({
    info: infoSession.get("data"),
    activities: activitiesSession.get("data"),
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const activitiesSession = await activitiesCookie.getSession(
    request.headers.get("Cookie"),
  );

  const form = await request.formData();
  const method = form.get("_method");
  if (method === "delete") {
    const activitySession = await activityCookie.getSession(
      request.headers.get("Cookie"),
    );
    return redirect("/info", {
      headers: [
        // Remove the activity-related session cookies
        [
          "Set-Cookie",
          await activitiesCookie.destroySession(activitiesSession),
        ],
        ["Set-Cookie", await activityCookie.destroySession(activitySession)],
      ],
    });
  }

  const index = form.get("index") as string | null;
  if (index && (index === "0" || index === "1" || index === "2")) {
    const activities = activitiesSession.get("data");
    const activity = activities?.[parseInt(index)];
    if (!activity) {
      return null;
    }

    const activitySession = await activityCookie.getSession(
      request.headers.get("Cookie"),
    );
    if (activitySession.has(index)) {
      // Redirect to the activity page if the activity is already elaborated.
      return redirect(`/activity/${index}`);
    }

    const response: ChatGPTResponse = await getActivityPrompt(activity);
    const detailedActivity: DetailedActivity = JSON.parse(
      response.choices[0].message.content,
    );

    activitySession.set(index, {
      ...activity,
      ...detailedActivity,
    });

    return redirect(`/activity/${index}`, {
      headers: {
        "Set-Cookie": await activityCookie.commitSession(activitySession),
      },
    });
  }

  return null;
};

export default function Activities() {
  const { info, activities } = useLoaderData<typeof loader>();

  const navigation = useNavigation();
  const loading = navigation.state === "submitting";
  const loadingIndex = navigation.formData?.get("index") ?? -1;
  console.debug("Loading Index: ", loadingIndex);

  if (!info || !activities) {
    return null;
  }

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-4xl">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Recommended Activities
          </h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            Hi, {info.name}. Here are some activities suitable for a(n){" "}
            {info.age} years old with {info.interests} interest(s) and is
            willing to go {info.physical}.
          </p>
          <Form method="post">
            <input type="hidden" name="_method" value="delete" />
            <button
              type="submit"
              className="mt-2 text-sm font-semibold leading-6 text-gray-700 hover:text-gray-500"
            >
              Generate new recommendations<span aria-hidden="true">→</span>
            </button>
          </Form>
          <div className="mt-16 space-y-20 lg:mt-20 lg:space-y-20">
            {activities.map(
              ({ name, time, int, loc, prov, provLink, desc }, index) => (
                <Form key={name} method="post">
                  <article className="relative isolate flex flex-col gap-8 lg:flex-row">
                    <div className="relative aspect-[16/9] sm:aspect-[2/1] lg:aspect-square lg:w-64 lg:shrink-0">
                      <img
                        src={`https://picsum.photos/seed/${name}/256/256`}
                        alt={desc}
                        className="absolute inset-0 h-full w-full rounded-2xl bg-gray-50 object-cover"
                      />
                      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
                    </div>
                    <div>
                      <div className="flex items-center gap-x-4 text-xs">
                        <span className="text-gray-500">{time}</span>
                        <span className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100">
                          {int}
                        </span>
                      </div>
                      <div className="group relative max-w-xl">
                        <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                          <span className="absolute inset-0" />
                          {name}
                        </h3>
                        <p className="mt-5 text-sm leading-6 text-gray-600">
                          {desc}
                        </p>
                      </div>
                      <div className="mt-6 flex border-t border-gray-900/5 pt-6">
                        <div className="relative flex items-center gap-x-4 w-full justify-between">
                          <div className="relative flex items-center gap-x-4">
                            <img
                              src={`https://picsum.photos/seed/${prov}/40/40`}
                              alt=""
                              className="h-10 w-10 rounded-full bg-gray-50"
                            />
                            <div className="text-sm leading-6">
                              <p className="font-semibold text-gray-900">
                                {provLink?.length ? (
                                  <a
                                    target="_blank"
                                    rel="noreferrer noopener"
                                    href={provLink}
                                    className="group hover:text-gray-600"
                                  >
                                    <span className="absolute inset-0" />
                                    {prov}
                                  </a>
                                ) : (
                                  <span>
                                    <span className="absolute inset-0" />
                                    {prov}
                                  </span>
                                )}
                              </p>
                              <p className="text-gray-600">{loc}</p>
                            </div>
                          </div>
                          <input type="hidden" name="index" value={index} />
                          <button
                            type="submit"
                            disabled={loading}
                            className={classNames(
                              "ml-auto rounded bg-white px-2 py-1 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50",
                              loading ? "cursor-not-allowed bg-gray-50" : "",
                            )}
                          >
                            {/* FIXME: Somehow the loadingIndex is not equal index */}
                            {loading && loadingIndex === index
                              ? "Elaborating..."
                              : "Elaborate more"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                </Form>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

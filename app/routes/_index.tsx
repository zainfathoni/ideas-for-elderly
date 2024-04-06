import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { Form, Link, redirect, useLoaderData } from "@remix-run/react";
import { activitiesCookie } from "~/sessions/activities.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Ideas for Elderly" },
    {
      name: "description",
      content: "Get activity recommendations for elderly.",
    },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const activitiesSession = await activitiesCookie.getSession(
    request.headers.get("Cookie"),
  );

  return { hasActivities: activitiesSession.has("data") };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const activitiesSession = await activitiesCookie.getSession(
    request.headers.get("Cookie"),
  );
  return redirect("/info", {
    headers: {
      "Set-Cookie": await activitiesCookie.destroySession(activitiesSession),
    },
  });
};

export default function Index() {
  const { hasActivities } = useLoaderData<typeof loader>();
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Ideas for Elderly.
          <br />
          Start getting our recommendations today.
        </h2>
        <div className="mt-10 flex items-center gap-x-6">
          <Form method="post">
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Get started
            </button>
          </Form>
          {hasActivities ? (
            <Link
              to="/activities"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Explore our recent recommendations
              <span aria-hidden="true">→</span>
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}

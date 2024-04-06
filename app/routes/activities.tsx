import { LoaderFunction, json, redirect } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { useEffect } from "react";
import { Activity, Message } from "~/models/chat-gpt";
import { activity } from "../utils/cookies.server";

export const loader: LoaderFunction = async ({ request }) => {
  const cookieHeader = request.headers.get("Cookie");
  const cookie: Message | null = (await activity.parse(cookieHeader)) || {};

  console.log(cookie);

  if (!cookie) {
    return redirect("/");
  }

  return json({ activity: cookie });
};

export default function Activities() {
  const navigate = useNavigate();
  const { activity } = useLoaderData<{ activity: Message | null }>();
  console.log(activity);

  const content = activity?.content;
  console.log(content);

  useEffect(() => {
    if (!content) {
      navigate("/");
    }
  }, [content, navigate]);

  if (!content) {
    return null;
  }

  const parsedContent: Activity[] = JSON.parse(content);
  console.log(parsedContent);
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-4xl">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Recommended Activities
          </h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            Here are some activities that you can do with your constraints.
          </p>
          <div className="mt-16 space-y-20 lg:mt-20 lg:space-y-20">
            {parsedContent.map(({ Title, Description }) => (
              <article
                key={Title}
                className="relative isolate flex flex-col gap-8 lg:flex-row"
              >
                <div className="relative aspect-[16/9] sm:aspect-[2/1] lg:aspect-square lg:w-64 lg:shrink-0">
                  <img
                    src={`https://picsum.photos/seed/${Title}/256/256`}
                    alt={Description}
                    className="absolute inset-0 h-full w-full rounded-2xl bg-gray-50 object-cover"
                  />
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
                </div>
                <div>
                  <div className="group relative max-w-xl">
                    <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                      <span className="absolute inset-0" />
                      {Title}
                    </h3>
                    <p className="mt-5 text-sm leading-6 text-gray-600">
                      {Description}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

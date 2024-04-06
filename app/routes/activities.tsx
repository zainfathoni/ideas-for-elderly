import { LoaderFunction, json, redirect } from "@remix-run/node";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import { useEffect } from "react";
import { Activity, Info, Message } from "~/models/chat-gpt";
import { activities } from "../utils/cookies.server";

export const loader: LoaderFunction = async ({ request }) => {
  const cookieHeader = request.headers.get("Cookie");
  const cookie: { info: Info; message: Message } | null =
    (await activities.parse(cookieHeader)) || {};

  console.log(cookie);

  if (!cookie) {
    return redirect("/");
  }

  return json(cookie);
};

export default function Activities() {
  const navigate = useNavigate();
  const { info, message } = useLoaderData<{
    info: Info;
    message: Message;
  }>();
  console.log(info);

  const content = message?.content;
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
            Hi, {info.name}. Here are some activities that for a(n) {info.age}{" "}
            years old with {info.interests} interests and is willing to go{" "}
            {info.physical}.
          </p>
          <Link
            to="/info"
            className="mt-2 text-sm font-semibold leading-6 text-gray-700 hover:text-gray-500"
          >
            Generate new recommendations<span aria-hidden="true">→</span>
          </Link>
          <div className="mt-16 space-y-20 lg:mt-20 lg:space-y-20">
            {parsedContent.map(
              ({
                Title,
                Timing,
                Interest,
                Location,
                Potential_Service_Provider,
                Link_To_Potential_Service_Provider,
                Description,
              }) => (
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
                    <div className="flex items-center gap-x-4 text-xs">
                      <span className="text-gray-500">{Timing}</span>
                      <span className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100">
                        {Interest}
                      </span>
                    </div>
                    <div className="group relative max-w-xl">
                      <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                        <span className="absolute inset-0" />
                        {Title}
                      </h3>
                      <p className="mt-5 text-sm leading-6 text-gray-600">
                        {Description}
                      </p>
                    </div>
                    <div className="mt-6 flex border-t border-gray-900/5 pt-6">
                      <div className="relative flex items-center gap-x-4">
                        <img
                          src={`https://picsum.photos/seed/${Potential_Service_Provider}/40/40`}
                          alt=""
                          className="h-10 w-10 rounded-full bg-gray-50"
                        />
                        <div className="text-sm leading-6">
                          <p className="font-semibold text-gray-900">
                            {Link_To_Potential_Service_Provider?.length ? (
                              <a
                                target="_blank"
                                rel="noreferrer noopener"
                                href={Link_To_Potential_Service_Provider}
                                className="group hover:text-gray-600"
                              >
                                <span className="absolute inset-0" />
                                {Potential_Service_Provider}
                              </a>
                            ) : (
                              <span>
                                <span className="absolute inset-0" />
                                {Potential_Service_Provider}
                              </span>
                            )}
                          </p>
                          <p className="text-gray-600">{Location}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

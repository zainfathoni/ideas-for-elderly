import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Ideas for Elderly" },
    {
      name: "description",
      content: "Get activity recommendations for elderly.",
    },
  ];
};

export default function Index() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Ideas for Elderly.
          <br />
          Start getting our recommendations today.
        </h2>
        <div className="mt-10 flex items-center gap-x-6">
          <Link
            to="/info"
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Get started
          </Link>
          <Link
            to="/activities"
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Explore our recent recommendations<span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

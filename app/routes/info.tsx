import { RadioGroup } from "@headlessui/react";
import { ActionFunction, redirect } from "@remix-run/node";
import { Form, Link, useNavigation } from "@remix-run/react";
import { useState } from "react";
import { ChatGPTResponse } from "~/models/chat-gpt";
import { getPrompt } from "~/services/ai";
import { activity } from "../utils/cookies.server";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const name = form.get("name");
  const year_of_birth = parseInt(
    (form.get("year_of_birth") as string) ?? "0",
    10,
  );
  const physical = form.get("physical");
  const interests = form.get("interests");

  if (typeof name !== "string") {
    throw new Error("Invalid first name");
  }

  if (
    typeof year_of_birth !== "number" ||
    year_of_birth < 1900 ||
    year_of_birth > 2021
  ) {
    throw new Error("Invalid year of birth");
  }

  if (typeof physical !== "string") {
    throw new Error("Invalid physical capability");
  }

  if (typeof interests !== "string") {
    throw new Error("Please input at least one interest");
  }

  const age = new Date().getFullYear() - year_of_birth;
  const response: ChatGPTResponse = await getPrompt({
    age,
    physical,
    interests,
  });
  console.log(response.choices[0].message);

  return redirect("/activities", {
    headers: {
      // TODO: Store the info in the cookie, too
      "Set-Cookie": await activity.serialize(response.choices[0].message),
    },
  });
};

const settings = [
  {
    name: "My HDB Block",
    description: "Around my HDB block only",
  },
  {
    name: "My Neighbourhood",
    description: "Around my neighbourhood only",
  },
  {
    name: "My Town",
    description: "Anywhere within my town",
  },
  {
    name: "Within Singapore",
    description: "Anywhere in Singapore",
  },
  {
    name: "Abroad",
    description: "Anywhere in the world",
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Info() {
  const [selected, setSelected] = useState(settings[0]);

  const navigation = useNavigation();
  const loading = navigation.state === "submitting";

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
      <div className="px-4 sm:px-0">
        <h2 className="text-base font-semibold leading-7 text-gray-900">
          Personal Information
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Tell us about yourself so we can better assist you.
        </p>
      </div>

      <Form
        method="post"
        className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2"
      >
        <div className="px-4 py-6 sm:p-8">
          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label
                htmlFor="first-name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="name"
                  id="name"
                  autoComplete="given-name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Fulan"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="year_of_birth"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Year of Birth
              </label>
              <div className="mt-2">
                <input
                  id="year_of_birth"
                  name="year_of_birth"
                  type="number"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  autoComplete="bday-year"
                  placeholder="YYYY"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label
                htmlFor="interests"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                What do you like?
              </label>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Separate your answers with a comma (,)
              </p>
              <div className="mt-2">
                <textarea
                  rows={4}
                  name="interests"
                  id="interest"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  defaultValue={""}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="sm:col-span-6 sm:col-start-1">
              <label
                htmlFor="physical"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Physical Ability
              </label>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                How far are you willing to go?
              </p>
              <input
                type="hidden"
                name="physical"
                disabled={loading}
                value={selected.description}
              ></input>
              <div className="mt-2">
                <RadioGroup
                  value={selected}
                  onChange={loading ? () => {} : setSelected}
                >
                  <RadioGroup.Label className="sr-only">
                    Physical Ability
                  </RadioGroup.Label>
                  <div className="-space-y-px rounded-md bg-white">
                    {settings.map((setting, settingIdx) => (
                      <RadioGroup.Option
                        key={setting.name}
                        value={setting}
                        className={({ checked }) =>
                          classNames(
                            settingIdx === 0
                              ? "rounded-tl-md rounded-tr-md"
                              : "",
                            settingIdx === settings.length - 1
                              ? "rounded-bl-md rounded-br-md"
                              : "",
                            checked
                              ? "z-10 border-indigo-200 bg-indigo-50"
                              : "border-gray-200",
                            "relative flex cursor-pointer border p-4 focus:outline-none",
                          )
                        }
                      >
                        {({ active, checked }) => (
                          <>
                            <span
                              className={classNames(
                                checked
                                  ? "bg-indigo-600 border-transparent"
                                  : "bg-white border-gray-300",
                                active
                                  ? "ring-2 ring-offset-2 ring-indigo-600"
                                  : "",
                                "mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded-full border flex items-center justify-center",
                              )}
                              aria-hidden="true"
                            >
                              <span className="rounded-full bg-white w-1.5 h-1.5" />
                            </span>
                            <span className="ml-3 flex flex-col">
                              <RadioGroup.Label
                                as="span"
                                className={classNames(
                                  checked ? "text-indigo-900" : "text-gray-900",
                                  "block text-sm font-medium",
                                )}
                              >
                                {setting.name}
                              </RadioGroup.Label>
                              <RadioGroup.Description
                                as="span"
                                className={classNames(
                                  checked ? "text-indigo-700" : "text-gray-500",
                                  "block text-sm",
                                )}
                              >
                                {setting.description}
                              </RadioGroup.Description>
                            </span>
                          </>
                        )}
                      </RadioGroup.Option>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
          <Link
            to="/"
            className="text-sm leading-6 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className={classNames(
              "rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
              loading ? "cursor-not-allowed bg-indigo-400" : "bg-indigo-600",
            )}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </Form>
    </div>
  );
}

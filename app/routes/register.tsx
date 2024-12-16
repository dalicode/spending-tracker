import type { MetaFunction } from "react-router";
import {
  Link,
  redirect,
  useActionData,
  useFetcher,
  type ActionFunction,
  type LoaderFunction,
} from "react-router";
import { Form } from "react-router";
import { useState } from "react";
import { createUser } from "~/backend/user.server";
import { sessionStorage } from "~/backend/session.server";
import { authenticator } from "~/backend/auth.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Spending Tracker Register" },
    { name: "description", content: "Register a new account" },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  let session = await sessionStorage.getSession(request.headers.get("cookie"));
  let user = session.get("user");
  if (user) throw redirect("/");
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.clone().formData();
  const action = form.get("_action");
  const username = form.get("username");
  const password = form.get("password");
  const registerPass = form.get("registerPass");
  const config = JSON.stringify({ userData: {} });

  if (
    typeof username !== "string" ||
    typeof registerPass !== "string" ||
    typeof password !== "string"
  ) {
    return new Response(
      JSON.stringify({ error: `Invalid Form Data`, form: action }),
      { status: 400 }
    );
  }

  try {
    await createUser({ username, password, registerPass, config });
    let user = await authenticator.authenticate("form", request);
    let session = await sessionStorage.getSession(
      request.headers.get("cookie")
    );
    session.set("user", user);
    return redirect("/", {
      headers: { "Set-Cookie": await sessionStorage.commitSession(session) },
    });
  } catch (err) {
    console.error("Login error:", err);
    return { status: false, error: "failed to register, please try again" };
  }
};

export default function Register() {
  const actionData = useActionData();
  const [formData, setFormData] = useState({
    username: actionData?.fields?.username || "",
    password: actionData?.fields?.password || "",
    registerPass: actionData?.fields?.registerPass || "",
  });

  let fetcher = useFetcher();

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setFormData((form) => ({ ...form, [field]: event.target.value }));
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Your Company"
            src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white-900">
            Register
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <fetcher.Form method="POST" className="space-y-6">
            <div>
              {fetcher.data?.error && (
                <p className="py-3" style={{ color: "red" }}>
                  {fetcher.data?.error}
                </p>
              )}
              <label
                htmlFor="username"
                className="block text-sm/6 font-medium text-white-900"
              >
                Username
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  required
                  autoComplete="username"
                  onChange={(e) => handleInputChange(e, "username")}
                  className="block w-full rounded-md bg-gray-800 px-3 py-1.5 text-base text-white-900 outline outline-1 -outline-offset-1 outline-gray-700 placeholder:text-white-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium text-white-900"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  required
                  autoComplete="current-password"
                  onChange={(e) => handleInputChange(e, "password")}
                  className="block w-full rounded-md bg-gray-800 px-3 py-1.5 text-base text-white-900 outline outline-1 -outline-offset-1 outline-gray-700 placeholder:text-white-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="registerPass"
                  className="block text-sm/6 font-medium text-white-900"
                >
                  Registration Code
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="registerPass"
                  name="registerPass"
                  type="text"
                  value={formData.registerPass}
                  required
                  onChange={(e) => handleInputChange(e, "registerPass")}
                  className="block w-full rounded-md bg-gray-800 px-3 py-1.5 text-base text-white-900 outline outline-1 -outline-offset-1 outline-gray-700 placeholder:text-white-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                name="_action"
                value="register"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Register
              </button>
            </div>
          </fetcher.Form>
          <p className="mt-10 text-center text-sm/6 text-gray-500">
            Back to Login?{" "}
            <a
              href="#"
              className="font-semibold text-indigo-600 hover:text-indigo-500"
            >
              <Link to="/login">Login</Link>
            </a>
          </p>
          {fetcher.state !== "idle" && <p>Loading...</p>}
        </div>
      </div>
    </>
  );
}

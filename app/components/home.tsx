import {
  data,
  redirect,
  useLoaderData,
  type LoaderFunction,
  type MetaFunction,
} from "react-router";
import { sessionStorage } from "~/backend/session.server";
import { NavBar } from "~/components/nav-bar";
import { createContext, useState } from "react";
import { getUser } from "~/backend/user.server";
import { MonthView } from "~/components/month-view";
import { Overview } from "~/components/overview";

export const UserContext = createContext({});

export const meta: MetaFunction = () => {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  let session = await sessionStorage.getSession(request.headers.get("cookie"));
  let user = session.get("user");
  if (!user) {
    return redirect("/login");
  }

  const userData = await getUser(user?.username);
  if (!user || !userData?.status)
    return redirect("/login", {
      headers: { "Set-Cookie": await sessionStorage.destroySession(session) },
    });
  return data(userData);
};

export default function Home() {
  const userData = useLoaderData<typeof loader>() as {};
  const [selectedNav, setSelectedNav] = useState<string>("Overview");

  return (
    <main className="h-screen w-screen p-2">
      <UserContext.Provider value={userData}>
        <div className="h-full grid grid-rows-8 grid-cols-12 grid-flow-col gap-1">
          <div className="row-span-8 col-span-2 bg-slate-800">
            <NavBar setSelectedNav={setSelectedNav} />
          </div>
          {selectedNav === "Overview" ? (
            <Overview className="col-span-10" />
          ) : (
            <MonthView className="col-span-10" />
          )}
        </div>
      </UserContext.Provider>
    </main>
  );
}

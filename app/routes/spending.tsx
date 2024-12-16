import {
  AdjustmentsHorizontalIcon,
  ArrowDownTrayIcon,
  PlusIcon,
} from "@heroicons/react/16/solid";
import { data, redirect, type LoaderFunction } from "react-router";
import { getUser } from "~/backend/user.server";
import { Button } from "~/components/button";
import { ButtonRow } from "~/components/button-row";
import { Grid } from "~/components/grid";
import { sessionStorage } from "~/backend/session.server";

type Props = {
  className: string;
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

const Spending = ({ className }: Props) => {
  return (
    <>
      <div className={`grid grid-rows-8 bg-slate-800 col-span-10`}>
        <div className="row-span-6"></div>
        <ButtonRow className="flex px-1 pb-1 row-span-2 text-xs font-bold mt-auto">
          <Button Icon={ArrowDownTrayIcon}>Import</Button>
          <Button Icon={PlusIcon}>Add New</Button>
          <Button Icon={AdjustmentsHorizontalIcon}>Filter</Button>
        </ButtonRow>
      </div>
      <div className="row-span-7 col-span-10 bg-slate-800">
        <Grid />
      </div>
    </>
  );
};

export default Spending;

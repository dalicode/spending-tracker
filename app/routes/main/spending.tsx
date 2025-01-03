import {
  AdjustmentsHorizontalIcon,
  ArrowDownTrayIcon,
  PlusIcon,
} from "@heroicons/react/16/solid";
import { data, redirect, type LoaderFunction } from "react-router";
import { getUser } from "~/backend/user.server";
import { Button } from "~/components/Button";
import { ButtonRow } from "~/components/ButtonRow";
import { Grid } from "~/components/Grid";
import { sessionStorage } from "~/backend/session.server";
import { useEffect } from "react";

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
      <div className={`grid bg-granite-900 grid-rows-8 col-span-10`}>
        <div className="row-span-6"></div>
        <ButtonRow className="flex px-1 pb-1 row-span-2 text-xs font-bold mt-auto">
          <Button Icon={ArrowDownTrayIcon}>Import</Button>
          <Button Icon={PlusIcon}>Add New</Button>
          <Button Icon={AdjustmentsHorizontalIcon}>Filter</Button>
        </ButtonRow>
      </div>
      <div className="row-span-7 col-span-10">
        <Grid />
      </div>
    </>
  );
};

export default Spending;

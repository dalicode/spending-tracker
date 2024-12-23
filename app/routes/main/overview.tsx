import { useCallback, useEffect, useState } from "react";
import type { ColDef, IRowNode } from "ag-grid-community";
import { PlusIcon } from "@heroicons/react/16/solid";
import { Button } from "~/components/button";
import { Grid } from "~/components/Grid";
import { redirect, useSubmit } from "react-router";
import { getUser } from "~/backend/user.server";
import { sessionStorage } from "~/backend/session.server";
import {
  addCategory,
  delCategory,
  getCategories,
} from "~/backend/category.server";
import type { CategoryDbType } from "~/backend/types.server";
import { type categoryGridType, type testType } from "~/components/utils";
import type { Route } from "./+types/overview";
import CategoryGrid from "~/components/CategoryGrid";

export const action = async ({ request }: Route.ActionArgs) => {
  let session = await sessionStorage.getSession(request.headers.get("cookie"));
  let user = session.get("user");

  const formData = await request.formData();

  const json = JSON.parse(formData.get("json") as string);

  const response =
    request.method === "POST"
      ? await addCategory(json, user)
      : await delCategory(json, user);

  console.log("Action resposne: ", response);
  if (response) {
    return {
      message: "Success",
      data: response,
    };
  } else {
    return {
      message: "Error",
      data: [],
    };
  }
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  let session = await sessionStorage.getSession(request.headers.get("cookie"));
  let user = session.get("user");
  if (!user) {
    return redirect("/login");
  }

  const userData = await getUser(user?.username);
  if (!userData || !userData?.status || !userData?.data.id)
    return redirect("/login", {
      headers: { "Set-Cookie": await sessionStorage.destroySession(session) },
    });

  const categories = await getCategories(userData.data.id);
  if (categories) {
    return {
      message: "Successfully retrieved categories",
      data: categories,
    };
  } else {
    return {
      message: "Failed to retrieve categories",
      data: [],
    };
  }
};

const Overview = ({ loaderData, actionData }: Route.ComponentProps) => {
  const { message, data } = loaderData as testType;
  const submit = useSubmit();

  const [categoryData, setCategoryData] = useState<categoryGridType[]>(
    data?.map((b: CategoryDbType) => {
      return { id: b.id, name: b.name, spent: 0 };
    })
  );

  useEffect(() => {
    if (actionData) {
      const { data } = actionData;
      if (Array.isArray(data) && data?.length) {
        setCategoryData(
          data?.map((b: CategoryDbType) => {
            return { id: b.id, name: b.name, spent: 0 };
          })
        );
      }
      console.log("actionData", data);
    }
  }, [actionData]);

  const onDeleteCategoryHandler = useCallback(async (row: IRowNode) => {
    await submit(
      { table: "category", json: JSON.stringify(row) },
      { method: "DELETE" }
    );
  }, []);

  const onUpdateCategoryHandler = useCallback(async (row: IRowNode) => {
    await submit(
      { table: "category", json: JSON.stringify(row) },
      { method: "POST" }
    );
  }, []);

  const [fixedData, setFixedData] = useState([
    {
      name: "Test",
      "expected expense": "asd",
    },
  ]);

  const [fixedColDefs, setFixedColDefs] = useState<ColDef[]>([
    { colId: "fixed_expense", field: "name", width: 50 },
    { field: "expected expense", width: 100 },
  ]);

  return (
    <>
      <div
        className={`grid-rows-8 flex justify-center col-span-10 bg-granite-900`}
      >
        <div className="py-3 self-end text-4xl">{`Remaining Spendable: ${"$0"}`}</div>
      </div>
      <div className={`row-span-3 grid-rows-8 col-span-10 bg-granite-900`}>
        Stuff
      </div>
      <div className="overflow-hidden grid grid-cols-2 grid-flow-col row-span-4 col-span-10 gap-1">
        <CategoryGrid
          className="col-span-1"
          categoryData={categoryData}
          setCategoryData={setCategoryData}
          onDeleteCategoryHandler={onDeleteCategoryHandler}
          onUpdateCategoryHandler={onUpdateCategoryHandler}
        />
        <div className="col-span-1 relative">
          <Button
            className="absolute -right-3 top-0.5 z-10 text-slate-600 hover:text-white hover:bg-inherit"
            Icon={PlusIcon}
          />
          <Grid rowData={fixedData} colDef={fixedColDefs} />
        </div>
      </div>
    </>
  );
};

export default Overview;

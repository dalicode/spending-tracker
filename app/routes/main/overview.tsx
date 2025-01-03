import { useCallback, useEffect, useState } from "react";
import type { IRowNode } from "ag-grid-community";
import { redirect, useSubmit } from "react-router";
import { getUser } from "~/backend/user.server";
import { sessionStorage } from "~/backend/session.server";
import {
  addCategory,
  delCategory,
  getCategories,
} from "~/backend/category.server";
import type { CategoryDbType } from "~/backend/types.server";
import { type clientGridType, type overviewDataType } from "~/components/utils";
import type { Route } from "./+types/Overview";
import OverviewGrid from "~/components/OverviewGrid";
import {
  addRecurringExpense,
  addRecurringIncome,
  delRecurring,
  getRecurring,
  updateRecurring,
} from "~/backend/recurring.server";
import type { Category, Recurring } from "@prisma/client";

export const action = async ({ request }: Route.ActionArgs) => {
  let session = await sessionStorage.getSession(request.headers.get("cookie"));
  let user = session.get("user");

  const formData = await request.formData();
  const table = formData.get("table") as string;
  const isIncome = formData.get("isIncome") as string;

  const json = JSON.parse(formData.get("json") as string);
  const reqMethod = request.method;

  let response = null;

  if (table === "category") {
    response =
      request.method === "POST"
        ? await addCategory(json, user)
        : await delCategory(json, user);
  } else if (table === "recurring") {
    response =
      request.method === "POST" && json.id
        ? await updateRecurring(json)
        : request.method === "POST" && isIncome
        ? await addRecurringIncome(json, user)
        : request.method === "POST"
        ? await addRecurringExpense(json, user)
        : await delRecurring(json, user);
  }

  if (response) {
    return {
      message: "Success",
      data: response as Category | Recurring,
      table: table,
      isIncome: isIncome,
    };
  } else {
    return {
      message: "Error",
      table: table,
      data: {} as Category | Recurring,
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
  const recurring = await getRecurring(userData.data.id);

  if (categories && recurring) {
    return {
      message: "Successfully retrieved data",
      categoryData: categories,
      recurringData: recurring,
    };
  } else {
    return {
      message: "Failed to retrieve data",
      categoryData: [],
      recurringData: [],
    };
  }
};

const Overview = ({ loaderData, actionData }: Route.ComponentProps) => {
  const { message, categoryData, recurringData } =
    loaderData as overviewDataType;
  const submit = useSubmit();

  const [categoryRowData, setCategoryRowData] = useState<clientGridType[]>(
    categoryData
      ?.filter((d) => !d.tombstone)
      .map((b: Category) => {
        return { id: b.id, name: b.name, amount: 0 };
      })
  );

  const [recurringRowData, setRecurringRowData] = useState<clientGridType[]>(
    recurringData
      ?.filter((d) => !d.tombstone)
      .filter((d) => !d.is_income)
      .map((b: Recurring) => {
        return { id: b.id, name: b.name, amount: b.amount };
      })
  );

  const [incomeRowData, setIncomeRowData] = useState<clientGridType[]>(
    recurringData
      ?.filter((d) => !d.tombstone)
      .filter((d) => d.is_income)
      .map((b: Recurring) => {
        return { id: b.id, name: b.name, amount: b.amount };
      })
  );

  useEffect(() => {
    if (actionData) {
      const { data, table, isIncome } = actionData;
      if (Array.isArray(data) && data?.length) {
        if (table === "category") {
          setCategoryRowData(
            data
              ?.filter((d) => !d.tombstone)
              .map((b: CategoryDbType) => {
                return { id: b.id, name: b.name, amount: 0 };
              })
          );
        } else if (table === "recurring") {
          if (isIncome) {
            setIncomeRowData(
              data
                ?.filter((d) => !d.tombstone)
                .filter((d) => d.is_income)
                .map((b: Recurring) => {
                  return { id: b.id, name: b.name, amount: b.amount };
                })
            );
          }
          setRecurringRowData(
            data
              ?.filter((d) => !d.tombstone)
              .filter((d) => !d.is_income)
              .map((b: Recurring) => {
                return { id: b.id, name: b.name, amount: b.amount };
              })
          );
        }
      }
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

  const onDeleteRecurringHandler = useCallback(async (row: IRowNode) => {
    await submit(
      { table: "recurring", json: JSON.stringify(row) },
      { method: "DELETE" }
    );
  }, []);

  const onUpdateRecurringHandler = useCallback(async (row: IRowNode) => {
    await submit(
      { table: "recurring", json: JSON.stringify(row) },
      { method: "POST" }
    );
  }, []);

  const onUpdateIncomeHandler = useCallback(async (row: IRowNode) => {
    await submit(
      { isIncome: true, table: "recurring", json: JSON.stringify(row) },
      { method: "POST" }
    );
  }, []);

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
        <OverviewGrid
          className="col-span-1 row-span-2"
          data={categoryRowData}
          setData={setCategoryRowData}
          onDeleteHandler={onDeleteCategoryHandler}
          onUpdateHandler={onUpdateCategoryHandler}
          fieldNames={["Category", "Total"]}
        />
        <OverviewGrid
          className="col-span-1 row-span-1"
          data={recurringRowData}
          setData={setRecurringRowData}
          onDeleteHandler={onDeleteRecurringHandler}
          onUpdateHandler={onUpdateRecurringHandler}
          amountEditable={true}
          fieldNames={["Expense", "Amount"]}
        />
        <OverviewGrid
          className="col-span-1 row-span-1"
          data={incomeRowData}
          setData={setIncomeRowData}
          onDeleteHandler={onDeleteRecurringHandler}
          onUpdateHandler={onUpdateIncomeHandler}
          amountEditable={true}
          fieldNames={["Income", "Amount"]}
        />
      </div>
    </>
  );
};

export default Overview;

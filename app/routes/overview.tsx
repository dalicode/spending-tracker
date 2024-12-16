import { useCallback, useEffect, useRef, useState } from "react";
import type {
  CellEditingStartedEvent,
  ColDef,
  GridApi,
} from "ag-grid-community";
import { ArrowDownTrayIcon, PlusIcon } from "@heroicons/react/16/solid";
import { Button } from "~/components/button";
import { Grid, type typeWithGridApi } from "~/components/grid";
import { data, redirect, type LoaderFunction } from "react-router";
import { getUser } from "~/backend/user.server";
import { sessionStorage } from "~/backend/session.server";

type Props = {
  className?: String;
};

type categoryDataType = {
  category: string;
  total: number;
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

const Overview = ({ className }: Props) => {
  const [gridApi, setGridApi] = useState<GridApi<any>>();
  const catGridRef = useRef<typeWithGridApi>(null);
  const [editing, setEditing] = useState(false);
  const [categoryData, setCategoryData] = useState<categoryDataType[]>([
    {
      category: "Groceries",
      total: 511,
    },
    {
      category: "Dining",
      total: 122,
    },
    {
      category: "Entertainment",
      total: 344,
    },
    {
      category: "Misc",
      total: 123,
    },
  ]);
  const [prevCategoryData, setPrevCategoryData] = useState<categoryDataType[]>(
    structuredClone(categoryData)
  );

  const [catColDefs, setCatColDefs] = useState<ColDef[]>([
    { field: "category", width: 50 },
    { field: "total", width: 100 },
  ]);

  const [fixedData, setFixedData] = useState([
    {
      "fixed expense": "Test",
      value: "asd",
    },
  ]);

  const [fixedColDefs, setFixedColDefs] = useState<ColDef[]>([
    { colId: "fixed_expense", field: "fixed expense", width: 50 },
    { field: "value", width: 100 },
  ]);

  const onCategoryAddHandler = useCallback(() => {
    setCategoryData((categoryData: categoryDataType[]) => {
      setPrevCategoryData(categoryData);
      return [...categoryData, { category: "", total: 0 }];
    });
    setEditing(true);
  }, [catGridRef?.current, setEditing]);

  const onRowDataUpdatedHandler = () => {
    if (editing) {
      const lastRow = categoryData.length - 1;
      catGridRef?.current?.api.setFocusedCell(lastRow, "category");
      catGridRef?.current?.api.startEditingCell({
        rowIndex: lastRow,
        colKey: "category",
      });
    }
  };

  const rowCatValidator = (rowData: categoryDataType[]) => {
    const alphabetOnly = /^[A-Za-z]+$/;
    return rowData.every(
      (b) => !b.category && b.category !== "" && b.category.match(alphabetOnly)
    );
  };

  const onCellEditingStartedHandler = (e: CellEditingStartedEvent) => {
    // console.log(categoryData);
  };

  const rowAddedHandler = useCallback(
    (newRowData: categoryDataType[]) => {
      if (rowCatValidator(newRowData)) {
        setCategoryData(newRowData);
      } else {
        setCategoryData(prevCategoryData ?? []);
      }
    },
    [rowCatValidator, setCategoryData, prevCategoryData]
  );

  const onCellEditingStoppedHandler = useCallback(() => {
    if (editing) {
      setEditing(false);
    }
    console.log(prevCategoryData);
    const newRows = catGridRef.current?.getAllRows() ?? [];
    rowAddedHandler(newRows);
  }, [editing, setEditing, rowAddedHandler, catGridRef]);

  return (
    <>
      <div
        className={`grid-rows-8 bg-slate-800 flex justify-center col-span-10`}
      >
        <div className="py-3 self-end text-4xl">{`Remaining Spendable: ${"$0"}`}</div>
      </div>
      <div className={`row-span-3 grid-rows-8 bg-granite col-span-10`}>
        Stuff
      </div>
      <div className="grid grid-cols-2 grid-flow-col row-span-4 col-span-10 gap-1">
        <div className="col-span-1 bg-slate-800 relative">
          <Button
            onClick={onCategoryAddHandler}
            className="absolute right-0 z-10 px-0 mr-4"
            Icon={PlusIcon}
          />
          <Grid
            onCellEditingStartedHandler={onCellEditingStartedHandler}
            onCellEditingStoppedHandler={onCellEditingStoppedHandler}
            onRowDataUpdated={onRowDataUpdatedHandler}
            ref={catGridRef}
            rowData={categoryData}
            colDef={catColDefs}
          />
        </div>
        <div className="col-span-1 bg-slate-500 relative">
          <Button className="absolute right-0 z-10 px-0 mr-4" Icon={PlusIcon} />
          <Grid rowData={fixedData} colDef={fixedColDefs} />
        </div>
      </div>
    </>
  );
};

export default Overview;

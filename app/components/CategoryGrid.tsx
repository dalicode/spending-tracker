import { useCallback, useRef, useState } from "react";
import { Grid, type typeWithGridApi } from "./Grid";
import { rowDataValidator, type categoryGridType } from "./utils";
import { PlusIcon } from "@heroicons/react/16/solid";
import { Button } from "./button";
import type {
  CellEditingStoppedEvent,
  ColDef,
  IRowNode,
} from "ag-grid-community";
import { CustomOptionsRenderer } from "./CustomOptionsRenderer";

type categoryProps = {
  className: string;
  categoryData: categoryGridType[];
  setCategoryData: React.Dispatch<React.SetStateAction<categoryGridType[]>>;
  onDeleteCategoryHandler: (row: IRowNode) => void;
  onUpdateCategoryHandler: (row: IRowNode) => void;
};

const CategoryGrid = ({
  className,
  categoryData,
  setCategoryData,
  onDeleteCategoryHandler,
  onUpdateCategoryHandler,
}: categoryProps) => {
  const catGridRef = useRef<typeWithGridApi>(null);
  const [rowAdded, setRowAdded] = useState(false);
  const [prevCategoryData, setPrevCategoryData] = useState<categoryGridType[]>(
    structuredClone(categoryData)
  );

  const onEditHandler = useCallback(async (row: any) => {
    catGridRef?.current?.api.startEditingCell({
      rowIndex: row.id,
      colKey: "name",
    });
  }, []);

  const [catColDefs, setCatColDefs] = useState<ColDef[]>([
    { headerName: "col_id", field: "id", hide: true },
    {
      headerName: "Category",
      field: "name",
      width: 50,
      cellRenderer: CustomOptionsRenderer,
      cellRendererParams: {
        deleteRow: onDeleteCategoryHandler,
        editRow: onEditHandler,
      },
      editable: true,
    },
    { field: "spent", width: 100 },
  ]);

  const onCategoryAddHandler = useCallback(() => {
    setCategoryData((categoryData: categoryGridType[]) => {
      return [...categoryData, { name: "", spent: 0 }];
    });
    setRowAdded(true);
  }, [catGridRef?.current, setRowAdded]);

  const onRowAddedHandler = useCallback(() => {
    if (rowAdded) {
      const lastRow = categoryData.length - 1;
      catGridRef?.current?.api.setFocusedCell(lastRow, "name");
      catGridRef?.current?.api.startEditingCell({
        rowIndex: lastRow,
        colKey: "name",
      });
    }
  }, [catGridRef?.current, categoryData]);

  const onCellEditingStoppedHandler = useCallback(
    (e: CellEditingStoppedEvent) => {
      if (rowAdded) {
        setRowAdded(false);
      }

      const changedRow = e?.data;
      const newRowData = catGridRef.current?.getAllRows() ?? [];
      if (rowDataValidator(newRowData, e.newValue, e.oldValue)) {
        setPrevCategoryData(categoryData);
        setCategoryData(newRowData);
        onUpdateCategoryHandler(changedRow);
      } else {
        setCategoryData(prevCategoryData ?? []);
      }
    },
    [rowAdded, setRowAdded, catGridRef, categoryData]
  );

  return (
    <div className={`relative ${className}`}>
      <Button
        onClick={onCategoryAddHandler}
        className="absolute -right-3 top-0.5 z-10 text-slate-600 hover:text-white hover:bg-inherit"
        Icon={PlusIcon}
      />
      <Grid
        onCellEditingStoppedHandler={onCellEditingStoppedHandler}
        onRowDataUpdated={onRowAddedHandler}
        ref={catGridRef}
        rowData={categoryData}
        colDef={catColDefs}
      />
    </div>
  );
};

export default CategoryGrid;

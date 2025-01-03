import { useCallback, useRef, useState } from "react";
import { Grid, type typeWithGridApi } from "./Grid";
import { rowDataValidator, type clientGridType } from "./utils";
import { CurrencyDollarIcon, PlusIcon } from "@heroicons/react/16/solid";
import { Button } from "./Button";
import {
  CellRangeType,
  type CellEditingStoppedEvent,
  type ColDef,
  type IRowNode,
  type ValueFormatterParams,
} from "ag-grid-community";
import { CustomOptionsRenderer } from "./CustomOptionsRenderer";

type overviewGridProps = {
  className?: string;
  data: clientGridType[];
  setData: React.Dispatch<React.SetStateAction<clientGridType[]>>;
  onDeleteHandler: (row: IRowNode) => void;
  onUpdateHandler: (row: IRowNode) => void;
  fieldNames: string[];
  amountEditable?: boolean;
};

const OverviewGrid = ({
  className,
  data,
  setData,
  onDeleteHandler,
  onUpdateHandler,
  fieldNames,
  amountEditable = false,
}: overviewGridProps) => {
  const expGridRef = useRef<typeWithGridApi>(null);
  const [rowAdded, setRowAdded] = useState(false);
  const [prevData, setPrevData] = useState<clientGridType[]>(
    structuredClone(data)
  );

  const onEditHandler = useCallback(async (row: any) => {
    expGridRef?.current?.api.startEditingCell({
      rowIndex: row.id,
      colKey: "name",
    });
  }, []);

  const currencyFormatter = (currency: number, sign: string) => {
    var sansDec = currency.toFixed(2);
    var formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return sign + ` ${formatted}`;
  };

  const colDefs = [
    { headerName: "col_id", field: "id", hide: true },
    {
      headerName: fieldNames[0],
      field: "name",
      width: 50,
      cellRenderer: CustomOptionsRenderer,
      cellRendererParams: {
        deleteRow: onDeleteHandler,
        editRow: onEditHandler,
      },
      editable: true,
      cellDataType: "text",
    },
    {
      headerName: fieldNames[1],
      field: "amount",
      width: 100,
      editable: amountEditable,
      cellDataType: "number",
      valueFormatter: (params: ValueFormatterParams) =>
        currencyFormatter(params.data.amount, "$"),
    },
  ];

  const onAddHandler = useCallback(() => {
    setData((data: clientGridType[]) => {
      return [...data, { name: "", amount: 0 }];
    });
    setRowAdded(true);
  }, [expGridRef?.current, setRowAdded]);

  const onRowAddedHandler = useCallback(() => {
    if (rowAdded) {
      const lastRow = data.length - 1;
      expGridRef?.current?.api.setFocusedCell(lastRow, "name");
      expGridRef?.current?.api.startEditingCell({
        rowIndex: lastRow,
        colKey: "name",
      });
    }
  }, [expGridRef?.current, data]);

  const onCellEditingStoppedHandler = useCallback(
    (e: CellEditingStoppedEvent) => {
      if (rowAdded) {
        setRowAdded(false);
      }

      const changedRow = e?.data;
      const newRowData = expGridRef.current?.getAllRows() ?? [];
      if (
        rowDataValidator(
          newRowData,
          e.newValue.toString(),
          e.oldValue.toString()
        )
      ) {
        setPrevData(data);
        setData(newRowData);
        onUpdateHandler(changedRow);
      } else {
        setData(prevData ?? []);
      }
    },
    [rowAdded, setRowAdded, expGridRef, data]
  );

  return (
    <div className={`relative ${className}`}>
      <Button
        onClick={onAddHandler}
        className="absolute -right-3 top-0.5 z-10 text-slate-600 hover:text-white hover:bg-inherit"
        Icon={PlusIcon}
      />
      <Grid
        onCellEditingStoppedHandler={onCellEditingStoppedHandler}
        onRowDataUpdated={onRowAddedHandler}
        ref={expGridRef}
        rowData={data}
        colDef={colDefs}
      />
    </div>
  );
};

export default OverviewGrid;

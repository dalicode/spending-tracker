import { AgGridReact } from "ag-grid-react";
import {
  ModuleRegistry,
  ValidationModule,
  ColumnAutoSizeModule,
  ColumnHoverModule,
  CellStyleModule,
  HighlightChangesModule,
  TooltipModule,
  RowSelectionModule,
  TextEditorModule,
  LargeTextEditorModule,
  SelectEditorModule,
  NumberEditorModule,
  DateEditorModule,
  CheckboxEditorModule,
  UndoRedoEditModule,
  CsvExportModule,
  ValueCacheModule,
  GridStateModule,
  ColumnApiModule,
  RowApiModule,
  CellApiModule,
  ScrollApiModule,
  RenderApiModule,
  EventApiModule,
  ClientSideRowModelApiModule,
  ClientSideRowModelModule,
  type ColDef,
  colorSchemeDarkBlue,
  type SizeColumnsToFitGridStrategy,
  type SizeColumnsToFitProvidedWidthStrategy,
  type SizeColumnsToContentStrategy,
  type CellClickedEvent,
  themeBalham,
  type RowDataUpdatedEvent,
  type CellEditingStoppedEvent,
  type CellEditingStartedEvent,
} from "ag-grid-community";
import {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type Ref,
} from "react";
import type { JsonObject } from "@prisma/client/runtime/library";

ModuleRegistry.registerModules([
  ValidationModule,
  ColumnAutoSizeModule,
  ColumnHoverModule,
  CellStyleModule,
  HighlightChangesModule,
  TooltipModule,
  RowSelectionModule,
  TextEditorModule,
  LargeTextEditorModule,
  SelectEditorModule,
  NumberEditorModule,
  DateEditorModule,
  CheckboxEditorModule,
  UndoRedoEditModule,
  CsvExportModule,
  ValueCacheModule,
  GridStateModule,
  ColumnApiModule,
  RowApiModule,
  CellApiModule,
  ScrollApiModule,
  RenderApiModule,
  EventApiModule,
  ClientSideRowModelApiModule,
  ClientSideRowModelModule,
]);

export type refType = {
  isGridReady: () => void;
  getAllRows: () => void;
};

export type typeWithGridApi = refType & AgGridReact;

type Props = {
  rowData: JsonObject[];
  colDef: ColDef[];
  onRowDataUpdated?: (e: RowDataUpdatedEvent<any, any>) => void;
  onCellEditingStoppedHandler?: (e: CellEditingStoppedEvent<any, any>) => void;
  onCellEditingStartedHandler?: (e: CellEditingStartedEvent<any, any>) => void;
};

export const Grid = forwardRef<unknown, Props>(
  (
    {
      rowData,
      colDef,
      onRowDataUpdated,
      onCellEditingStoppedHandler,
      onCellEditingStartedHandler,
    },
    ref
  ) => {
    const gridRef = useRef<AgGridReact>(null);
    const [gridReady, setGridReady] = useState(false);

    useEffect(() => {
      gridRef.current = gridRef.current ?? null;
    }, [gridReady, gridRef]);

    const autoSizeStrategy = useMemo<
      | SizeColumnsToFitGridStrategy
      | SizeColumnsToFitProvidedWidthStrategy
      | SizeColumnsToContentStrategy
    >(() => {
      return {
        type: "fitGridWidth",
        defaultMinWidth: 50,
        columnLimits: [
          {
            colId: "description",
            maxWidth: 400,
          },
        ],
      };
    }, []);

    const [selectedValue, setSelectedValue] = useState("");

    const getAllRows = useCallback(() => {
      let rowData: any[] = [];
      gridRef.current?.api.forEachNode((node) => rowData.push(node.data));
      return rowData;
    }, [gridRef]);

    const handleCellClicked = useCallback(
      (e: CellClickedEvent) => {
        setSelectedValue(e.value);
      },
      [setSelectedValue]
    );

    const handleUserKeyPress = useCallback(
      (event: KeyboardEvent) => {
        const { key, metaKey, ctrlKey } = event;
        if (key === "c" && (metaKey || ctrlKey)) {
          navigator.clipboard.writeText(selectedValue ?? "");
        }
      },
      [selectedValue]
    );

    useImperativeHandle(
      ref,
      () => ({
        isGridReady: () => gridReady,
        ...(gridRef.current ?? {}),
        getAllRows,
      }),
      [gridReady, gridRef, getAllRows]
    );

    useEffect(() => {
      window.addEventListener("keydown", handleUserKeyPress);
      return () => {
        window.removeEventListener("keydown", handleUserKeyPress);
      };
    }, [handleUserKeyPress]);

    return (
      <AgGridReact
        ref={gridRef}
        onCellEditingStarted={onCellEditingStartedHandler}
        onCellEditingStopped={onCellEditingStoppedHandler}
        onRowDataUpdated={onRowDataUpdated}
        onGridReady={() => setGridReady(true)}
        editType="fullRow"
        defaultColDef={{ flex: 1 }}
        theme={themeBalham.withPart(colorSchemeDarkBlue)}
        suppressClickEdit
        className="h-full"
        columnDefs={colDef}
        rowData={rowData}
        autoSizeStrategy={autoSizeStrategy}
        onCellClicked={handleCellClicked}
      />
    );
  }
);

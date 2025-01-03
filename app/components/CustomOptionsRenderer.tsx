import type { CustomCellRendererProps } from "ag-grid-react";
import { Button } from "./Button";
import { EllipsisVerticalIcon } from "@heroicons/react/16/solid";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import type { IRowNode } from "ag-grid-community";

type deleteRowType = {
  deleteRow: (row: IRowNode) => void;
  editRow: (row: IRowNode) => void;
};

export const CustomOptionsRenderer = ({
  value,
  data,
  deleteRow,
  editRow,
  node,
}: CustomCellRendererProps & deleteRowType) => {
  return (
    <div className="relative flex align-center">
      <div className="">{value}</div>
      <div className="">
        <Menu>
          <MenuButton
            className={`flex py-1.5 px-3 z-10 text-slate-600 hover:text-white`}
          >
            <EllipsisVerticalIcon className={`size-4`} />
          </MenuButton>
          <MenuItems
            anchor="bottom"
            className="border-2 border-granite-900 py-1 px-2 origin-top-right bg-granite-800 p-1 text-xs text-white transition duration-100 ease-out"
          >
            <MenuItem>
              <Button
                onClick={() => deleteRow(data)}
                className="hover:bg-granite-500 my-1"
              >
                Delete
              </Button>
            </MenuItem>
            <MenuItem>
              <Button
                onClick={() => editRow(node)}
                className="hover:bg-granite-500 my-1"
              >
                Edit
              </Button>
            </MenuItem>
          </MenuItems>
        </Menu>
      </div>
    </div>
  );
};

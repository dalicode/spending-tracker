import type { Category, Recurring } from "@prisma/client";

export type clientGridType = {
  id?: number;
  name: string;
  amount: number;
  tombstone?: boolean;
};

export type overviewDataType = {
  message: string;
  categoryData: Category[];
  recurringData: Recurring[];
};

export const rowDataValidator = (
  rowData: clientGridType[],
  newValue: string,
  oldValue: string
) => {
  if (newValue.trim() === "") {
    return false;
  }

  if (newValue.trim() === oldValue.trim()) {
    return false;
  }

  const alphabetOnly = /^[A-Za-z ]+$/;
  const colArray = Object.values(rowData).map((b) =>
    b.name?.toUpperCase().trim()
  );
  const hasDuplicates = new Set(colArray).size !== colArray.length;

  return rowData.every(
    (b) =>
      b.name && b.name !== "" && b.name.match(alphabetOnly) && !hasDuplicates
  );
};

import type { Category } from "@prisma/client";

export type categoryGridType = {
  name: string;
  spent: number;
};

export type testType = {
  message: string;
  data: Category[];
};

export const rowDataValidator = (
  rowData: categoryGridType[],
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

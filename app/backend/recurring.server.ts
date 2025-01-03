import type { RecurringForm } from "./types.server.js";
import { prisma, type User } from "./prisma.server.js";

export const getRecurring = async (userid: number) => {
  if (!userid) {
    console.error("Failed to find user with id: ", userid);
    return;
  }

  const recurring = await prisma.recurring.findMany({
    where: { user_id: userid },
  });

  return recurring;
};

export const updateRecurring = async (recurring: RecurringForm) => {
  if (recurring.id) {
    const updatedRecurring = await prisma.recurring.update({
      where: { id: recurring.id },
      data: {
        name: recurring.name,
        amount: recurring.amount,
        tombstone: recurring.tombstone,
      },
    });

    if (updatedRecurring) {
      console.log(updatedRecurring);
      return updatedRecurring;
    }
  }
};

export const addRecurringExpense = async (
  recurring: RecurringForm,
  user: User
) => {
  console.log(recurring);
  if (user) {
    const newRecurring = await prisma.recurring.create({
      data: {
        user_id: user.id,
        name: recurring.name,
        amount: recurring.amount,
      },
    });

    if (newRecurring) {
      const allRecurring = await getRecurring(user.id);
      return allRecurring;
    }
  }
};

export const addRecurringIncome = async (
  recurring: RecurringForm,
  user: User
) => {
  console.log(recurring);
  if (user) {
    const newRecurring = await prisma.recurring.create({
      data: {
        user_id: user.id,
        name: recurring.name,
        amount: recurring.amount,
        is_income: true,
      },
    });

    if (newRecurring) {
      const allRecurring = await getRecurring(user.id);
      return allRecurring;
    }
  }
};

export const delRecurring = async (recurring: RecurringForm, user: User) => {
  console.log(recurring);
  if (recurring.id) {
    const updatedRecurring = await prisma.recurring.update({
      where: { id: recurring.id },
      data: { tombstone: true },
    });

    if (updatedRecurring) {
      const allRecurring = await getRecurring(user.id);
      console.log(allRecurring);
      return allRecurring;
    }
  }
};

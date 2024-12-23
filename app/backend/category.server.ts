import bcrypt from "bcryptjs";
import type {
  CategoryDbType,
  CategoryForm,
  RegisterForm,
  responseType,
} from "./types.server.ts";
import { prisma, type User } from "./prisma.server";

export const getCategories = async (userid: number) => {
  if (!userid) {
    console.error("Failed to find user with id: ", userid);
    return;
  }

  const categories = await prisma.category.findMany({
    where: { user_id: userid },
  });

  if (categories && categories.length) {
    return categories;
  } else {
    console.error("Categories not found");
  }
};

export const addCategory = async (category: CategoryForm, user: User) => {
  console.log(category);
  if (category.id) {
    const updatedCategory = await prisma.category.update({
      where: { id: category.id },
      data: { name: category.name },
    });

    if (updatedCategory) {
      console.log(updatedCategory);
      return updatedCategory;
    }
  }

  if (user) {
    const newCategory = await prisma.category.create({
      data: {
        name: category.name,
        user_id: user.id,
      },
    });

    if (newCategory) {
      const allCategories = await getCategories(user.id);
      return allCategories;
    }
  }
};

export const delCategory = async (category: CategoryForm, user: User) => {
  console.log(category);
  if (category.id) {
    const updatedCategory = await prisma.category.delete({
      where: { id: category.id },
    });

    if (updatedCategory) {
      const allCategories = await getCategories(user.id);
      console.log(updatedCategory);
      return allCategories;
    }
  }
};

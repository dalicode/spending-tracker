import bcrypt from "bcryptjs";
import type { RegisterForm } from "./types.server.ts";
import { prisma } from "./prisma.server";

export const getCategories = async (userid: number) => {
  if (!userid) {
    console.error("Failed to find user with id: ", userid);
    return {
      status: false,
      message: `Failed to find user`,
      data: {},
    };
  }

  const categories = await prisma.category.findMany({
    where: { user_id: userid },
  });

  if (!categories || !categories?.length) {
    console.error("Failed to find categories for user with id: ", userid);
    return {
      status: false,
      message: `Failed to find categories`,
      data: {},
    };
  }

  return {
    status: true,
    message: "Successfully retrieved categories for user",
    data: {
      categories: categories,
    },
  };
};

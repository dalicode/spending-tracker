import bcrypt from "bcryptjs";
import type { RegisterForm } from "./types.server.ts";
import { prisma } from "./prisma.server";

export const createUser = async (user: RegisterForm) => {
  const passwordHash = await bcrypt.hash(user.password, 12);
  if (user.registerPass !== "register") {
    throw new Response("Wrong registration password", { status: 401 });
  }
  const newUser = await prisma.user.create({
    data: {
      username: user.username,
      password: passwordHash,
      role: "USER",
      config: user.config,
      categories: {
        create: [
          { name: "groceries" },
          { name: "dining Out" },
          { name: "entertainment" },
          { name: "misc" },
        ],
      },
    },
  });
  return {
    id: newUser.id,
    username: newUser.username,
    role: newUser.role,
    config: newUser.config,
  };
};

export const getUser = async (username: string) => {
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    return {
      status: false,
      message: `Failed to find user with name ${user}`,
      data: {},
    };
  }

  return {
    status: true,
    message: "Successfully retrieved user data",
    data: {
      id: user.id,
      config: JSON.parse(user.config),
    },
  };
};

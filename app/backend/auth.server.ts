import {Authenticator} from "remix-auth"
import {FormStrategy} from "remix-auth-form"
import { prisma } from './prisma.server'
import bcrypt from "bcryptjs"

const authenticator = new Authenticator<any>()

const formStrategy = new FormStrategy(async ({form}) => {
  const username = form.get("username") as string
  const password = form.get("password") as string

  const user = await prisma.user.findUnique({
    where: { username },
  });

  const passwordsMatch = await bcrypt.compare(
    password,
    user?.password as string,
  )

  if (!passwordsMatch) {
    throw new Response("Login failed", {status: 401})
  }

  return user
})

authenticator.use(formStrategy, "form")

export {authenticator}
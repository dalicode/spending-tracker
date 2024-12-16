import { createCookieSessionStorage } from "react-router";

const sessionStorage = createCookieSessionStorage({
    cookie: {
        name: "_session",
        sameSite: "lax",
        path: "/",
        httpOnly: true,
        secrets: [process.env.SESSION_SECRET as string],
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 30,
    }
})

export {sessionStorage}
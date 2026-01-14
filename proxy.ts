import { clerkMiddleware } from "@clerk/nextjs/server"
import createMiddleware from "next-intl/middleware"
import { routing } from "./i18n/routing"

const intlMiddleware = createMiddleware(routing)

export default clerkMiddleware(async (auth, req) => {
  // Run next-intl middleware
  return intlMiddleware(req)
})

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|_vercel|api|trpc|.*\\..*).*)",
  ],
}

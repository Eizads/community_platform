// import { clerkMiddleware } from "@clerk/nextjs/server"
// import createMiddleware from "next-intl/middleware"
// import { routing } from "./i18n/routing"

// export default clerkMiddleware()

// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
//     // Always run for API routes
//     "/(api|trpc)(.*)",
//   ],
// }

// export default createMiddleware(routing)

// export const config = {
//   // Match all pathnames except for
//   // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
//   // - … the ones containing a dot (e.g. `favicon.ico`)
//   matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
// }

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

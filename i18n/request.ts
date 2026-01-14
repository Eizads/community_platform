// import { getRequestConfig } from "next-intl/server"

// // Can be imported from a shared config
// const locales = ["en", "es"] as const

// export default getRequestConfig(async ({ locale }) => {
//   // Validate that the incoming `locale` parameter is valid
//   if (!locale || !locales.includes(locale as (typeof locales)[number])) {
//     return {
//       locale: "en",
//       messages: (await import(`@/messages/en.json`)).default,
//     }
//   }

//   return {
//     locale,
//     messages: (await import(`@/messages/${locale}.json`)).default,
//   }
// })

import { getRequestConfig } from "next-intl/server"
import { hasLocale } from "next-intl"
import { routing } from "./routing"

export default getRequestConfig(async ({ requestLocale }) => {
  // Typically corresponds to the `[locale]` segment
  let locale = await requestLocale

  // Validate locale or fallback to default
  if (!hasLocale(routing.locales, locale)) {
    locale = routing.defaultLocale
  }

  return {
    locale,
    messages: (await import(`@/messages/${locale}.json`)).default,
  }
})

import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../globals.css"
import Header from "@/components/common/header"
import Footer from "@/components/common/footer"
import { ClerkProvider } from "@clerk/nextjs"
import { Toaster } from "@/components/ui/sonner"
import { NextIntlClientProvider, hasLocale } from "next-intl"
import { getMessages, setRequestLocale } from "next-intl/server"
import { routing } from "@/i18n/routing"
import { notFound } from "next/navigation"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export const metadata: Metadata = {
  title: "BuildFlow",
  description: "a platform for sharing projects",
}

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }))
}

export default async function LocaleLayout({ children, params }: Props) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  // Enable static rendering
  setRequestLocale(locale)

  // Providing all messages to the client
  const messages = await getMessages()

  return (
    <ClerkProvider>
      <html lang={locale} className="h-full">
        <body
          className={`${inter.className} bg-zinc-100 antialiased flex flex-col min-h-screen`}
        >
          <NextIntlClientProvider messages={messages}>
            <Header />
            <main className="flex-1 flex flex-col">{children}</main>
            <Footer />
            <Toaster />
          </NextIntlClientProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}

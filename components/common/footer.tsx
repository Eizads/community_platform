"use client"
import Logo from "../common/logo"
import { useTranslations } from "next-intl"

function Footer() {
  const t = useTranslations("Common")

  return (
    <footer className="bg-background/20 border-t border-zinc-300">
      <div className="container flex flex-row items-center text-sm text-gray-500 items-center justify-center gap-2 py-4">
        <Logo /> © 2026 {t("allRightsReserved")}
      </div>
    </footer>
  )
}

export default Footer

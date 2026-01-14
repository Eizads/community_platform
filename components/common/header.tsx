"use client"

import { HomeIcon, CompassIcon, SparklesIcon, MenuIcon } from "lucide-react"
import { Button } from "../ui/button"
import Logo from "../common/logo"
import { SignInButton, SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs"
import { Suspense } from "react"
import AuthSkeleton from "../skeleton/auth-skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import CustomUserButton from "./custom-user-button"
import { GlobeIcon } from "lucide-react"
import { Link, usePathname, useRouter } from "@/i18n/navigation"
import { useLocale } from "next-intl"

function Header() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale })
  }
  return (
    <header className="bg-background/20 border-b border-zinc-300 sticky top-0 z-50 backdrop-blur-sm">
      <div className="container flex flex-row items-center justify-between py-4 ">
        <Logo />

        {/* Mobile Menu */}
        <div className="flex flex-row items-center gap-2 md:hidden">
          <Suspense fallback={<AuthSkeleton />}>
            <SignedIn>
              <CustomUserButton />
            </SignedIn>
          </Suspense>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <MenuIcon className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-full z-50">
              <DropdownMenuItem asChild>
                <Link href="/" className="flex items-center gap-2 w-full">
                  <HomeIcon className="w-4 h-4" />
                  Home
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/explore"
                  className="flex items-center gap-2 w-full"
                >
                  <CompassIcon className="w-4 h-4" />
                  Explore
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => switchLocale("en")}>
                <GlobeIcon className="w-4 h-4 mr-2" />
                English {locale === "en" && "✓"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => switchLocale("es")}>
                <GlobeIcon className="w-4 h-4 mr-2" />
                Español {locale === "es" && "✓"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <Suspense fallback={<AuthSkeleton />}>
                <SignedOut>
                  <SignInButton mode="modal">
                    <DropdownMenuItem onSelect={e => e.preventDefault()}>
                      Sign In
                    </DropdownMenuItem>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <DropdownMenuItem onSelect={e => e.preventDefault()}>
                      Sign Up
                    </DropdownMenuItem>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/submit"
                      className="flex items-center gap-2 w-full"
                    >
                      <SparklesIcon className="w-4 h-4" />
                      Submit a Project
                    </Link>
                  </DropdownMenuItem>
                </SignedIn>
              </Suspense>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-row items-center justify-start gap-2">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground  hover:text-foreground transition-colors hover:bg-muted/50"
          >
            <HomeIcon className="w-4 h-4 text-gray-500" /> Home
          </Link>

          <Link
            href="/explore"
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground  hover:text-foreground transition-colors hover:bg-muted/50"
          >
            <CompassIcon className="w-4 h-4 text-gray-500" />
            Explore
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" aria-label="Change language">
                <GlobeIcon className="w-4 h-4 mr-2" />
                {locale === "en" ? "EN" : "ES"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => switchLocale("en")}>
                English {locale === "en" && "✓"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => switchLocale("es")}>
                Español {locale === "es" && "✓"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex flex-row items-center justify-start gap-3">
          <Suspense fallback={<AuthSkeleton />}>
            <SignedOut>
              <SignInButton />
              <SignUpButton>
                <Button>Sign Up</Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Button asChild>
                <Link href="/submit">
                  <SparklesIcon className="w-4 h-4" /> Submit a Project
                </Link>
              </Button>
              <CustomUserButton />
            </SignedIn>
          </Suspense>
        </div>
      </div>
    </header>
  )
}

export default Header

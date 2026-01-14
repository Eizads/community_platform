import { Link } from "@/i18n/navigation"
import { RocketIcon } from "lucide-react"

const Logo = () => {
  return (
    <Link
      href="/"
      className="flex flex-row items-center justify-start gap-2 group"
    >
      <RocketIcon className="w-4 h-4 group-hover:text-sky-500 transition-colors text-sky-500" />

      <h2 className="text-2xl font-bold group-hover:text-sky-500 transition-colors">
        Build<span className="text-sky-500">Flow</span>
      </h2>
    </Link>
  )
}

export default Logo

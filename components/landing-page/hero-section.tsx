import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Link } from "@/i18n/navigation"
import { EyeIcon, UsersIcon, RocketIcon } from "lucide-react"
import { ArrowRightIcon } from "lucide-react"
import StatsCard from "./stats-card"
import { SparklesIcon } from "lucide-react"
import { getTranslations } from "next-intl/server"

async function LiveBadge() {
  const t = await getTranslations("HomePage")
  return (
    <Badge
      className="px-4 py-2 mb-8 text-sm backdrop-blur-sm "
      variant={"outline"}
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
      </span>
      <span className="test-left text-muted-foreground text-sm">
        {t("liveBadge")}
      </span>
    </Badge>
  )
}

export default async function HeroSection() {
  const t = await getTranslations("HomePage")
  const tStats = await getTranslations("Stats")

  const stats = [
    { icon: RocketIcon, title: tStats("projects"), value: "100k+" },
    { icon: UsersIcon, title: tStats("users"), value: "40k+", hasBorder: true },
    {
      icon: EyeIcon,
      title: tStats("monthlyViews"),
      value: "21k+",
    },
  ]
  return (
    <section className="bg-zinc-100 lg:py-24 py-10">
      <div className="container flex flex-col items-center justify-center gap-4 text-center">
        <LiveBadge />
        <h1 className="text-5xl sm:text-3xl lg:text-7xl font-bold tracking-tight mb-4 max-w-4xl">
          {t("heroTitle")}
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl leading-relaxed">
          {t("heroDescription")}
        </p>
        <div className="flex flex-col sm:flex-row mb-16 gap-4">
          <Button asChild size={"lg"} className="w-full sm:w-auto">
            <Link href={"/submit"}>
              <SparklesIcon className="w-4 h-4" /> {t("shareProjectButton")}
            </Link>
          </Button>
          <Button
            asChild
            size={"lg"}
            className="w-full sm:w-auto"
            variant={"outline"}
          >
            <Link href={"/explore"}>
              {t("exploreProjectsButton")}{" "}
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        <div className="flex flex-row gap-8">
          {stats.map(stat => (
            <StatsCard
              key={stat.title}
              icon={stat.icon}
              title={stat.title}
              value={stat.value}
              hasBorder={stat.hasBorder}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

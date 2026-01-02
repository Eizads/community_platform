import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { EyeIcon, UsersIcon, RocketIcon } from "lucide-react"
import { ArrowRightIcon } from "lucide-react"
import StatsCard from "./stats-card"
import { SparklesIcon } from "lucide-react"
const LiveBadge = () => {
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
        Join the community share your projects
      </span>
    </Badge>
  )
}

export default function HeroSection() {
  const stats = [
    { icon: RocketIcon, title: "Projects", value: "100k+" },
    { icon: UsersIcon, title: "Users", value: "40k+", hasBorder: true },
    {
      icon: EyeIcon,
      title: "Monthly Views",
      value: "21k+",
    },
  ]
  return (
    <section className="bg-zinc-100 lg:py-24 py-10">
      <div className="container flex flex-col items-center justify-center gap-4 text-center">
        <LiveBadge />
        <h1 className="text-5xl sm:text-3xl lg:text-7xl font-bold tracking-tight mb-4 max-w-4xl">
          Share What You&apos;ve Built, Discover What Others Have Built{" "}
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl leading-relaxed">
          A community for creators and builders to share their projects, get
          feedback, and get help.
        </p>
        <div className="flex flex-col sm:flex-row mb-16 gap-4">
          <Button asChild size={"lg"} className="w-full sm:w-auto">
            <Link href={"/submit"}>
              <SparklesIcon className="w-4 h-4" /> Share Your Project
            </Link>
          </Button>
          <Button
            asChild
            size={"lg"}
            className="w-full sm:w-auto"
            variant={"outline"}
          >
            <Link href={"/explore"}>
              Explore Projects <ArrowRightIcon className="w-4 h-4" />
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

import { LucideIcon } from "lucide-react"
function SectionHeader({
  icon: Icon,
  title,
  description,
  headingLevel = "h2",
}: {
  icon?: LucideIcon
  title: string
  description: string
  headingLevel?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
}) {
  const HeadingTag = headingLevel
  return (
    <div>
      <div className="flex flex-row items-center justify-start gap-2 mb-2">
        {Icon && <Icon className="w-6 h-6 text-sky-500" />}
        <HeadingTag className="text-2xl font-bold">{title}</HeadingTag>
      </div>
      <p>{description}</p>
    </div>
  )
}

export default SectionHeader

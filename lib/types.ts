import { InferSelectModel } from "drizzle-orm"
import { products, productTranslations } from "@/db/schema"

export type ProductType = InferSelectModel<typeof products>
export type ProductTranslationType = InferSelectModel<
  typeof productTranslations
>

// Product with translation - this is what we get from queries
export type ProductWithTranslation = InferSelectModel<typeof products> & {
  name: string
  tagline: string | null
  description: string | null
  locale: string
}

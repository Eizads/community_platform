import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  timestamp,
  json,
  uniqueIndex,
  index,
  primaryKey,
} from "drizzle-orm/pg-core"

// ============= PRODUCTS =============
export const products = pgTable(
  "products",
  {
    id: serial("id").primaryKey(),

    // Core product info (now language-agnostic)
    slug: varchar("slug", { length: 140 }).notNull().unique(),

    // Links & media
    websiteUrl: text("website_url"),
    tags: json("tags").$type<string[]>(), // e.g. ["AI", "Productivity"]

    // Voting
    voteCount: integer("vote_count").notNull().default(0),

    // Metadata
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    approvedAt: timestamp("approved_at", { withTimezone: true }),
    status: varchar("status", { length: 20 }).default("pending"), // pending | approved | rejected
    submittedBy: varchar("submitted_by", { length: 120 }).default("anonymous"),
    userId: varchar("user_id", { length: 255 }), // Clerk user ID

    // Organization reference (for backend queries only)
    organizationId: varchar("organization_id", { length: 255 }), // Clerk org ID
  },
  table => [
    uniqueIndex("products_slug_idx").on(table.slug),
    index("products_status_idx").on(table.status),
    index("products_organization_idx").on(table.organizationId),
  ]
)

// ============= PRODUCT TRANSLATIONS =============
export const productTranslations = pgTable(
  "product_translations",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    locale: varchar("locale", { length: 10 }).notNull(), // en, es, fr, etc.
    name: varchar("name", { length: 120 }).notNull(),
    tagline: varchar("tagline", { length: 200 }),
    description: text("description"),
  },
  table => [
    // Composite unique constraint: one translation per product per locale
    primaryKey({ columns: [table.productId, table.locale] }),
    index("product_translations_product_idx").on(table.productId),
    index("product_translations_locale_idx").on(table.locale),
  ]
)

# Database Translation Implementation Guide

## Overview

This guide shows how to implement database content translation for products using a separate translations table.

## Architecture

### What Changed

- **Before**: `name`, `tagline`, `description` stored in `products` table
- **After**: These fields moved to `product_translations` table with locale support

### What Stays in `products` Table

- `slug` (shared across locales or can be made locale-specific)
- `websiteUrl`
- `tags`
- `voteCount`
- `status`, `createdAt`, `approvedAt`
- User/organization info

## Implementation Steps

### Step 1: Run Migration (Already Done)

The schema has been updated. Now you need to generate and run the migration:

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

### Step 2: Migrate Existing Data

Create a migration script to move existing data to translations table:

```typescript
// db/migrate-to-translations.ts
import { db } from "./index"
import { products, productTranslations } from "./schema"

async function migrateToTranslations() {
  // Get all existing products
  const allProducts = await db.select().from(products)

  console.log(`Migrating ${allProducts.length} products...`)

  for (const product of allProducts) {
    // Create English translation for each product
    await db.insert(productTranslations).values({
      productId: product.id,
      locale: "en",
      name: product.name || "Untitled",
      tagline: product.tagline || "",
      description: product.description || "",
    })
  }

  console.log("Migration complete!")
}

migrateToTranslations()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
```

Run it: `npx tsx db/migrate-to-translations.ts`

### Step 3: Update Database Queries

Create helper functions to fetch products with translations:

```typescript
// lib/db-queries.ts - ADD THESE FUNCTIONS

import { productTranslations } from "@/db/schema"

// Helper to get product with translation for specific locale
export async function getProductWithTranslation(
  productId: number,
  locale: string
) {
  const result = await db
    .select({
      // Product fields
      id: products.id,
      slug: products.slug,
      websiteUrl: products.websiteUrl,
      tags: products.tags,
      voteCount: products.voteCount,
      createdAt: products.createdAt,
      approvedAt: products.approvedAt,
      status: products.status,
      submittedBy: products.submittedBy,
      userId: products.userId,
      organizationId: products.organizationId,
      // Translation fields
      name: productTranslations.name,
      tagline: productTranslations.tagline,
      description: productTranslations.description,
      locale: productTranslations.locale,
    })
    .from(products)
    .leftJoin(
      productTranslations,
      and(
        eq(products.id, productTranslations.productId),
        eq(productTranslations.locale, locale)
      )
    )
    .where(eq(products.id, productId))
    .limit(1)

  return result[0]
}

// Get all approved products with translations for a locale
export async function getAllApprovedProductsWithLocale(locale: string) {
  return await db
    .select({
      id: products.id,
      slug: products.slug,
      websiteUrl: products.websiteUrl,
      tags: products.tags,
      voteCount: products.voteCount,
      createdAt: products.createdAt,
      approvedAt: products.approvedAt,
      status: products.status,
      submittedBy: products.submittedBy,
      userId: products.userId,
      organizationId: products.organizationId,
      name: productTranslations.name,
      tagline: productTranslations.tagline,
      description: productTranslations.description,
      locale: productTranslations.locale,
    })
    .from(products)
    .leftJoin(
      productTranslations,
      and(
        eq(products.id, productTranslations.productId),
        eq(productTranslations.locale, locale)
      )
    )
    .where(eq(products.status, "approved"))
    .orderBy(desc(products.voteCount))
}

// Get product by slug with translation
export async function getProductBySlugWithLocale(slug: string, locale: string) {
  const result = await db
    .select({
      id: products.id,
      slug: products.slug,
      websiteUrl: products.websiteUrl,
      tags: products.tags,
      voteCount: products.voteCount,
      createdAt: products.createdAt,
      approvedAt: products.approvedAt,
      status: products.status,
      submittedBy: products.submittedBy,
      userId: products.userId,
      organizationId: products.organizationId,
      name: productTranslations.name,
      tagline: productTranslations.tagline,
      description: productTranslations.description,
      locale: productTranslations.locale,
    })
    .from(products)
    .leftJoin(
      productTranslations,
      and(
        eq(products.id, productTranslations.productId),
        eq(productTranslations.locale, locale)
      )
    )
    .where(eq(products.slug, slug))
    .limit(1)

  return result[0]
}

// Get recently launched with locale
export async function getRecentlyLaunchedProductsWithLocale(
  locale: string,
  limit: number = 10
) {
  return await db
    .select({
      id: products.id,
      slug: products.slug,
      websiteUrl: products.websiteUrl,
      tags: products.tags,
      voteCount: products.voteCount,
      createdAt: products.createdAt,
      approvedAt: products.approvedAt,
      status: products.status,
      submittedBy: products.submittedBy,
      userId: products.userId,
      organizationId: products.organizationId,
      name: productTranslations.name,
      tagline: productTranslations.tagline,
      description: productTranslations.description,
      locale: productTranslations.locale,
    })
    .from(products)
    .leftJoin(
      productTranslations,
      and(
        eq(products.id, productTranslations.productId),
        eq(productTranslations.locale, locale)
      )
    )
    .where(eq(products.status, "approved"))
    .orderBy(desc(products.createdAt))
    .limit(limit)
}
```

### Step 4: Update Types

```typescript
// lib/types.ts
import { InferSelectModel } from "drizzle-orm"
import { products, productTranslations } from "@/db/schema"

export type ProductType = InferSelectModel<typeof products>
export type ProductTranslationType = InferSelectModel<
  typeof productTranslations
>

// Combined product with translation
export type ProductWithTranslation = ProductType & {
  name: string
  tagline: string | null
  description: string | null
  locale: string
}
```

### Step 5: Update Pages to Use Locale

Example for explore page:

```typescript
// app/[locale]/explore/page.tsx
export default async function ExplorePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("ExplorePage")

  // OLD: const products = await getAllApprovedProducts()
  // NEW: Get products with translations for current locale
  const products = await getAllApprovedProductsWithLocale(locale)

  return (
    <section className="bg-slate-100 flex-1 flex flex-col">
      <div className="container py-10 space-y-4">
        <SectionHeader
          icon={CompassIcon}
          title={t("title")}
          description={t("description")}
          headingLevel="h1"
        />
        <ProductSearch products={products} />
      </div>
    </section>
  )
}
```

### Step 6: Update Product Submission Form

When submitting a product, create the default English translation:

```typescript
// lib/product-actions.ts - UPDATE addProductAction

// After inserting product
const [newProduct] = await db
  .insert(products)
  .values({
    slug,
    websiteUrl,
    tags: tags || [],
    status: "pending",
    submittedBy: userEmail,
    userId,
  })
  .returning()

// Insert default English translation
await db.insert(productTranslations).values({
  productId: newProduct.id,
  locale: "en", // Default locale
  name,
  tagline,
  description,
})
```

### Step 7: Adding Translations

You have several options for adding translations:

#### Option A: Admin Panel Translation UI

Create a page where admins can add translations for approved products:

```typescript
// app/[locale]/admin/translate/[productId]/page.tsx
// Form to add/edit translations in different locales
```

#### Option B: AI Translation Integration

Use AI to auto-translate when a product is approved:

```typescript
async function autoTranslateProduct(
  productId: number,
  fromLocale: string,
  toLocales: string[]
) {
  // Get original translation
  const original = await db
    .select()
    .from(productTranslations)
    .where(
      and(
        eq(productTranslations.productId, productId),
        eq(productTranslations.locale, fromLocale)
      )
    )
    .limit(1)

  // For each target locale, use AI to translate
  for (const locale of toLocales) {
    // Use OpenAI, DeepL, or other translation service
    const translated = await translateWithAI(
      {
        name: original[0].name,
        tagline: original[0].tagline,
        description: original[0].description,
      },
      locale
    )

    // Insert translation
    await db.insert(productTranslations).values({
      productId,
      locale,
      name: translated.name,
      tagline: translated.tagline,
      description: translated.description,
    })
  }
}
```

#### Option C: User-Contributed Translations

Allow community members to submit translations (like Wikipedia).

## Migration Checklist

- [x] Update schema with `productTranslations` table
- [ ] Generate and run Drizzle migration: `npx drizzle-kit generate && npx drizzle-kit migrate`
- [ ] Run data migration script to move existing data
- [ ] Update `lib/db-queries.ts` with new query functions
- [ ] Update `lib/types.ts` with new types
- [ ] Update all pages to use locale-aware queries
- [ ] Update product submission form to create default translation
- [ ] Decide on translation strategy (admin panel, AI, community)
- [ ] Test all functionality with multiple locales

## Fallback Strategy

If a translation doesn't exist for a locale, fall back to English:

```typescript
export async function getProductWithTranslation(
  productId: number,
  locale: string
) {
  // Try to get translation for requested locale
  let result = await db
    .select()
    .from(products)
    .leftJoin(
      productTranslations,
      and(
        eq(products.id, productTranslations.productId),
        eq(productTranslations.locale, locale)
      )
    )
    .where(eq(products.id, productId))
    .limit(1)

  // If no translation found, fall back to English
  if (!result[0] || !result[0].product_translations) {
    result = await db
      .select()
      .from(products)
      .leftJoin(
        productTranslations,
        and(
          eq(products.id, productTranslations.productId),
          eq(productTranslations.locale, "en")
        )
      )
      .where(eq(products.id, productId))
      .limit(1)
  }

  return result[0]
}
```

## Benefits of This Approach

✅ **Flexible**: Add new languages without changing schema
✅ **Efficient**: Only load translations for current locale
✅ **SEO-Friendly**: Different content per language
✅ **User-Friendly**: Products can be added without translations (use fallback)
✅ **Scalable**: Can add translation workflows later
✅ **Clean**: Separation between translatable and non-translatable content

## Next Steps

1. Run the migration commands
2. Test with a few products
3. Decide on your translation strategy
4. Build admin UI or integration for adding translations

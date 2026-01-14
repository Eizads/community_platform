# Next Steps for Database Translation

## ✅ What's Been Completed

1. **Schema Updated**: `productTranslations` table added to store translations
2. **Product Actions Updated**: `addProductAction` now creates default English translations
3. **Database Queries Updated**: All queries now accept `locale` parameter with English fallback
4. **Pages Updated**: All pages now pass locale to database queries
5. **Translation Files Updated**: Added "RecentlyLaunched" section to en.json and es.json

## 🚀 Required Steps to Complete Implementation

### Step 1: Generate and Run Migration

```bash
# Generate migration from schema changes
npx drizzle-kit generate

# Review the generated migration file in drizzle/ folder

# Apply the migration to your database
npx drizzle-kit migrate
```

### Step 2: Migrate Existing Data

You need to move existing product data (name, tagline, description) from the `products` table to the `product_translations` table.

**Option A: Manual SQL** (if you have few products)

```sql
-- For each existing product, create an English translation
INSERT INTO product_translations (product_id, locale, name, tagline, description)
SELECT id, 'en', name, tagline, description
FROM products
WHERE name IS NOT NULL;

-- Then drop the old columns (after verifying data is migrated)
ALTER TABLE products DROP COLUMN name;
ALTER TABLE products DROP COLUMN tagline;
ALTER TABLE products DROP COLUMN description;
```

**Option B: Create a migration script** (recommended)

```typescript
// db/migrate-existing-data.ts
import { db } from "./index"
import { products, productTranslations } from "./schema"

async function migrateExistingData() {
  try {
    // Get all existing products (before schema change is applied)
    const allProducts = await db.select().from(products)

    console.log(`Found ${allProducts.length} products to migrate`)

    for (const product of allProducts) {
      // Create English translation for each product
      await db.insert(productTranslations).values({
        productId: product.id,
        locale: "en",
        name: product.name || "Untitled",
        tagline: product.tagline || "",
        description: product.description || "",
      })
      console.log(`Migrated product: ${product.name}`)
    }

    console.log("✅ Data migration complete!")
  } catch (error) {
    console.error("❌ Migration failed:", error)
    throw error
  }
}

migrateExistingData()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))
```

Run it: `npx tsx db/migrate-existing-data.ts`

### Step 3: Test the Application

```bash
npm run dev
```

Test:

- ✅ Submit a new product → should create translation
- ✅ View products in English (`/en/explore`)
- ✅ View products in Spanish (`/es/explore`)
- ✅ Voting still works
- ✅ Admin panel shows products correctly

### Step 4: Add Spanish Translations (Optional)

For now, Spanish pages will show English content (fallback). To add Spanish translations:

**Option A: Manual Entry**
Create an admin interface to add translations for each product:

```typescript
// Example: Add Spanish translation for a product
await db.insert(productTranslations).values({
  productId: 1,
  locale: "es",
  name: "Nombre del Producto",
  tagline: "Descripción corta",
  description: "Descripción completa del producto",
})
```

**Option B: AI Translation Service**
Use OpenAI, DeepL, or Google Translate API to auto-translate:

```typescript
async function translateProduct(productId: number) {
  const [englishTranslation] = await db
    .select()
    .from(productTranslations)
    .where(
      and(
        eq(productTranslations.productId, productId),
        eq(productTranslations.locale, "en")
      )
    )

  // Call translation API
  const spanishName = await translateText(englishTranslation.name, "es")
  const spanishTagline = await translateText(englishTranslation.tagline, "es")
  const spanishDescription = await translateText(
    englishTranslation.description,
    "es"
  )

  // Insert Spanish translation
  await db.insert(productTranslations).values({
    productId,
    locale: "es",
    name: spanishName,
    tagline: spanishTagline,
    description: spanishDescription,
  })
}
```

## 📋 Current Behavior

### What Works Now:

- ✅ New products are submitted with English translation
- ✅ All pages fetch products based on current locale
- ✅ Fallback to English if translation doesn't exist
- ✅ Voting works across all locales
- ✅ Admin panel works with new structure

### What Needs Configuration:

- ⚠️ Database migration needs to be run
- ⚠️ Existing product data needs to be migrated
- ⚠️ Spanish translations need to be added (optional, will show English as fallback)

## 🎯 Future Enhancements

1. **Admin Translation UI**: Build interface for admins to add/edit translations
2. **Auto-Translation**: Integrate AI translation service for automatic translations
3. **Community Translations**: Allow users to submit translations (like Wikipedia)
4. **Translation Status**: Track which products have complete translations
5. **Locale-Specific SEO**: Different meta tags per language

## 🔍 How It Works

### Database Structure:

```
products (language-agnostic data)
├── id: 1
├── slug: "my-product"
├── voteCount: 42
├── status: "approved"
└── ...

product_translations (translatable content)
├── id: 1, productId: 1, locale: "en", name: "My Product", tagline: "..."
└── id: 2, productId: 1, locale: "es", name: "Mi Producto", tagline: "..."
```

### Query Logic:

1. Request comes for `/es/products`
2. Query joins `products` with `productTranslations` for `locale = 'es'`
3. If Spanish translation exists → use it
4. If not → fallback to English translation
5. Display product with appropriate language

## ⚠️ Important Notes

- **Do NOT delete** old `name`, `tagline`, `description` columns from `products` table until data is fully migrated
- **Test thoroughly** after migration
- **Backup your database** before running migrations
- Existing products will show in English on Spanish pages until translations are added
- The fallback mechanism ensures no broken content

## 📞 Need Help?

If you encounter issues:

1. Check that migration ran successfully
2. Verify data was migrated to `product_translations`
3. Check browser console for errors
4. Verify locale is being passed to all queries

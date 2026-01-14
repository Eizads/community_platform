import "dotenv/config"
import { drizzle } from "drizzle-orm/neon-http"
import { neon } from "@neondatabase/serverless"
import { products, productTranslations } from "./schema"
import { allProducts } from "./data"
import { eq, and } from "drizzle-orm"

const db = drizzle(process.env.DATABASE_URL!)
const sql = neon(process.env.DATABASE_URL!)

async function main() {
  console.log("🌱 Seeding database...")

  // Clear existing data
  await db.delete(products)
  console.log("✅ Cleared existing data")

  // Reset the sequence to start from 1
  // false means the sequence hasn't been used yet, so nextval() will return 1
  await sql`SELECT setval('products_id_seq', 1, false)`
  console.log("✅ Reset sequence to start from 1")

  // Insert products with translations
  for (const product of allProducts) {
    // Insert product (without translatable fields)
    const [newProduct] = await db
      .insert(products)
      .values({
        slug: product.slug,
        websiteUrl: product.websiteUrl,
        tags: product.tags,
        voteCount: product.voteCount || 0,
        createdAt: product.createdAt,
        approvedAt: product.approvedAt,
        status: product.status,
        submittedBy: product.submittedBy,
      })
      .returning()

    // Insert English translation
    await db.insert(productTranslations).values({
      productId: newProduct.id,
      locale: "en",
      name: product.name,
      tagline: product.tagline,
      description: product.description,
    })

    console.log(
      `✅ Added product: ${product.name} (${product.voteCount || 0} votes)`
    )
  }

  // Reset the sequence to the maximum ID value (so next insert continues correctly)
  await sql`SELECT setval('products_id_seq', COALESCE((SELECT MAX(id) FROM products), 0), true)`
  console.log("✅ Sequence set to continue from max ID")

  // Verify inserted products
  const insertedProducts = await db.select().from(products)
  console.log(`\n🎉 Successfully seeded ${insertedProducts.length} products!`)

  console.log("\n📦 Products in database:")
  for (const product of insertedProducts) {
    const [translation] = await db
      .select()
      .from(productTranslations)
      .where(
        and(
          eq(productTranslations.productId, product.id),
          eq(productTranslations.locale, "en")
        )
      )
      .limit(1)
    console.log(
      `  - ${translation?.name || "Unknown"} (${product.slug}) - ${
        product.voteCount
      } votes`
    )
  }
}

main()
  .catch(error => {
    console.error("❌ Error seeding database:", error)
    process.exit(1)
  })
  .finally(() => {
    console.log("\n✨ Seeding complete!")
    process.exit(0)
  })

import "dotenv/config"
import { db, products } from "./index"
import { allProducts } from "./data"

async function seed() {
  try {
    console.log("🌱 Starting database seed...")

    // Insert products
    console.log(`📦 Inserting ${allProducts.length} products...`)
    await db.insert(products).values(allProducts)

    console.log("✅ Seed completed successfully!")
  } catch (error) {
    console.error("❌ Error seeding database:", error)
    process.exit(1)
  }
}

// Run the seed function
seed()
  .then(() => {
    console.log("🎉 Seed script finished")
    process.exit(0)
  })
  .catch(error => {
    console.error("💥 Seed script failed:", error)
    process.exit(1)
  })

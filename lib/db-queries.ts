import { db } from "@/db"
import { products } from "@/db/schema"
import { eq, desc } from "drizzle-orm"
import { connection } from "next/server"

export async function getFeaturedProducts() {
  "use cache"
  const productsData = await db
    .select()
    .from(products)
    .where(eq(products.status, "approved"))
    .orderBy(desc(products.voteCount))
  return productsData
}
export async function getAllProducts() {
  const productsData = await db
    .select()
    .from(products)
    .where(eq(products.status, "approved"))
    .orderBy(desc(products.voteCount))
  return productsData
}

export async function getRecentlyLaunchedProducts() {
  await connection()
  const productsData = await getAllProducts()
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  console.log(typeof thirtyDaysAgo)

  return productsData.filter(
    product => product.createdAt && product.createdAt >= thirtyDaysAgo
  )
}

// lib/db-queries.ts
export async function getProductById(id: number) {
  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.id, id))
    .limit(1)

  return product || null
}

export async function getProductBySlug(slug: string) {
  "use cache"
  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.slug, slug))
    .limit(1)

  return product ?? null
}

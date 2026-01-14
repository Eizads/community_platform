import { db } from "@/db"
import { products, productTranslations } from "@/db/schema"
import { eq, desc, gt, and, sql, SQL } from "drizzle-orm"
import { connection } from "next/server"

// Helper to get products with translations, with fallback to English
async function getProductsWithTranslations(
  locale: string,
  whereClause?: SQL,
  orderByClause?: SQL,
  limit?: number
) {
  // First try to get with requested locale, fallback to English if not found
  const query = db
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
      name: sql<string>`COALESCE(
        ${productTranslations.name},
        (SELECT name FROM ${productTranslations} WHERE product_id = ${products.id} AND locale = 'en' LIMIT 1)
      )`.as("name"),
      tagline: sql<string | null>`COALESCE(
        ${productTranslations.tagline},
        (SELECT tagline FROM ${productTranslations} WHERE product_id = ${products.id} AND locale = 'en' LIMIT 1)
      )`.as("tagline"),
      description: sql<string | null>`COALESCE(
        ${productTranslations.description},
        (SELECT description FROM ${productTranslations} WHERE product_id = ${products.id} AND locale = 'en' LIMIT 1)
      )`.as("description"),
      locale: sql<string>`COALESCE(
        ${productTranslations.locale},
        'en'
      )`.as("locale"),
    })
    .from(products)
    .leftJoin(
      productTranslations,
      and(
        eq(products.id, productTranslations.productId),
        eq(productTranslations.locale, locale)
      )
    )

  if (whereClause) {
    query.where(whereClause)
  }
  if (orderByClause) {
    query.orderBy(orderByClause)
  }
  if (limit) {
    query.limit(limit)
  }

  return query
}

export async function getAllProducts(locale: string = "en") {
  return await getProductsWithTranslations(locale)
}

export async function getFeaturedProducts(locale: string = "en") {
  "use cache"
  return await getProductsWithTranslations(
    locale,
    and(eq(products.status, "approved"), gt(products.voteCount, 100)),
    desc(products.voteCount)
  )
}

export async function getAllApprovedProducts(locale: string = "en") {
  return await getProductsWithTranslations(
    locale,
    eq(products.status, "approved"),
    desc(products.voteCount)
  )
}

export async function getRecentlyLaunchedProducts(locale: string = "en") {
  await connection()
  const productsData = await getAllApprovedProducts(locale)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  console.log(typeof thirtyDaysAgo)

  return productsData.filter(
    product => product.createdAt && product.createdAt >= thirtyDaysAgo
  )
}

export async function getProductById(id: number, locale: string = "en") {
  const result = await getProductsWithTranslations(
    locale,
    eq(products.id, id),
    undefined,
    1
  )
  return result[0] || null
}

export async function getProductBySlug(slug: string, locale: string = "en") {
  "use cache"
  const result = await getProductsWithTranslations(
    locale,
    eq(products.slug, slug),
    undefined,
    1
  )
  return result[0] ?? null
}

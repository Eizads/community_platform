"use server"

import { auth, currentUser } from "@clerk/nextjs/server"
import { z } from "zod"
import { db } from "@/db"
import { products } from "@/db/schema"
import { eq, sql } from "drizzle-orm"
import { revalidatePath } from "next/cache"

interface State {
  success: boolean
  errors?: Record<string, string[]>
  message: string | null
  values?: {
    name?: string
    slug?: string
    tagline?: string
    description?: string
    websiteUrl?: string
    tags?: string
  }
}

const productSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters" })
    .max(120, { message: "Name must be less than 120 characters" }),
  slug: z
    .string()
    .min(3, { message: "Slug must be at least 3 characters" })
    .max(140, { message: "Slug must be less than 140 characters" })
    .regex(/^[a-z0-9-]+$/, {
      message: "Slug must contain only lowercase letters, numbers, and hyphens",
    }),
  tagline: z
    .string()
    .min(3, { message: "Tagline must be at least 3 characters" })
    .max(200, { message: "Tagline must be less than 200 characters" }),
  description: z.string().optional(),
  websiteUrl: z
    .string()
    .transform(val => (val === "" ? undefined : val))
    .pipe(z.string().url().optional()),
  tags: z
    .string()
    .min(1, { message: "Tags are required" })
    .transform(val => val.split(",").map(tag => tag.trim().toLowerCase())),
})

export async function addProductAction(prevState: State, formData: FormData) {
  //auth
  try {
    const { userId } = await auth()
    if (!userId) {
      const data = Object.fromEntries(formData.entries())
      return {
        success: false,
        errors: {},
        message: "You must be logged in to submit a product",
        values: {
          name: data.name as string,
          slug: data.slug as string,
          tagline: data.tagline as string,
          description: data.description as string,
          websiteUrl: data.websiteUrl as string,
          tags: data.tags as string,
        },
      }
    }
    const user = await currentUser()
    const userEmail = user?.emailAddresses[0].emailAddress || "anonymous"
    //data
    const data = Object.fromEntries(formData.entries())
    // console.log(data, "form submitted") // Commented out for production - exposes user form input

    //validate data
    const validatedFields = productSchema.safeParse(data)
    if (!validatedFields.success) {
      // console.log(
      //   validatedFields.error.flatten().fieldErrors,
      //   "invalid form data"
      // ) // Commented out for production - exposes user input validation errors
      return {
        success: false,
        errors: validatedFields.error.flatten().fieldErrors,
        message: "Invalid form data",
        values: {
          name: data.name as string,
          slug: data.slug as string,
          tagline: data.tagline as string,
          description: data.description as string,
          websiteUrl: data.websiteUrl as string,
          tags: data.tags as string,
        },
      }
    }
    const { name, slug, tagline, description, websiteUrl, tags } =
      validatedFields.data

    // const tagsArray = tags ? tags.filter(tag => typeof tag === "string") : []

    //transform data
    await db.insert(products).values({
      name,
      slug,
      tagline,
      description,
      websiteUrl,
      tags: tags || [],
      status: "pending",
      submittedBy: userEmail,
      userId,
    })

    return {
      success: true,
      errors: {},
      message: "Product submitted successfully. It will be reviewed shortly.",
    }
  } catch (error) {
    console.error(error, "failed to submit product")

    if (error instanceof z.ZodError) {
      const data = Object.fromEntries(formData.entries())
      return {
        success: false,
        errors: error.flatten().fieldErrors,
        message: "Invalid form data. Please check your inputs.",
        values: {
          name: data.name as string,
          slug: data.slug as string,
          tagline: data.tagline as string,
          description: data.description as string,
          websiteUrl: data.websiteUrl as string,
          tags: data.tags as string,
        },
      }
    }
    const data = Object.fromEntries(formData.entries())
    return {
      success: false,
      errors: {},
      message: "Failed to submit product. Please try again.",
      values: {
        name: data.name as string,
        slug: data.slug as string,
        tagline: data.tagline as string,
        description: data.description as string,
        websiteUrl: data.websiteUrl as string,
        tags: data.tags as string,
      },
    }
  }
}

export async function upvoteProductAction(productId: number) {
  try {
    // const { userId } = await auth()
    // if (!userId) {
    //   return {
    //     success: false,
    //     message: "You must be logged in to vote",
    //   }
    // }
    await db
      .update(products)
      .set({
        voteCount: sql`GREATEST(${products.voteCount} + 1, 0)`,
      })
      .where(eq(products.id, productId))

    // Fetch slug to revalidate the product page
    const [product] = await db
      .select({ slug: products.slug })
      .from(products)
      .where(eq(products.id, productId))
      .limit(1)

    // Revalidate for all locales
    const locales = ["en", "es"]
    locales.forEach(locale => {
      revalidatePath(`/${locale}`)
      revalidatePath(`/${locale}/explore`)
      revalidatePath(`/${locale}/products`)
      if (product?.slug) {
        revalidatePath(`/${locale}/products/${product.slug}`)
      }
    })
    return {
      success: true,
      message: "Product voted successfully",
    }
  } catch (error) {
    console.error(error, "failed to upvote product")
    return {
      success: false,
      message: "Failed to upvote product. Please try again.",
      voteCount: 0,
    }
  }
}
export async function downvoteProductAction(productId: number) {
  try {
    // const { userId } = await auth()
    // if (!userId) {
    //   return {
    //     success: false,
    //     message: "You must be logged in to vote",
    //   }
    // }
    await db
      .update(products)
      .set({
        voteCount: sql`GREATEST(${products.voteCount} - 1, 0)`,
      })
      .where(eq(products.id, productId))

    // Fetch slug to revalidate the product page
    const [product] = await db
      .select({ slug: products.slug })
      .from(products)
      .where(eq(products.id, productId))
      .limit(1)

    // Revalidate for all locales
    const locales = ["en", "es"]
    locales.forEach(locale => {
      revalidatePath(`/${locale}`)
      revalidatePath(`/${locale}/explore`)
      revalidatePath(`/${locale}/products`)
      if (product?.slug) {
        revalidatePath(`/${locale}/products/${product.slug}`)
      }
    })
    return {
      success: true,
      message: "Product downvoted successfully",
    }
  } catch (error) {
    console.error(error, "failed to downvote product")
    return {
      success: false,
      message: "Failed to downvote product. Please try again.",
      voteCount: 0,
    }
  }
}

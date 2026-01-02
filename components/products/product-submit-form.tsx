"use client"
import FormField from "../forms/form-field"
import { Button } from "../ui/button"
import { Loader2Icon, SparklesIcon } from "lucide-react"
import { addProductAction } from "@/lib/product-actions"
import { useActionState, useEffect } from "react"
import { toast } from "sonner"

const initialState: {
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
} = {
  success: false,
  errors: {},
  message: null,
  values: undefined,
}
export default function ProductSubmitForm() {
  const [state, formAction, isPending] = useActionState(
    addProductAction,
    initialState
  )
  const { errors, message, success, values } = state

  // Show toast when message changes
  useEffect(() => {
    if (message) {
      if (success) {
        toast.success(message)
      } else {
        toast.error(message)
      }
    }
  }, [message, success])

  return (
    <form className="space-y-6" action={formAction} noValidate>
      <FormField
        id="name"
        name="name"
        label="Name*"
        placeholder="Enter the name of the product"
        required
        onChange={() => {}}
        error={errors?.name?.[0] || ""}
        helperText={undefined}
        defaultValue={values?.name}
      />
      <FormField
        id="slug"
        name="slug"
        label="Slug*"
        placeholder="Enter the slug of the product"
        required
        onChange={() => {}}
        error={errors?.slug?.[0] || ""}
        helperText="The slug is the URL-friendly version of the product name."
        defaultValue={values?.slug}
      />
      <FormField
        id="tagline"
        name="tagline"
        label="Tagline*"
        placeholder="A short, catchy tagline for your product"
        required
        onChange={() => {}}
        error={errors?.tagline?.[0] || ""}
        helperText={undefined}
        defaultValue={values?.tagline}
      />
      <FormField
        id="description"
        name="description"
        label="Description"
        placeholder="Tell us about your product"
        onChange={() => {}}
        error={errors?.description?.[0] || ""}
        helperText={undefined}
        textarea={true}
        defaultValue={values?.description}
      />
      <FormField
        id="websiteUrl"
        name="websiteUrl"
        label="Website URL"
        placeholder="https://example.com"
        onChange={() => {}}
        error={errors?.websiteUrl?.[0] || ""}
        helperText="The website URL is the URL of the product's website."
        defaultValue={values?.websiteUrl}
      />
      <FormField
        id="tags"
        name="tags"
        label="Tags*"
        placeholder="AI, Productivity, SaaS"
        required
        onChange={() => {}}
        error={errors?.tags?.[0] || ""}
        helperText="The tags are the keywords that describe your product."
        defaultValue={values?.tags}
      />
      {isPending ? (
        <Button type="submit" className="w-full" disabled>
          <Loader2Icon className="w-4 h-4 animate-spin" /> Submitting...
        </Button>
      ) : (
        <Button type="submit" className="w-full">
          <SparklesIcon className="w-4 h-4" /> Submit Product
        </Button>
      )}
    </form>
  )
}

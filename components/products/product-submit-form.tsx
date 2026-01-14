"use client"
import FormField from "../forms/form-field"
import { Button } from "../ui/button"
import { Loader2Icon, SparklesIcon } from "lucide-react"
import { addProductAction } from "@/lib/product-actions"
import { useActionState, useEffect } from "react"
import { toast } from "sonner"
import { useTranslations } from "next-intl"

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
  const t = useTranslations("SubmitForm")
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
        label={t("nameLabel")}
        placeholder={t("namePlaceholder")}
        required
        onChange={() => {}}
        error={errors?.name?.[0] || ""}
        helperText={undefined}
        defaultValue={values?.name}
      />
      <FormField
        id="slug"
        name="slug"
        label={t("slugLabel")}
        placeholder={t("slugPlaceholder")}
        required
        onChange={() => {}}
        error={errors?.slug?.[0] || ""}
        helperText={t("slugHelper")}
        defaultValue={values?.slug}
      />
      <FormField
        id="tagline"
        name="tagline"
        label={t("taglineLabel")}
        placeholder={t("taglinePlaceholder")}
        required
        onChange={() => {}}
        error={errors?.tagline?.[0] || ""}
        helperText={undefined}
        defaultValue={values?.tagline}
      />
      <FormField
        id="description"
        name="description"
        label={t("descriptionLabel")}
        placeholder={t("descriptionPlaceholder")}
        onChange={() => {}}
        error={errors?.description?.[0] || ""}
        helperText={undefined}
        textarea={true}
        defaultValue={values?.description}
      />
      <FormField
        id="websiteUrl"
        name="websiteUrl"
        label={t("websiteUrlLabel")}
        placeholder={t("websiteUrlPlaceholder")}
        onChange={() => {}}
        error={errors?.websiteUrl?.[0] || ""}
        helperText={t("websiteUrlHelper")}
        defaultValue={values?.websiteUrl}
      />
      <FormField
        id="tags"
        name="tags"
        label={t("tagsLabel")}
        placeholder={t("tagsPlaceholder")}
        required
        onChange={() => {}}
        error={errors?.tags?.[0] || ""}
        helperText={t("tagsHelper")}
        defaultValue={values?.tags}
      />
      {isPending ? (
        <Button type="submit" className="w-full" disabled>
          <Loader2Icon className="w-4 h-4 animate-spin" />{" "}
          {t("submittingButton")}
        </Button>
      ) : (
        <Button type="submit" className="w-full">
          <SparklesIcon className="w-4 h-4" /> {t("submitButton")}
        </Button>
      )}
    </form>
  )
}

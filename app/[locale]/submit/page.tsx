import SectionHeader from "@/components/common/section-header"
import { SparklesIcon } from "lucide-react"
import ProductSubmitForm from "@/components/products/product-submit-form"
import { setRequestLocale, getTranslations } from "next-intl/server"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function SubmitPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("SubmitPage")
  return (
    <section className="bg-slate-100 min-h-screen">
      <div className="container py-10 space-y-10">
        <SectionHeader
          icon={SparklesIcon}
          title={t("title")}
          description={t("description")}
          headingLevel="h1"
        />
        <div className="max-w-2xl mx-auto ">
          <ProductSubmitForm />
        </div>
      </div>
    </section>
  )
}

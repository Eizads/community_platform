import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"
function Products() {
  return (
    <section className="bg-slate-100 flex-1 flex items-center justify-center">
      <div className="container flex flex-col items-center justify-center py-10 space-y-4">
        <h1>Please navigate to the home page to view the products</h1>
        <Link href="/" className="inline-flex items-center gap-2">
          <ArrowLeftIcon className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    </section>
  )
}

export default Products

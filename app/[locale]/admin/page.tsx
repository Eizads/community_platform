import SectionHeader from "@/components/common/section-header"
import { InboxIcon, ShieldIcon } from "lucide-react"
import { auth, clerkClient } from "@clerk/nextjs/server"
import { redirect } from "@/i18n/navigation"
import { getAllProducts } from "@/lib/db-queries"
import EmptyState from "@/components/common/empty-state"
import StatsCardAdmin from "@/components/admin/stats-card-admin"
import AdminProductCard from "@/components/admin/admin-product-card"
import { setRequestLocale } from "next-intl/server"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function AdminPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  
  // checking if user is authenticated and is an admin
  const { userId } = await auth()
  // console.log("userId", userId) // Commented out for production - exposes user IDs
  if (!userId) {
    return redirect("/sign-in")
  }
  const client = await clerkClient()
  const user = await client.users.getUser(userId)
  // console.log("user", user) // Commented out for production - exposes sensitive user data (emails, metadata, etc.)
  const metadata = user.publicMetadata
  const isAdmin = metadata?.isAdmin ?? false
  if (!isAdmin) {
    return redirect("/")
  }

  // get all products
  const products = await getAllProducts()
  const totalProducts = products.length
  const approvedProducts = products.filter(
    product => product.status === "approved"
  ).length
  const rejectedProducts = products.filter(
    product => product.status === "rejected"
  ).length
  const pendingProducts = products.filter(
    product => product.status === "pending"
  ).length

  const pendingApprovalProducts = products.filter(
    product => product.status === "pending"
  )

  return (
    <section className="bg-slate-100 flex-1 flex flex-col">
      <div className="container py-10 space-y-8">
        <SectionHeader
          icon={ShieldIcon}
          title="Product Admin"
          description="Review and manage submitted products"
          headingLevel="h1"
        />
        {/* stats card */}
        <StatsCardAdmin
          totalProducts={totalProducts}
          approvedProducts={approvedProducts}
          rejectedProducts={rejectedProducts}
          pendingProducts={pendingProducts}
        />
        {/* {pending approval} */}
        <h2 className="text-2xl font-bold">
          Pending Approval ({pendingApprovalProducts.length})
        </h2>

        {pendingApprovalProducts.length === 0 ? (
          <EmptyState
            icon={InboxIcon}
            message="No pending products to review. Check back later!"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 mt-10">
            {pendingApprovalProducts.map(product => (
              <AdminProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
        {/* all products */}

        <h2 className="text-2xl font-bold">All Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          {products.map(product => (
            <AdminProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}

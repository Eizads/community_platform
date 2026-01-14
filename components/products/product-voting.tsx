"use client"

import { Button } from "../ui/button"
import { ChevronUpIcon, ChevronDownIcon } from "lucide-react"
import { startTransition, useOptimistic } from "react"
import {
  upvoteProductAction,
  downvoteProductAction,
} from "@/lib/product-actions"
import { toast } from "sonner"
// import { useAuth } from "@clerk/nextjs"
import { cn } from "@/lib/utils"
import { ProductWithTranslation } from "@/lib/types"

export default function ProductVoting({
  product,
}: {
  product: ProductWithTranslation
}) {
  // const { isSignedIn } = useAuth()

  const [optimisticVoteCount, setOptimisticVoteCount] = useOptimistic(
    product.voteCount,
    (state, action: "up" | "down") => {
      if (action === "up") {
        return state + 1
      } else {
        if (state > 0) {
          return state - 1
        } else {
          return state
        }
      }
    }
  )

  const handleVote = async (e: React.MouseEvent, direction: "up" | "down") => {
    // console.log("handleVote called", direction, "isSignedIn:", isSignedIn) // Commented out for production - tracks user behavior
    e.stopPropagation()
    e.preventDefault()

    if (direction === "up") {
      startTransition(() => {
        setOptimisticVoteCount("up")
      })
      const result = await upvoteProductAction(product.id)
      if (result.success) {
        // console.log(result, "upvote result") // Commented out for production
        // Don't manually update voteCount - revalidatePath will refresh the data
        // The optimistic value will sync when the component re-renders with new data
      } else {
        // console.log(result, "upvote failed") // Commented out for production
        toast.error(result.message)
        startTransition(() => {
          setOptimisticVoteCount("down") // Revert optimistic update
        })
      }
    } else {
      startTransition(() => {
        setOptimisticVoteCount("down")
      })
      const result = await downvoteProductAction(product.id)
      if (result.success) {
        // console.log(result, "downvote result") // Commented out for production
        // Don't manually update voteCount - revalidatePath will refresh the data
        // The optimistic value will sync when the component re-renders with new data
      } else {
        // console.log(result, "downvote failed") // Commented out for production
        toast.error(result.message)
        startTransition(() => {
          setOptimisticVoteCount("up") // Revert optimistic update
        })
      }
    }
    // Handle vote logic here
    // console.log(`Vote ${direction} for product ${product.slug}`) // Commented out for production - tracks user behavior
  }
  return (
    <div
      className="flex flex-col items-center justify-start gap-1 shrink-0"
      onClick={e => {
        // Stop propagation to prevent Link navigation
        // const target = e.target as HTMLElement
        // If clicking on a button, let it handle the click
        // Otherwise, stop propagation to prevent Link navigation
        // if (!target.closest("button")) {
        e.stopPropagation()
        // }
      }}
    >
      <Button
        variant="ghost"
        size="icon"
        className="text-sky-500"
        onClick={e => handleVote(e, "up")}
        aria-label="Upvote"
      >
        <ChevronUpIcon className="w-4 h-4 " />
      </Button>
      <span
        className={cn(
          "text-sm font-semibold transition-colors",
          "text-sky-600"
        )}
      >
        {optimisticVoteCount}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="text-sky-500"
        onClick={e => handleVote(e, "down")}
        aria-label="Downvote"
      >
        <ChevronDownIcon className="w-4 h-4 " />
      </Button>
    </div>
  )
}

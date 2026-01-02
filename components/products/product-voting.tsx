"use client"

import { Button } from "../ui/button"
import { ChevronUpIcon, ChevronDownIcon } from "lucide-react"
import { startTransition, useOptimistic } from "react"
import {
  upvoteProductAction,
  downvoteProductAction,
} from "@/lib/product-actions"
import { InferSelectModel } from "drizzle-orm"
import { products } from "@/db/schema"
import { toast } from "sonner"
import { useAuth } from "@clerk/nextjs"
import { cn } from "@/lib/utils"
type Product = InferSelectModel<typeof products>

export default function ProductVoting({ product }: { product: Product }) {
  const { isSignedIn, isLoaded } = useAuth()

  // Only disable if auth is loaded AND user is not signed in
  // If auth is still loading (isLoaded = false), keep disabled to prevent premature clicks
  const isDisabled = !isLoaded || !isSignedIn

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
    console.log("handleVote called", direction, "isSignedIn:", isSignedIn)
    e.stopPropagation()
    e.preventDefault()

    if (direction === "up") {
      startTransition(() => {
        setOptimisticVoteCount("up")
      })
      const result = await upvoteProductAction(product.id)
      if (result.success) {
        console.log(result, "upvote result")
        // Don't manually update voteCount - revalidatePath will refresh the data
        // The optimistic value will sync when the component re-renders with new data
      } else {
        console.log(result, "upvote failed")
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
        console.log(result, "downvote result")
        // Don't manually update voteCount - revalidatePath will refresh the data
        // The optimistic value will sync when the component re-renders with new data
      } else {
        console.log(result, "downvote failed")
        toast.error(result.message)
        startTransition(() => {
          setOptimisticVoteCount("up") // Revert optimistic update
        })
      }
    }
    // Handle vote logic here
    console.log(`Vote ${direction} for product ${product.slug}`)
  }
  return (
    <div
      className="flex flex-col items-center justify-start gap-1 shrink-0"
      onClickCapture={e => {
        // Stop propagation to prevent Link navigation
        const target = e.target as HTMLElement
        // If clicking on a button, let it handle the click
        // Otherwise, stop propagation to prevent Link navigation
        if (!target.closest("button")) {
          e.stopPropagation()
        }
        // If not signed in and clicking outside button, show error
        if (!isSignedIn && !target.closest("button")) {
          e.preventDefault()
          toast.error("You must be logged in to vote")
        }
      }}
    >
      <Button
        variant="ghost"
        size="icon"
        className={isSignedIn ? "text-sky-500" : "text-foreground/25 "}
        onClick={e => handleVote(e, "up")}
        disabled={isDisabled}
        aria-label={isSignedIn ? "Upvote" : "Sign in to vote"}
      >
        <ChevronUpIcon className="w-4 h-4 " />
      </Button>
      <span
        className={cn(
          "text-sm font-semibold transition-colors",
          isSignedIn ? "text-sky-600" : "text-foreground/25"
        )}
      >
        {optimisticVoteCount}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className={isSignedIn ? "text-sky-500" : "text-foreground/25"}
        onClick={e => handleVote(e, "down")}
        disabled={isDisabled}
        aria-label={isSignedIn ? "Downvote" : "Sign in to vote"}
      >
        <ChevronDownIcon className="w-4 h-4 " />
      </Button>
    </div>
  )
}

"use client";

import { useMemo, useState } from "react";
import {
  BadgeCheckIcon,
  RotateCwIcon,
  StarIcon,
  ThumbsUpIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from "@/components/shared";
import { cn } from "@/lib/utils";
import { RadioGroup } from "../ui/radio-group";

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
  verifiedPurchase?: boolean;
  helpfulCount: number;
}

const REVIEWS_PER_PAGE = 3;
const MIN_BODY_LENGTH = 10;

const initialReviews: ProductReview[] = [
  {
    id: "r1",
    author: "Amara Boateng",
    rating: 5,
    title: "Exactly as described",
    body: "Fits true to size and the fabric feels a lot more premium than the price suggests. Would buy again.",
    createdAt: "2026-08-14",
    verifiedPurchase: true,
    helpfulCount: 12,
  },
  {
    id: "r2",
    author: "Kwame Owusu",
    rating: 4,
    title: "Good quality, slow shipping",
    body: "Product itself is great — took an extra week to arrive though, so plan ahead if you need it by a date.",
    createdAt: "2026-07-30",
    verifiedPurchase: true,
    helpfulCount: 5,
  },
  {
    id: "r3",
    author: "Efua Mensah",
    rating: 3,
    title: "Decent, not amazing",
    body: "It's fine for the price. Color was slightly duller in person than in the photos.",
    createdAt: "2026-07-22",
    verifiedPurchase: false,
    helpfulCount: 2,
  },
  {
    id: "r4",
    author: "Yaw Asante",
    rating: 5,
    title: "Great value",
    body: "Second time ordering this. Consistent quality both times and customer support was responsive when I had a sizing question.",
    createdAt: "2026-06-19",
    verifiedPurchase: true,
    helpfulCount: 9,
  },
];

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(
    new Date(iso),
  );
}

function StarPickerInput({
  value,
  onChange,
  disabled,
}: {
  value: number;
  onChange: (next: number) => void;
  disabled?: boolean;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const active = hovered ?? value;

  return (
    <RadioGroup
      role="radiogroup"
      aria-label="Rating"
      className="flex items-center gap-1"
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <Button
          variant="ghost"
          size="icon-lg"
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          disabled={disabled}
          className="disabled:cursor-not-allowed disabled:opacity-50"
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(null)}
          onClick={() => onChange(n)}
        >
          <StarIcon
            className={cn(
              "size-6 transition-colors",
              n <= active
                ? "fill-amber-400 text-amber-400"
                : "fill-none text-foreground/50",
            )}
          />
        </Button>
      ))}
    </RadioGroup>
  );
}

function RatingBreakdownBars({ reviews }: { reviews: ProductReview[] }) {
  const counts = useMemo(() => {
    const base: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    for (const r of reviews) base[r.rating] = (base[r.rating] ?? 0) + 1;
    return base;
  }, [reviews]);

  const total = reviews.length;

  return (
    <div className="space-y-2">
      {[5, 4, 3, 2, 1].map((star) => {
        const count = counts[star] ?? 0;
        const percent = total > 0 ? Math.round((count / total) * 100) : 0;
        return (
          <div key={star} className="flex items-center gap-3 text-sm">
            <span className="w-3 shrink-0 text-muted-foreground">{star}</span>
            <StarIcon className="size-3.5 shrink-0 fill-primary text-primary" />
            <Progress
              value={percent}
              className="h-2 flex-1"
              aria-label={`${star} star: ${count} reviews`}
            />
            <span className="w-8 shrink-0 text-right text-muted-foreground">
              {count}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function ProductRatingSection() {
  const [reviews, setReviews] = useState<ProductReview[]>(initialReviews);
  const [visibleCount, setVisibleCount] = useState(REVIEWS_PER_PAGE);
  const [helpfulVoted, setHelpfulVoted] = useState<Set<string>>(new Set());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [draftRating, setDraftRating] = useState(0);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftBody, setDraftBody] = useState("");
  const [touched, setTouched] = useState(false);

  const average = useMemo(() => {
    if (reviews.length === 0) return 0;
    return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  }, [reviews]);

  const visibleReviews = reviews.slice(0, visibleCount);
  const hasMore = visibleCount < reviews.length;

  const bodyError =
    touched && draftBody.trim().length < MIN_BODY_LENGTH
      ? `Review must be at least ${MIN_BODY_LENGTH} characters.`
      : null;
  const ratingError =
    touched && draftRating === 0 ? "Select a star rating." : null;
  const isValid = draftRating > 0 && draftBody.trim().length >= MIN_BODY_LENGTH;

  function resetDraft() {
    setDraftRating(0);
    setDraftTitle("");
    setDraftBody("");
    setTouched(false);
  }

  function handleSubmitReview() {
    setTouched(true);
    if (!isValid) return;

    setIsSubmitting(true);
    // Simulate a network request; replace with a real mutation.
    setTimeout(() => {
      const newReview: ProductReview = {
        id: crypto.randomUUID(),
        author: "You",
        rating: draftRating,
        title: draftTitle.trim() || "Untitled review",
        body: draftBody.trim(),
        createdAt: new Date().toISOString(),
        verifiedPurchase: false,
        helpfulCount: 0,
      };
      setReviews((prev) => [newReview, ...prev]);
      setIsSubmitting(false);
      setDialogOpen(false);
      resetDraft();
      toast.success("Review submitted");
    }, 600);
  }

  function toggleHelpful(id: string) {
    setHelpfulVoted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setReviews((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              helpfulCount: r.helpfulCount + (helpfulVoted.has(id) ? -1 : 1),
            }
          : r,
      ),
    );
  }

  return (
    <section className="container mx-auto py-12">
      <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
        <div className="space-y-6 lg:sticky lg:top-8 lg:self-start">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">
                Customer Reviews
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-4xl font-semibold">{average.toFixed(1)}</p>
                <StarRating rating={average} />
                <p className="mt-1 text-sm text-muted-foreground">
                  Based on {reviews.length} review
                  {reviews.length === 1 ? "" : "s"}
                </p>
              </div>
              <RatingBreakdownBars reviews={reviews} />

              <Dialog
                open={dialogOpen}
                onOpenChange={(open) => {
                  setDialogOpen(open);
                  if (!open) resetDraft();
                }}
              >
                <DialogTrigger asChild>
                  <Button className="w-full" size="lg">
                    Write a review
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Write a review</DialogTitle>
                    <DialogDescription>
                      Share details about your own experience with this product.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Rating</Label>
                      <StarPickerInput
                        value={draftRating}
                        onChange={setDraftRating}
                        disabled={isSubmitting}
                      />
                      {ratingError ? (
                        <p className="text-xs text-destructive">
                          {ratingError}
                        </p>
                      ) : null}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="review-title">Title (optional)</Label>
                      <Input
                        id="review-title"
                        value={draftTitle}
                        onChange={(e) => setDraftTitle(e.target.value)}
                        disabled={isSubmitting}
                        maxLength={80}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="review-body">Review</Label>
                      <Textarea
                        id="review-body"
                        value={draftBody}
                        onChange={(e) => setDraftBody(e.target.value)}
                        onBlur={() => setTouched(true)}
                        required
                        disabled={isSubmitting}
                        rows={4}
                        aria-invalid={Boolean(bodyError)}
                      />
                      {bodyError ? (
                        <p className="text-xs text-destructive">{bodyError}</p>
                      ) : null}
                    </div>
                  </div>

                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" disabled={isSubmitting}>
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button
                      onClick={handleSubmitReview}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <RotateCwIcon className="size-4 animate-spin" />
                      ) : null}
                      Submit review
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>

        <div>
          {reviews.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <StarIcon />
                </EmptyMedia>
                <EmptyTitle>No reviews yet</EmptyTitle>
                <EmptyDescription>
                  Be the first to share your thoughts on this product.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <ul className="space-y-6">
              {visibleReviews.map((review, i) => (
                <li key={review.id}>
                  <article className="flex gap-4">
                    <Avatar className="size-9 shrink-0">
                      <AvatarFallback>
                        {review.author
                          .split(" ")
                          .map((part) => part[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium">
                          {review.author}
                        </span>
                        {review.verifiedPurchase ? (
                          <Badge variant="secondary" className="gap-1">
                            <BadgeCheckIcon className="size-3" />
                            Verified purchase
                          </Badge>
                        ) : null}
                      </div>
                      <div className="flex items-center gap-2">
                        <StarRating rating={review.rating} />
                        <time
                          dateTime={review.createdAt}
                          className="text-xs text-muted-foreground"
                        >
                          {formatDate(review.createdAt)}
                        </time>
                      </div>
                      <p className="text-sm font-medium">{review.title}</p>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {review.body}
                      </p>
                      <button
                        type="button"
                        onClick={() => toggleHelpful(review.id)}
                        aria-pressed={helpfulVoted.has(review.id)}
                        className={cn(
                          "mt-1 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary",
                          helpfulVoted.has(review.id) && "text-primary",
                        )}
                      >
                        <ThumbsUpIcon className="size-3.5" />
                        Helpful ({review.helpfulCount})
                      </button>
                    </div>
                  </article>
                  {i < visibleReviews.length - 1 ? (
                    <Separator className="mt-6" />
                  ) : null}
                </li>
              ))}
            </ul>
          )}

          {hasMore ? (
            <Button
              variant="outline"
              size='lg'
              className="mt-6 w-full"
              onClick={() => setVisibleCount((n) => n + REVIEWS_PER_PAGE)}
            >
              Show more reviews
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}

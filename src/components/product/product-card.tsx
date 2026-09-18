import { Eye, Heart, Repeat, ShoppingBag } from "lucide-react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/lib/cms/types";
import { useCart } from "@/lib/stores/cart";
import { useUi } from "@/lib/stores/ui";
import { useWishlist } from "@/lib/stores/wishlist";
import { cn } from "@/lib/utils";
import { money } from "@/lib/formats";
import { StarRating } from "../shared";
import { Link } from "../layout/site-header";
import { Button } from "../ui/button";
import { ProductBadgeTag } from "../shared/product-badge";

export function ProductCard({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const wished = useWishlist((s) => s.ids.includes(product._id));
  const toggleWish = useWishlist((s) => s.toggle);
  const hover = product.images[1];

  function addToCart() {
    add(product, 1, {
      size: product.sizes?.[0],
      color: product.colors?.[0],
    });
    toast.success("Added to bag", { description: product.title });
  }

  return (
    <article className="group relative overflow-hidden text-foreground rounded-md border border-border/80 bg-card transition-shadow hover:shadow">
      <div className="relative overflow-hidden bg-border/40">
        <Link to={`/product/${product.slug}`} className="block aspect-3/4">
          <img
            src={product.images[0]}
            alt={product.title}
            className={cn(
              "h-full w-full object-cover transition-all duration-500",
              hover && "group-hover:opacity-0 group-hover:scale-110",
            )}
          />
          {hover ? (
            <img
              src={hover}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-0 scale-110 transition-all duration-500 group-hover:opacity-100 group-hover:scale-100"
            />
          ) : null}
        </Link>
        {product.badge ? <ProductBadgeTag badge={product.badge} /> : null}
        <div className="absolute top-4 right-2 flex flex-col gap-1.5 translate-x-14 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 max-md:translate-x-0 max-md:opacity-100">
          <ActionBtn
            label={wished ? "Remove from wishlist" : "Add to wishlist"}
            onClick={() => {
              toggleWish(product._id);
              toast(wished ? "Removed from wishlist" : "Saved to wishlist");
            }}
          >
            <Heart
              className={cn("size-4", wished && "fill-primary text-primary")}
            />
          </ActionBtn>
          <ActionBtn label="Quick view" asLink slug={product.slug}>
            <Eye className="size-4" />
          </ActionBtn>
          <ActionBtn label="Compare" onClick={() => toast("Added to compare")}>
            <Repeat className="size-4" />
          </ActionBtn>
          <ActionBtn label="Add to bag" onClick={addToCart}>
            <ShoppingBag className="size-4" />
          </ActionBtn>
        </div>
      </div>
      <div className="flex flex-col gap-1 p-4 pt-3">
        <Link
          to="/shop"
          search={{ category: product.parentCategory }}
          className="text-xs font-medium uppercase tracking-wide hover:text-primary"
        >
          {product.category}
        </Link>
        <Link
          to={`/product/${product.slug}`}
          className="line-clamp-2 font-normal capitalize text-muted-foreground transition-colors hover:text-ink"
        >
          {product.title}
        </Link>
        <StarRating rating={product.rating} />
        <p className="mt-1 flex items-center gap-2 text-sm">
          <span className="font-semibold">{money(product.price)}</span>
          {product.compareAt ? (
            <del className="text-muted-foreground">
              {money(product.compareAt)}
            </del>
          ) : null}
        </p>
      </div>
    </article>
  );
}

function ActionBtn({
  children,
  label,
  onClick,
  asLink,
  slug,
}: {
  children: ReactNode;
  label: string;
  onClick?: () => void;
  asLink?: boolean;
  slug?: string;
}) {
  const className =
    "grid size-8 place-items-center rounded-sm border border-border/90 bg-background shadow-sm transition-colors hover:text-primary/90 hover:bg-muted";
  if (asLink && slug) {
    return (
      <Button
        variant={"ghost"}
        size={"icon"}
        type="button"
        aria-label={label}
        asChild
      >
        <Link to={`/product/${slug}`} aria-label={label} className={className}>
          {children}
        </Link>
      </Button>
    );
  }
  return (
    <Button
      variant={"ghost"}
      size={"icon"}
      type="button"
      aria-label={label}
      onClick={onClick}
      className={className}
    >
      {children}
    </Button>
  );
}

export function MinimalProduct({ product }: { product: Product }) {
  return (
    <article className="flex min-w-56 text-foreground flex-1 items-center gap-4 border-b border-border/80 py-4">
      <Link to={`/product/${product.slug}`} className="shrink-0">
        <img
          src={product.images[0]}
          alt={product.title}
          width={70}
          height={70}
          className="size-16 object-contain"
        />
      </Link>
      <div className="min-w-0">
        <Link
          to={`/product/${product.slug}`}
          className="line-clamp-2 text-sm font-medium capitalize hover:text-primary"
        >
          {product.title}
        </Link>
        <Link
          to="/shop"
          search={{ category: product.parentCategory }}
          className="mt-1 block text-xs capitalize text-muted-foreground hover:text-primary"
        >
          {product.category}
        </Link>
        <p className="mt-1.5 flex items-center gap-2 text-sm">
          <span className="font-semibold text-primary">
            {money(product.price)}
          </span>
          {product.compareAt ? (
            <del className="text-muted-foreground">{money(product.compareAt)}</del>
          ) : null}
        </p>
      </div>
    </article>
  );
}

export function AddToCartButton({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  const add = useCart((s) => s.add);
  const setCartOpen = useUi((s) => s.setCartOpen);
  return (
    <Button
      type="button"
      size={'lg'}
      onClick={() => {
        add(product, 1, {
          size: product.sizes?.[0],
          color: product.colors?.[0],
        });
        setCartOpen(true);
        toast.success("Added to bag");
      }}
      className={cn(
        "w-full py-3 text-sm font-bold uppercase tracking-wider",
        className,
      )}
    >
      Add to cart
    </Button>
  );
}

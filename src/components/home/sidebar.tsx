import { MinimalProduct } from "@/components/product/product-card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { productsIn, sidebarCategories } from "@/lib/cms/catalog";
import { Link } from "../layout/site-header";

export function ShopSidebar() {
  const bestsellers = productsIn("bestsellers");

  return (
    <aside className="hidden w-full shrink-0 lg:sticky lg:top-8 lg:block lg:w-1/4 lg:max-w-xs">
      <div className="overflow-hidden rounded-md border border-border/90 text-foreground">
        <h2 className="border-b border-line px-5 py-4 text-lg font-semibold">
          Category
        </h2>
        <Accordion type="single" defaultValue="clothes" className="w-full">
          {sidebarCategories.map((cat) => (
            <AccordionItem
              key={cat.title}
              value={cat.slug}
              className="border-b border-border last:border-b-0 [&_a]:no-underline!"
            >
              <AccordionTrigger className="px-5 py-3 text-sm font-medium hover:no-underline [&>svg]:size-4 [&>svg]:text-muted-foreground">
                <span className="flex items-center gap-3">
                  <img src={cat.icon} alt="" className="size-5 dark:invert" />
                  {cat.title}
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-3">
                <ul>
                  {cat.items.map((it) => (
                    <li key={it.name}>
                      <Link
                        to="/shop"
                        search={
                          it.href.includes("q=")
                            ? { q: it.href.split("q=")[1] }
                            : { category: cat.slug }
                        }
                        className="flex items-center justify-between pl-12 pr-4 py-1.5 text-sm capitalize text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <span>{it.name}</span>
                        <data
                          value={it.stock}
                          className="text-muted-foreground"
                        >
                          {it.stock}
                        </data>
                      </Link>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div className="mt-8">
        <h2 className="mb-2 text-lg font-semibold capitalize">Best Sellers</h2>
        <div>
          {bestsellers.map((p) => (
            <MinimalProduct key={p._id} product={p} />
          ))}
        </div>
      </div>
    </aside>
  );
}

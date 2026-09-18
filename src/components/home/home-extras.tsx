import { Headset, RotateCcw, Rocket, Ship, Ticket, HelpCircle } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { blogPosts, services, testimonial } from "@/lib/cms/catalog";

const serviceIcons: Record<string, ReactNode> = {
  boat: <Ship className="size-8" />,
  rocket: <Rocket className="size-8" />,
  headset: <Headset className="size-8" />,
  undo: <RotateCcw className="size-8" />,
  ticket: <Ticket className="size-8" />,
};

const fallbackIcon = <HelpCircle className="size-8" />;

export function TestimonialCtaServices() {
  return (
    <section className="container mx-auto px-4 mt-12 grid gap-6 lg:grid-cols-3 text-foreground">
      <div>
        <h2 className="mb-4 text-lg font-semibold capitalize">testimonial</h2>
        <div className="flex flex-col items-center rounded-md border border-border/90 px-6 py-10 text-center">
          <img
            src={testimonial.image}
            alt={testimonial.name}
            width={80}
            height={80}
            className="size-20 rounded-full object-cover"
          />
          <p className="mt-4 font-semibold">{testimonial.name}</p>
          <p className="text-xs text-muted-foreground">{testimonial.role}</p>
          <img src="/icons/quotes.svg" alt="" className="my-4 h-6 dark:invert" />
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">{testimonial.quote}</p>
        </div>
      </div>

      <Link
        href={{ pathname: "/shop", query: { badge: "sale" } }}
        className="relative group/link min-h-72 overflow-hidden rounded-md text-foreground"
      >
        <img
          src="/images/cta-banner.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover brightness-110 dark:brightness-40"
        />
        <div className="relative z-10 flex h-full flex-col items-center justify-center p-8 text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-primary">25% Discount</p>
          <h2 className="mt-2 text-2xl font-semibold uppercase">Summer collection</h2>
          <p className="mt-1 text-muted-foreground">Starting @ <span className="text-foreground">$10</span></p>
          <span className="mt-4 text-sm font-bold uppercase tracking-wider group-hover/link:text-primary transition-colors">Shop now</span>
        </div>
      </Link>

      <div>
        <h2 className="mb-4 text-lg font-semibold">Our Services</h2>
        <div className="rounded-md border border-line">
          {services.map((s) => (
            <Link
              key={`${s.icon}-${s.title}`}
              href="/about"
              className="flex items-center gap-4 border-b border-border/90 px-5 py-4 last:border-b-0 hover:text-primary"
            >
              <span className="text-primary">{serviceIcons[s.icon] ?? fallbackIcon}</span>
              <span>
                <span className="block text-sm font-medium">{s.title}</span>
                <span className="text-xs text-muted-foreground">{s.desc}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function BlogRow() {
  return (
    <section className="container mx-auto px-4 mt-12 mb-8">
      <h2 className="mb-5 text-lg font-semibold">Blog</h2>
      <div className="no-scrollbar flex gap-6 overflow-x-auto pb-3">
        {blogPosts.map((post) => (
          <article
            key={post._id}
            className="min-w-[16rem] flex-1 overflow-hidden rounded-md border border-border/90 bg-card"
          >
            <Link href={`/blog/${post.slug}`} className="block overflow-hidden">
              <img
                src={post.image}
                alt={post.title}
                loading="lazy"
                className="h-44 w-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </Link>
            <div className="p-5 text-foreground">
              <p className="text-xs font-medium uppercase text-primary">{post.category}</p>
              <Link
                href={`/blog/${post.slug}`}
                className="mt-2 block text-base font-medium text-foreground/80 leading-snug hover:text-primary dark:hover:text-foreground"
              >
                {post.title}
              </Link>
              <p className="mt-2 text-xs text-muted-foreground">
                By <cite className="not-italic">{post.author}</cite> / <time dateTime={post.date}>{post.dateLabel}</time>
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
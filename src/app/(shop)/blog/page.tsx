import { blogPosts } from "@/lib/cms/catalog";
import Image from "next/image";
import Link from "next/link";

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <p className="text-xs text-muted-foreground">
        <Link href="/" className="hover:text-primary">
          Home
        </Link>{" "}
        / Blog
      </p>
      <h1 className="mt-2 text-2xl font-semibold">From the journal</h1>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {blogPosts.map((post) => (
          <article
            key={post._id}
            className="overflow-hidden rounded-md border border-line"
          >
            <Link className="block aspect-square w-full relative" href={`/blog/${post.slug}`}>
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="w-full h-full object-cover"
              />
            </Link>
            <div className="p-5">
              <p className="text-xs font-medium uppercase text-primary">
                {post.category}
              </p>
              <Link
                href={`/blog/${post.slug}`}
                className="mt-2 block font-medium leading-snug hover:text-primary"
              >
                {post.title}
              </Link>
              <time dateTime={post.date} className="mt-2 text-xs text-muted-foreground/90">
                By {post.author} / {post.dateLabel}
              </time>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {post.excerpt}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

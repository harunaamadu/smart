import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { blogPosts } from "@/lib/cms/catalog";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return {};

  const description = post.excerpt ?? post.body[0];

  return {
    title: post.title,
    description,
    openGraph: {
      title: post.title,
      description,
      type: "article",
      publishedTime: post.date,
      images: post.image ? [{ url: post.image }] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) notFound();

  return (
    <article className="container mx-auto px-4 max-w-3xl py-8">
      <p className="text-tiny text-muted-foreground">
        <Link href="/" className="hover:text-primary">
          Home
        </Link>{" "}
        /{" "}
        <Link href="/blog" className="hover:text-primary">
          Blog
        </Link>
      </p>
      <p className="mt-6 text-tiny font-medium uppercase text-primary">{post.category}</p>
      <h1 className="mt-2 text-3xl font-semibold leading-tight">{post.title}</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        By {post.author} / <time dateTime={post.date}>{post.dateLabel}</time>
      </p>
      <img src={post.image} alt={post.title} className="mt-8 w-full rounded-md object-cover" />
      <div className="mt-8 space-y-4 text-base leading-relaxed text-foreground/80">
        {post.body.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
    </article>
  );
}
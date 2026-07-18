import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articles, getArticle } from "@/lib/data/articles";
import { ButtonLink } from "@/components/ui/button";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return { title: article.title, description: article.excerpt };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const related = articles.filter((a) => a.id !== article.id).slice(0, 3);

  return (
    <article className="pb-20">
      <header className="container-site max-w-4xl pt-12 text-center md:pt-20">
        <p className="eyebrow">{article.category}</p>
        <h1 className="font-display text-h1 mt-4 font-medium tracking-tight text-balance">
          {article.title}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted">
          {article.excerpt}
        </p>
        <p className="mt-6 text-xs uppercase tracking-[0.16em] text-faint">
          {article.author}, {article.authorRole} ·{" "}
          {new Date(article.date).toLocaleDateString("en", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}{" "}
          · {article.readMinutes} min read
        </p>
      </header>

      <div className="container-site mt-10">
        <div className="relative mx-auto aspect-[21/9] max-w-5xl overflow-hidden rounded-3xl">
          <Image
            src={article.cover}
            alt=""
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 1024px"
            className="object-cover"
          />
        </div>
      </div>

      <div className="container-site mt-12 max-w-2xl">
        {article.body.map((para, i) => (
          <p
            key={i}
            className={
              i === 0
                ? "text-lg leading-[1.85] text-ink first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-6xl first-letter:font-semibold first-letter:leading-[0.85] first-letter:text-brass"
                : "mt-7 text-[1.0625rem] leading-[1.85] text-ink-soft"
            }
          >
            {para}
          </p>
        ))}

        <div className="mt-12 rounded-2xl bg-ink p-8 text-paper">
          <p className="eyebrow">Continue the research</p>
          <p className="font-display mt-2 text-2xl font-medium">
            Get the full quarterly report for this market.
          </p>
          <ButtonLink href="/reports" variant="inverted" className="mt-5">
            Download market reports
          </ButtonLink>
        </div>
      </div>

      <div className="container-site mt-20">
        <h2 className="font-display text-h3 font-medium">Related reading</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {related.map((ar) => (
            <Link
              key={ar.id}
              href={`/journal/${ar.slug}`}
              className="card-hover group block overflow-hidden rounded-2xl border border-line bg-raised shadow-card"
            >
              <div className="img-zoom relative aspect-[16/10]">
                <Image
                  src={ar.cover}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="p-5">
                <p className="eyebrow">{ar.category}</p>
                <h3 className="font-display mt-2 text-lg font-semibold leading-snug">
                  {ar.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
}

import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getJournalBySlug, getJournalArticles } from '@/lib/journal-db';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';

export async function generateStaticParams() {
  const articles = await getJournalArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getJournalBySlug(slug);
  if (!article) return { title: 'Article Not Found | Anatolia' };
  return {
    title: `${article.title} | Anatolia Journal`,
    description: article.excerpt,
  };
}

export default async function JournalDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getJournalBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <article className="min-h-screen bg-[#0a0a0c] text-stone-100 font-sans py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Back Link */}
        <Link
          href="/journal"
          className="inline-flex items-center text-xs text-[#c5a880] hover:text-white transition-colors"
        >
          <ArrowLeft size={14} className="mr-1.5" /> Back to Journal & News
        </Link>

        {/* Header Title & Date */}
        <div className="space-y-4 border-b border-stone-800 pb-8">
          <div className="flex items-center space-x-3">
            <span className="px-3 py-1 bg-[#c5a880]/15 border border-[#c5a880]/40 text-[#c5a880] rounded text-xs uppercase tracking-wider font-mono">
              {article.category}
            </span>
            <div className="flex items-center space-x-1.5 text-xs text-stone-500 font-mono">
              <Calendar size={13} />
              <span>Published {article.published_date}</span>
            </div>
          </div>

          <h1 className="font-serif-luxury text-3xl sm:text-5xl text-white font-light leading-tight">
            {article.title}
          </h1>

          <p className="text-stone-300 text-sm sm:text-base font-light leading-relaxed tracking-wide">
            {article.excerpt}
          </p>
        </div>

        {/* Cover Image */}
        {article.cover_image && (
          <div className="w-full h-80 sm:h-96 rounded-lg overflow-hidden border border-stone-800">
            <img
              src={article.cover_image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Body Content */}
        <div className="prose prose-invert max-w-none text-stone-300 font-light text-sm sm:text-base leading-relaxed space-y-6 pt-4">
          {article.content.split('\n\n').map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>
      </div>
    </article>
  );
}

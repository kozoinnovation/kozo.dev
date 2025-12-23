import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

export default async function Home() {
  const posts = await getAllPosts();
  const recentPosts = posts.slice(0, 3);

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      {/* Hero */}
      <section className="mb-16">
        <h1 className="text-4xl font-bold mb-2">Hiroki</h1>
        <p className="text-xl text-muted mb-4">SaaS Developer</p>
        <p className="text-lg text-muted">
          Building embeddable micro-SaaS
        </p>
      </section>

      {/* Project */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6">Project</h2>
        <Link
          href="/projects"
          className="block p-6 border border-border rounded-xl hover:border-muted transition-colors"
        >
          <h3 className="text-xl font-medium mb-2">ZeroBook</h3>
          <p className="text-muted">予約システムSaaS - Web / iOS / Android</p>
        </Link>
      </section>

      {/* Latest Posts */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Latest Posts</h2>
          <Link href="/blog" className="text-sm text-accent hover:underline">
            View all →
          </Link>
        </div>
        {recentPosts.length > 0 ? (
          <ul className="space-y-4">
            {recentPosts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="flex items-center justify-between py-2 group"
                >
                  <span className="group-hover:text-accent transition-colors">
                    {post.title}
                  </span>
                  <span className="text-sm text-muted">
                    {post.date}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">まだ記事がありません。</p>
        )}
      </section>
    </div>
  );
}

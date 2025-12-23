import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

export default async function BlogPage() {
    const posts = await getAllPosts();

    // カテゴリ別にグループ化
    const categories = ['技術記事', '設計思想', '日記・作業ログ', 'その他'];
    const postsByCategory = categories.reduce((acc, category) => {
        acc[category] = posts.filter(post => post.category === category);
        return acc;
    }, {} as Record<string, typeof posts>);

    return (
        <div className="max-w-3xl mx-auto px-6 py-16">
            <h1 className="text-3xl font-bold mb-8">Blog</h1>

            {posts.length === 0 ? (
                <p className="text-muted">
                    まだ記事がありません。<br />
                    <code className="text-sm bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">content/blog/</code> に <code className="text-sm bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">.mdx</code> ファイルを追加してください。
                </p>
            ) : (
                <div className="space-y-12">
                    {categories.map((category) => {
                        const categoryPosts = postsByCategory[category];
                        if (categoryPosts.length === 0) return null;

                        return (
                            <section key={category}>
                                <h2 className="text-xl font-semibold mb-4 text-muted">{category}</h2>
                                <ul className="space-y-3">
                                    {categoryPosts.map((post) => (
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
                            </section>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

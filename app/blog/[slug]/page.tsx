import { notFound } from "next/navigation";
import { getPostBySlug, getAllPosts } from "@/lib/blog";
import { MDXRemote } from "next-mdx-remote/rsc";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const posts = await getAllPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({ params }: Props) {
    const { slug } = await params;
    const post = await getPostBySlug(slug);
    if (!post) return {};

    return {
        title: post.title,
        description: post.description,
    };
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    return (
        <div className="max-w-3xl mx-auto px-6 py-16">
            <article>
                {/* Header */}
                <header className="mb-12">
                    <p className="text-sm text-muted mb-2">{post.category}</p>
                    <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
                    <p className="text-muted">{post.date}</p>
                </header>

                {/* Content */}
                <div className="prose prose-zinc dark:prose-invert max-w-none">
                    <MDXRemote source={post.content} />
                </div>
            </article>
        </div>
    );
}

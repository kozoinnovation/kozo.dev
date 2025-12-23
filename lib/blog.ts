import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'content/blog')

export interface Post {
    slug: string
    title: string
    date: string
    category: string
    description: string
    content: string
}

export async function getAllPosts(): Promise<Post[]> {
    // content/blogディレクトリが存在しない場合は空配列を返す
    if (!fs.existsSync(postsDirectory)) {
        return []
    }

    const fileNames = fs.readdirSync(postsDirectory)
    const posts = fileNames
        .filter((fileName) => fileName.endsWith('.mdx'))
        .map((fileName) => {
            const slug = fileName.replace(/\.mdx$/, '')
            const fullPath = path.join(postsDirectory, fileName)
            const fileContents = fs.readFileSync(fullPath, 'utf8')
            const { data, content } = matter(fileContents)

            return {
                slug,
                title: data.title || 'Untitled',
                date: data.date || '',
                category: data.category || 'その他',
                description: data.description || '',
                content,
            }
        })
        .sort((a, b) => (a.date > b.date ? -1 : 1))

    return posts
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
    const fullPath = path.join(postsDirectory, `${slug}.mdx`)

    if (!fs.existsSync(fullPath)) {
        return null
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
        slug,
        title: data.title || 'Untitled',
        date: data.date || '',
        category: data.category || 'その他',
        description: data.description || '',
        content,
    }
}

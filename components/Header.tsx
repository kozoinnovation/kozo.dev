import Link from 'next/link'
import { ThemeToggle } from './ThemeToggle'

export function Header() {
    return (
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
            <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link href="/" className="text-lg font-semibold">
                    kozo.dev
                </Link>
                <nav className="flex items-center gap-6">
                    <Link href="/projects" className="text-sm text-muted hover:text-foreground transition-colors">
                        Projects
                    </Link>
                    <Link href="/blog" className="text-sm text-muted hover:text-foreground transition-colors">
                        Blog
                    </Link>
                    <Link href="/about" className="text-sm text-muted hover:text-foreground transition-colors">
                        About
                    </Link>
                    <ThemeToggle />
                </nav>
            </div>
        </header>
    )
}

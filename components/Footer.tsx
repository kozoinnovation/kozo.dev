import Link from 'next/link'

export function Footer() {
    return (
        <footer className="border-t border-border py-8 mt-16">
            <div className="max-w-3xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted">
                <p>© 2025 Hiroki</p>
                <div className="flex items-center gap-6">
                    <a
                        href="https://x.com/kozo_innov"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-foreground transition-colors"
                    >
                        X (@kozo_innov)
                    </a>
                    <Link
                        href="/contact"
                        className="hover:text-foreground transition-colors"
                    >
                        Contact
                    </Link>
                </div>
            </div>
        </footer>
    )
}

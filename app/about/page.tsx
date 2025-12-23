export default function AboutPage() {
    return (
        <div className="max-w-3xl mx-auto px-6 py-16">
            <h1 className="text-3xl font-bold mb-8">About</h1>

            <div className="space-y-8">
                <section>
                    <h2 className="text-xl font-semibold mb-4">Hiroki</h2>
                    <p className="text-muted leading-7">
                        SaaS Developer。「本質で勝負する」をモットーに、埋め込み型マイクロSaaSを開発しています。
                        KozoFrameworkを活用し、再利用率80%超のコードベースでプロダクトを量産する「SaaS帝国」構想を実践中。
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-4">開発スタイル</h2>
                    <ul className="list-disc ml-6 text-muted space-y-2">
                        <li>AI駆動開発（Cursor + Claude/GPT）</li>
                        <li>仕組み化・再利用・テンプレート化を重視</li>
                        <li>「やらないこと」の設計で複雑性を排除</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-4">技術スタック</h2>
                    <div className="grid grid-cols-2 gap-4 text-muted">
                        <div>
                            <h3 className="font-medium text-foreground mb-2">Web</h3>
                            <ul className="space-y-1 text-sm">
                                <li>Next.js</li>
                                <li>Supabase</li>
                                <li>Vercel</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-medium text-foreground mb-2">Mobile</h3>
                            <ul className="space-y-1 text-sm">
                                <li>SwiftUI (iOS)</li>
                                <li>Jetpack Compose (Android)</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-4">Contact</h2>
                    <div className="flex gap-6 text-muted">
                        <a
                            href="https://x.com/kozo_innov"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-foreground transition-colors"
                        >
                            X (@kozo_innov)
                        </a>
                        <a
                            href="mailto:hello@kozo.dev"
                            className="hover:text-foreground transition-colors"
                        >
                            hello@kozo.dev
                        </a>
                    </div>
                </section>
            </div>
        </div>
    );
}

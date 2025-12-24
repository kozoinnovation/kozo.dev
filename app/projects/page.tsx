export default function ProjectsPage() {
    return (
        <div className="max-w-3xl mx-auto px-6 py-16">
            <h1 className="text-3xl font-bold mb-12">Projects</h1>

            {/* Products Section */}
            <section className="mb-16">
                <h2 className="text-xl font-semibold text-muted mb-6 flex items-center gap-2">
                    <span>🚀</span> Products
                </h2>
                <div className="space-y-6">
                    {/* ZeroBook */}
                    <article className="border border-border rounded-xl p-8">
                        <div className="flex items-start justify-between mb-4">
                            <h3 className="text-2xl font-semibold">ZeroBook</h3>
                            <a
                                href="https://zerobook.app"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-muted hover:text-foreground transition-colors"
                            >
                                zerobook.app ↗
                            </a>
                        </div>
                        <p className="text-muted mb-6">
                            予約システムSaaS。Webサイトに1行のコードを埋め込むだけで、予約フォームを設置できます。
                        </p>

                        <div className="space-y-4">
                            <div>
                                <h4 className="font-medium mb-2">対応プラットフォーム</h4>
                                <div className="flex gap-2">
                                    <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-full text-sm">Web</span>
                                    <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-full text-sm">iOS</span>
                                    <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-full text-sm">Android</span>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-medium mb-2">技術スタック</h4>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-full text-sm">Next.js</span>
                                    <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-full text-sm">Supabase</span>
                                    <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-full text-sm">SwiftUI</span>
                                    <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-full text-sm">Jetpack Compose</span>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-medium mb-2">特徴</h4>
                                <ul className="list-disc ml-6 text-muted space-y-1">
                                    <li>1行埋め込み（Shadow DOM）</li>
                                    <li>ダブルブッキング完全防止</li>
                                    <li>リアルタイム同期</li>
                                    <li>AIメニュー取り込み</li>
                                </ul>
                            </div>
                        </div>
                    </article>

                    {/* ZeroContact */}
                    <article className="border border-border rounded-xl p-8">
                        <div className="flex items-start justify-between mb-4">
                            <h3 className="text-2xl font-semibold">ZeroContact</h3>
                            <a
                                href="https://zerocontact.app"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-muted hover:text-foreground transition-colors"
                            >
                                zerocontact.app ↗
                            </a>
                        </div>
                        <p className="text-muted mb-6">
                            「メールを待つ時代」を終わらせる、爆速Push通知特化型の埋め込みフォームSaaS。
                            1分の設定でサイトに「スマホ直結の窓口」を開設できます。
                        </p>

                        <div className="space-y-4">
                            <div>
                                <h4 className="font-medium mb-2">対応プラットフォーム</h4>
                                <div className="flex gap-2">
                                    <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-full text-sm">Web</span>
                                    <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-full text-sm">iOS</span>
                                    <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-full text-sm">Android</span>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-medium mb-2">技術スタック</h4>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-full text-sm">Next.js</span>
                                    <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-full text-sm">Supabase</span>
                                    <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-full text-sm">SwiftUI</span>
                                    <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-full text-sm">Jetpack Compose</span>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-medium mb-2">特徴</h4>
                                <ul className="list-disc ml-6 text-muted space-y-1">
                                    <li>0秒Push通知（問い合わせ即スマホ通知）</li>
                                    <li>1行埋め込み（Shadow DOM）</li>
                                    <li>Row Level Securityによるテナント隔離</li>
                                    <li>自動返信メール</li>
                                </ul>
                            </div>
                        </div>
                    </article>
                </div>
            </section>

            {/* Side Projects Section */}
            <section>
                <h2 className="text-xl font-semibold text-muted mb-6 flex items-center gap-2">
                    <span>🧪</span> Side Projects
                </h2>
                <div className="space-y-6">
                    {/* SaaS収益計算機 */}
                    <article className="border border-border rounded-xl p-8">
                        <div className="flex items-start justify-between mb-4">
                            <h3 className="text-2xl font-semibold">SaaS収益計算機</h3>
                            <a
                                href="/tools/saas-calculator"
                                className="text-sm text-muted hover:text-foreground transition-colors"
                            >
                                使ってみる →
                            </a>
                        </div>
                        <p className="text-muted mb-6">
                            SaaSビジネスのMRR/ARR/ARPUをリアルタイム計算。
                            ユーザー数とプラン配分から12ヶ月成長シミュレーションを可視化。
                        </p>

                        <div className="space-y-4">
                            <div>
                                <h4 className="font-medium mb-2">技術スタック</h4>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-full text-sm">Next.js</span>
                                    <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-full text-sm">Recharts</span>
                                    <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-full text-sm">Tailwind CSS</span>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-medium mb-2">特徴</h4>
                                <ul className="list-disc ml-6 text-muted space-y-1">
                                    <li>MRR/ARR/ARPU リアルタイム計算</li>
                                    <li>12ヶ月成長シミュレーション</li>
                                    <li>CSV/Markdown/YAML出力</li>
                                    <li>日英対応</li>
                                </ul>
                            </div>
                        </div>
                    </article>
                </div>
            </section>
        </div>
    )
}

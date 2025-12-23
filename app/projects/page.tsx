export default function ProjectsPage() {
    return (
        <div className="max-w-3xl mx-auto px-6 py-16">
            <h1 className="text-3xl font-bold mb-8">Projects</h1>

            {/* ZeroBook */}
            <article className="border border-border rounded-xl p-8">
                <h2 className="text-2xl font-semibold mb-4">ZeroBook</h2>
                <p className="text-muted mb-6">
                    予約システムSaaS。Webサイトに1行のコードを埋め込むだけで、予約フォームを設置できます。
                </p>

                <div className="space-y-4">
                    <div>
                        <h3 className="font-medium mb-2">対応プラットフォーム</h3>
                        <div className="flex gap-2">
                            <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-full text-sm">Web</span>
                            <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-full text-sm">iOS</span>
                            <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-full text-sm">Android</span>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-medium mb-2">技術スタック</h3>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-full text-sm">Next.js</span>
                            <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-full text-sm">Supabase</span>
                            <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-full text-sm">SwiftUI</span>
                            <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-full text-sm">Jetpack Compose</span>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-medium mb-2">特徴</h3>
                        <ul className="list-disc ml-6 text-muted space-y-1">
                            <li>1行埋め込み（Shadow DOM）</li>
                            <li>ダブルブッキング完全防止</li>
                            <li>リアルタイム同期</li>
                            <li>AIメニュー取り込み</li>
                        </ul>
                    </div>
                </div>
            </article>
        </div>
    )
}

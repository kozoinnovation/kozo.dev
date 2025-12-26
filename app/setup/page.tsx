export default function SetupPage() {
    return (
        <div className="max-w-3xl mx-auto px-6 py-16">
            <h1 className="text-3xl font-bold mb-4">Setup</h1>
            <p className="text-muted mb-12">
                開発に使用しているハードウェア・ソフトウェア環境です。
            </p>

            {/* Desktop PC */}
            <section className="mb-12">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <span>🖥️</span> Desktop PC
                </h2>
                <article className="border border-border rounded-xl p-8">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="px-2 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded text-xs font-medium">
                            Windows 11
                        </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div>
                            <h4 className="text-sm text-muted mb-1">GPU</h4>
                            <p className="font-medium">RTX 3070</p>
                        </div>
                        <div>
                            <h4 className="text-sm text-muted mb-1">CPU</h4>
                            <p className="font-medium">Ryzen 5800X3D</p>
                        </div>
                        <div>
                            <h4 className="text-sm text-muted mb-1">RAM</h4>
                            <p className="font-medium">64GB</p>
                        </div>
                    </div>
                    <p className="text-sm text-muted mt-4">
                        ローカルでのAIモデル実行、Android開発、重いビルドタスクに使用。
                    </p>
                </article>
            </section>

            {/* MacBook */}
            <section className="mb-12">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <span>💻</span> Laptop
                </h2>
                <article className="border border-border rounded-xl p-8">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="px-2 py-1 bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 rounded text-xs font-medium">
                            macOS
                        </span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">MacBook Air 13&quot;</h3>
                    <p className="text-muted mb-4">Apple M4チップ搭載</p>
                    <p className="text-sm text-muted">
                        メイン開発機。iOS/SwiftUI開発、Web開発、外出先での作業に使用。
                    </p>
                </article>
            </section>

            {/* Mobile Devices */}
            <section className="mb-12">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <span>📱</span> Mobile Devices
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <article className="border border-border rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="px-2 py-1 bg-green-500/10 text-green-600 dark:text-green-400 rounded text-xs font-medium">
                                Android
                            </span>
                        </div>
                        <h3 className="font-semibold mb-1">Galaxy S25 Ultra</h3>
                        <p className="text-sm text-muted">
                            Android実機テスト、日常使い
                        </p>
                    </article>
                    <article className="border border-border rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="px-2 py-1 bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 rounded text-xs font-medium">
                                iOS
                            </span>
                        </div>
                        <h3 className="font-semibold mb-1">iPhone 17</h3>
                        <p className="text-sm text-muted">
                            iOS実機テスト
                        </p>
                    </article>
                </div>
            </section>

            {/* Cursor - Main Editor */}
            <section className="mb-12">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <span>✨</span> Editor
                </h2>
                <article className="border-2 border-accent/50 bg-accent/5 rounded-xl p-8">
                    <div className="flex items-center gap-3 mb-4">
                        <h3 className="text-2xl font-bold">Cursor</h3>
                        <span className="px-2 py-1 bg-accent/20 text-accent rounded text-xs font-medium">
                            メインエディタ
                        </span>
                    </div>
                    <p className="text-muted mb-6">
                        AI駆動開発の中心。このページもCursorで作成しています。
                    </p>
                    <div>
                        <h4 className="font-medium mb-3">使用モデル</h4>
                        <div className="flex flex-wrap gap-3">
                            <div className="px-4 py-3 bg-background border border-border rounded-lg">
                                <p className="font-medium text-sm">Claude Opus 4.5</p>
                                <p className="text-xs text-muted">Anthropic</p>
                            </div>
                            <div className="px-4 py-3 bg-background border border-border rounded-lg">
                                <p className="font-medium text-sm">Claude Sonnet 4.5</p>
                                <p className="text-xs text-muted">Anthropic</p>
                            </div>
                            <div className="px-4 py-3 bg-background border border-border rounded-lg">
                                <p className="font-medium text-sm">composer-1</p>
                                <p className="text-xs text-muted">Cursor</p>
                            </div>
                        </div>
                    </div>
                </article>
            </section>

            {/* AI for Research & Planning */}
            <section className="mb-12">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <span>🤖</span> Research & Planning
                </h2>
                <div className="space-y-4">
                    {/* Antigravity */}
                    <article className="border border-border rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold">Antigravity</h3>
                            <span className="px-2 py-0.5 bg-pink-500/10 text-pink-600 dark:text-pink-400 rounded text-xs">
                                Google AI Pro
                            </span>
                        </div>
                        <p className="text-sm text-muted mb-3">
                            設計相談、マークダウン作成に使用。月額¥3,000でOpus 4.5が使えるのでコスパ◎
                        </p>
                        <div className="flex gap-2">
                            <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-full text-xs">
                                Claude Opus 4.5
                            </span>
                        </div>
                    </article>

                    {/* Other AI */}
                    <div className="border border-border rounded-xl p-6">
                        <p className="text-sm text-muted mb-4">
                            リサーチ、設計、相談に使用
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <div className="px-4 py-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                                <p className="font-medium text-sm">GPT</p>
                                <p className="text-xs text-muted">OpenAI</p>
                            </div>
                            <div className="px-4 py-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                                <p className="font-medium text-sm">Gemini</p>
                                <p className="text-xs text-muted">Google</p>
                            </div>
                            <div className="px-4 py-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                                <p className="font-medium text-sm">Grok</p>
                                <p className="text-xs text-muted">xAI</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Other Development Tools */}
            <section className="mb-12">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <span>⚙️</span> Other Tools
                </h2>
                <div className="border border-border rounded-xl p-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-medium mb-3">Mobile IDE</h4>
                            <ul className="space-y-2">
                                <li className="flex items-center gap-2 text-muted">
                                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                                    Android Studio
                                </li>
                                <li className="flex items-center gap-2 text-muted">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                    Xcode
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-medium mb-3">Design</h4>
                            <ul className="space-y-2">
                                <li className="flex items-center gap-2 text-muted">
                                    <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                                    Canva
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}


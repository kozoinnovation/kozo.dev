import type { Metadata } from 'next'
import Link from 'next/link'
import { Calculator } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Tools',
    description: '無料で使えるSaaS開発者向けツール集',
}

const tools = [
    {
        slug: 'saas-calculator',
        title: 'SaaS収益計算機',
        description: 'MRR/ARR/ARPUをリアルタイム計算。12ヶ月成長シミュレーション付き。',
        icon: Calculator,
    },
]

export default function ToolsPage() {
    return (
        <div className="max-w-3xl mx-auto px-6 py-16">
            <h1 className="text-2xl font-semibold mb-2">Tools</h1>
            <p className="text-muted mb-12">
                登録不要・完全無料のツール集。すべてブラウザ上で動作します。
            </p>

            <div className="grid gap-4">
                {tools.map((tool) => {
                    const Icon = tool.icon
                    return (
                        <Link
                            key={tool.slug}
                            href={`/tools/${tool.slug}`}
                            className="group block p-6 border border-border rounded-lg hover:border-accent transition-colors"
                        >
                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-accent/10 rounded-lg text-accent">
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="font-medium group-hover:text-accent transition-colors">
                                        {tool.title}
                                    </h2>
                                    <p className="text-sm text-muted mt-1">
                                        {tool.description}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}


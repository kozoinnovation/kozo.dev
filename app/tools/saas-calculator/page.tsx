import type { Metadata } from 'next'
import { SaaSCalculator } from './SaaSCalculator'

export const metadata: Metadata = {
    title: 'SaaS収益計算機',
    description: 'SaaSビジネスのMRR/ARR/ARPUをリアルタイム計算。12ヶ月成長シミュレーション付き。',
    openGraph: {
        title: 'SaaS収益計算機 | kozo.dev',
        description: 'SaaSビジネスのMRR/ARR/ARPUをリアルタイム計算。ユーザー数とプラン配分から12ヶ月成長シミュレーション。',
        url: 'https://kozo.dev/tools/saas-calculator',
        siteName: 'kozo.dev',
        locale: 'ja_JP',
        type: 'website',
        images: [
            {
                url: '/og/saas-calculator.png',
                width: 1200,
                height: 630,
                alt: 'SaaS収益計算機 - MRR/ARR計算ツール',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'SaaS収益計算機 | kozo.dev',
        description: 'SaaSビジネスのMRR/ARR/ARPUをリアルタイム計算。12ヶ月成長シミュレーション付き。',
        images: ['/og/saas-calculator.png'],
        creator: '@kozo_innov',
    },
}

export default function SaaSCalculatorPage() {
    return (
        <div className="max-w-5xl mx-auto px-6 py-16">
            <div className="mb-12">
                <h1 className="text-2xl font-semibold mb-2">SaaS収益計算機</h1>
                <p className="text-muted">
                    ユーザー数とプラン配分からMRR/ARR/ARPUを即座に計算。成長率と解約率を考慮した12ヶ月シミュレーション付き。
                </p>
            </div>
            <SaaSCalculator />
        </div>
    )
}


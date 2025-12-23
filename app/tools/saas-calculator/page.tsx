import type { Metadata } from 'next'
import { SaaSCalculator } from './SaaSCalculator'

export const metadata: Metadata = {
    title: 'SaaS収益計算機',
    description: 'SaaSビジネスのMRR/ARR/ARPUをリアルタイム計算。12ヶ月成長シミュレーション付き。',
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


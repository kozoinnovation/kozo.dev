'use client'

import { useState, useMemo } from 'react'
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts'
import { Download, ChevronDown, ChevronUp, TrendingUp, TrendingDown, Users } from 'lucide-react'

const STRIPE_FEE_RATE = 0.036

// 通貨フォーマット
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
        style: 'currency',
        currency: 'JPY',
        minimumFractionDigits: 0,
    }).format(amount)
}

const formatCompactCurrency = (amount: number) => {
    if (amount >= 100000000) {
        return `¥${(amount / 100000000).toFixed(1)}億`
    }
    if (amount >= 10000) {
        return `¥${(amount / 10000).toFixed(1)}万`
    }
    return formatCurrency(amount)
}

export function SaaSCalculator() {
    // 基本設定
    const [totalUsers, setTotalUsers] = useState(1000)
    const [stripeFeeEnabled, setStripeFeeEnabled] = useState(true)

    // プラン料金
    const [freePlanPrice, setFreePlanPrice] = useState(0)
    const [starterPlanPrice, setStarterPlanPrice] = useState(980)
    const [proPlanPrice, setProPlanPrice] = useState(6980)

    // ユーザー配分
    const [freePercent, setFreePercent] = useState(60)
    const [starterPercent, setStarterPercent] = useState(30)
    const [proPercent, setProPercent] = useState(10)

    // 成長・解約率
    const [monthlyGrowthRate, setMonthlyGrowthRate] = useState(10)
    const [churnRate, setChurnRate] = useState(5)

    // UI制御
    const [showAdvanced, setShowAdvanced] = useState(false)

    // 計算値
    const freeUsers = Math.round((totalUsers * freePercent) / 100)
    const starterUsers = Math.round((totalUsers * starterPercent) / 100)
    const proUsers = Math.round((totalUsers * proPercent) / 100)

    const freeMRR = freeUsers * freePlanPrice
    const starterMRR = starterUsers * starterPlanPrice
    const proMRR = proUsers * proPlanPrice
    const totalMRR = freeMRR + starterMRR + proMRR

    const stripeFee = stripeFeeEnabled ? totalMRR * STRIPE_FEE_RATE : 0
    const netMRR = totalMRR - stripeFee
    const totalARR = totalMRR * 12
    const netARR = netMRR * 12

    const arpu = totalUsers > 0 ? totalMRR / totalUsers : 0
    const paidUsers = starterUsers + proUsers
    const arppu = paidUsers > 0 ? (starterMRR + proMRR) / paidUsers : 0

    // 12ヶ月シミュレーション
    const growthData = useMemo(() => {
        const data = []
        let currentUsers = totalUsers
        let cumulativeNetRevenue = 0

        for (let month = 1; month <= 12; month++) {
            const monthStartUsers = month === 1 ? totalUsers : currentUsers
            const newUsers = Math.round(monthStartUsers * (monthlyGrowthRate / 100))
            const churnedUsers = Math.round(monthStartUsers * (churnRate / 100))
            currentUsers = Math.max(0, monthStartUsers + newUsers - churnedUsers)

            const monthlyFreeUsers = Math.round((currentUsers * freePercent) / 100)
            const monthlyStarterUsers = Math.round((currentUsers * starterPercent) / 100)
            const monthlyProUsers = Math.round((currentUsers * proPercent) / 100)

            const monthlyFreeMRR = monthlyFreeUsers * freePlanPrice
            const monthlyStarterMRR = monthlyStarterUsers * starterPlanPrice
            const monthlyProMRR = monthlyProUsers * proPlanPrice
            const monthlyTotalMRR = monthlyFreeMRR + monthlyStarterMRR + monthlyProMRR

            const monthlyStripeFee = stripeFeeEnabled ? monthlyTotalMRR * STRIPE_FEE_RATE : 0
            const monthlyNetMRR = monthlyTotalMRR - monthlyStripeFee
            cumulativeNetRevenue += monthlyNetMRR

            data.push({
                month: `${month}月`,
                ユーザー数: currentUsers,
                新規獲得: newUsers,
                解約: churnedUsers,
                純増: newUsers - churnedUsers,
                総MRR: Math.round(monthlyTotalMRR),
                純MRR: Math.round(monthlyNetMRR),
                累積純売上: Math.round(cumulativeNetRevenue),
                Free: monthlyFreeUsers,
                Starter: monthlyStarterUsers,
                Pro: monthlyProUsers,
            })
        }
        return data
    }, [
        totalUsers,
        monthlyGrowthRate,
        churnRate,
        freePercent,
        starterPercent,
        proPercent,
        freePlanPrice,
        starterPlanPrice,
        proPlanPrice,
        stripeFeeEnabled,
    ])

    // パーセンテージ変更ハンドラ
    const handlePercentChange = (plan: 'free' | 'starter' | 'pro', value: number) => {
        const clampedValue = Math.max(0, Math.min(100, value))
        const remaining = 100 - clampedValue

        if (plan === 'free') {
            setFreePercent(clampedValue)
            const starterRatio = starterPercent / (starterPercent + proPercent) || 0.5
            setStarterPercent(Math.round(remaining * starterRatio))
            setProPercent(Math.round(remaining * (1 - starterRatio)))
        } else if (plan === 'starter') {
            setStarterPercent(clampedValue)
            const freeRatio = freePercent / (freePercent + proPercent) || 0.5
            setFreePercent(Math.round(remaining * freeRatio))
            setProPercent(Math.round(remaining * (1 - freeRatio)))
        } else {
            setProPercent(clampedValue)
            const freeRatio = freePercent / (freePercent + starterPercent) || 0.5
            setFreePercent(Math.round(remaining * freeRatio))
            setStarterPercent(Math.round(remaining * (1 - freeRatio)))
        }
    }

    // CSVエクスポート
    const exportCSV = () => {
        const now = new Date()
        const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, 19)

        let csv = '\uFEFF' // UTF-8 BOM
        csv += 'SaaS収益シミュレーション\n'
        csv += `エクスポート日時,${now.toLocaleString('ja-JP')}\n\n`

        csv += '【基本設定】\n'
        csv += '項目,値\n'
        csv += `総ユーザー数,${totalUsers}\n`
        csv += `月次成長率,${monthlyGrowthRate}%\n`
        csv += `月次解約率,${churnRate}%\n`
        csv += `純成長率,${monthlyGrowthRate - churnRate}%\n`
        csv += `Stripe手数料,${stripeFeeEnabled ? '有効' : '無効'}\n\n`

        csv += '【プラン配分】\n'
        csv += 'プラン名,配分率,ユーザー数,月額料金,月次収益(MRR)\n'
        csv += `Free,${freePercent}%,${freeUsers},${formatCurrency(freePlanPrice)},${formatCurrency(freeMRR)}\n`
        csv += `Starter,${starterPercent}%,${starterUsers},${formatCurrency(starterPlanPrice)},${formatCurrency(starterMRR)}\n`
        csv += `Pro,${proPercent}%,${proUsers},${formatCurrency(proPlanPrice)},${formatCurrency(proMRR)}\n`
        csv += `合計,100%,${totalUsers},-,${formatCurrency(totalMRR)}\n\n`

        csv += '【現在の収益指標】\n'
        csv += '指標,金額\n'
        csv += `総MRR,${formatCurrency(totalMRR)}\n`
        csv += `Stripe手数料,${formatCurrency(stripeFee)}\n`
        csv += `純MRR,${formatCurrency(netMRR)}\n`
        csv += `総ARR,${formatCurrency(totalARR)}\n`
        csv += `年間手数料,${formatCurrency(stripeFee * 12)}\n`
        csv += `純ARR,${formatCurrency(netARR)}\n`
        csv += `ARPU,${formatCurrency(arpu)}\n`
        csv += `ARPPU,${formatCurrency(arppu)}\n\n`

        csv += '【12ヶ月間の推移データ】\n'
        csv += '月,総ユーザー数,新規獲得,解約数,純増,Freeユーザー,Starterユーザー,Proユーザー,総MRR,純MRR,累積純売上\n'
        growthData.forEach((d) => {
            csv += `${d.month},${d.ユーザー数},${d.新規獲得},${d.解約},${d.純増},${d.Free},${d.Starter},${d.Pro},${formatCurrency(d.総MRR)},${formatCurrency(d.純MRR)},${formatCurrency(d.累積純売上)}\n`
        })

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = `SaaS収益シミュレーション_${timestamp}.csv`
        link.click()
    }

    const lastMonth = growthData[growthData.length - 1]
    const firstMonth = growthData[0]
    const userGrowthRate = firstMonth ? ((lastMonth.ユーザー数 - firstMonth.ユーザー数) / firstMonth.ユーザー数) * 100 : 0

    return (
        <div className="space-y-8">
            {/* 設定エリア */}
            <div className="grid md:grid-cols-2 gap-8">
                {/* 左カラム: 入力 */}
                <div className="space-y-6">
                    {/* 総ユーザー数 */}
                    <div className="p-4 border border-border rounded-lg">
                        <label className="block text-sm font-medium mb-3">
                            <Users className="inline w-4 h-4 mr-1" />
                            総ユーザー数
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                value={totalUsers}
                                onChange={(e) => setTotalUsers(Math.max(0, parseInt(e.target.value) || 0))}
                                className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                                inputMode="numeric"
                            />
                            <span className="text-muted text-sm">人</span>
                        </div>
                        <div className="flex gap-1 mt-2 flex-wrap">
                            {[100, 500, 1000, 5000, 10000].map((n) => (
                                <button
                                    key={n}
                                    onClick={() => setTotalUsers(n)}
                                    className="px-2 py-1 text-xs border border-border rounded hover:bg-accent/10 transition-colors"
                                >
                                    {n.toLocaleString()}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* プラン料金設定 */}
                    <div className="p-4 border border-border rounded-lg">
                        <label className="block text-sm font-medium mb-3">プラン料金（月額）</label>
                        <div className="space-y-3">
                            {[
                                { label: 'Free', value: freePlanPrice, setter: setFreePlanPrice, color: 'text-muted' },
                                { label: 'Starter', value: starterPlanPrice, setter: setStarterPlanPrice, color: 'text-accent' },
                                { label: 'Pro', value: proPlanPrice, setter: setProPlanPrice, color: 'text-purple-500' },
                            ].map((plan) => (
                                <div key={plan.label} className="flex items-center gap-2">
                                    <span className={`w-16 text-sm font-medium ${plan.color}`}>{plan.label}</span>
                                    <span className="text-muted">¥</span>
                                    <input
                                        type="number"
                                        value={plan.value}
                                        onChange={(e) => plan.setter(Math.max(0, parseInt(e.target.value) || 0))}
                                        className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                                        inputMode="numeric"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ユーザー配分 */}
                    <div className="p-4 border border-border rounded-lg">
                        <label className="block text-sm font-medium mb-3">ユーザー配分</label>
                        <div className="space-y-4">
                            {[
                                { label: 'Free', value: freePercent, plan: 'free' as const, users: freeUsers, mrr: freeMRR, color: 'bg-gray-400' },
                                { label: 'Starter', value: starterPercent, plan: 'starter' as const, users: starterUsers, mrr: starterMRR, color: 'bg-accent' },
                                { label: 'Pro', value: proPercent, plan: 'pro' as const, users: proUsers, mrr: proMRR, color: 'bg-purple-500' },
                            ].map((item) => (
                                <div key={item.label}>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm">{item.label}</span>
                                        <span className="text-sm text-muted">{item.value}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={item.value}
                                        onChange={(e) => handlePercentChange(item.plan, parseInt(e.target.value))}
                                        className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-accent"
                                        style={{ touchAction: 'none' }}
                                    />
                                    <div className="flex justify-between text-xs text-muted mt-1">
                                        <span>{item.users.toLocaleString()}人</span>
                                        <span>{formatCompactCurrency(item.mrr)}/月</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 詳細設定 */}
                    <div className="border border-border rounded-lg overflow-hidden">
                        <button
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            className="w-full px-4 py-3 flex items-center justify-between text-sm font-medium hover:bg-accent/5 transition-colors"
                        >
                            <span>詳細設定</span>
                            {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        {showAdvanced && (
                            <div className="p-4 border-t border-border space-y-4">
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm">月次成長率</span>
                                        <span className="text-sm text-green-500">+{monthlyGrowthRate}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="50"
                                        value={monthlyGrowthRate}
                                        onChange={(e) => setMonthlyGrowthRate(parseInt(e.target.value))}
                                        className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-green-500"
                                    />
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm">月次解約率</span>
                                        <span className="text-sm text-red-500">-{churnRate}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="20"
                                        step="0.5"
                                        value={churnRate}
                                        onChange={(e) => setChurnRate(parseFloat(e.target.value))}
                                        className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-red-500"
                                    />
                                </div>
                                <div className="grid grid-cols-3 gap-2 pt-2">
                                    <div className="text-center p-2 bg-accent/5 rounded">
                                        <div className="text-xs text-muted">純成長率</div>
                                        <div className={`text-sm font-medium ${monthlyGrowthRate - churnRate >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            {monthlyGrowthRate - churnRate >= 0 ? '+' : ''}{(monthlyGrowthRate - churnRate).toFixed(1)}%
                                        </div>
                                    </div>
                                    <div className="text-center p-2 bg-green-500/5 rounded">
                                        <div className="text-xs text-muted">新規/月</div>
                                        <div className="text-sm font-medium text-green-500">
                                            +{Math.round(totalUsers * monthlyGrowthRate / 100)}
                                        </div>
                                    </div>
                                    <div className="text-center p-2 bg-red-500/5 rounded">
                                        <div className="text-xs text-muted">解約/月</div>
                                        <div className="text-sm font-medium text-red-500">
                                            -{Math.round(totalUsers * churnRate / 100)}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t border-border">
                                    <span className="text-sm">Stripe手数料 (3.6%)</span>
                                    <button
                                        onClick={() => setStripeFeeEnabled(!stripeFeeEnabled)}
                                        className={`relative w-10 h-6 rounded-full transition-colors ${stripeFeeEnabled ? 'bg-accent' : 'bg-border'}`}
                                    >
                                        <span
                                            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${stripeFeeEnabled ? 'left-5' : 'left-1'}`}
                                        />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* 右カラム: 結果 */}
                <div className="space-y-4">
                    {/* MRR */}
                    <div className="p-6 bg-gradient-to-br from-accent/5 to-accent/10 border border-accent/20 rounded-lg">
                        <div className="text-sm text-muted mb-1">月次経常収益（MRR）</div>
                        <div className="text-3xl font-bold text-accent">{formatCurrency(totalMRR)}</div>
                        {stripeFeeEnabled && (
                            <div className="mt-2 text-sm text-muted">
                                手数料: {formatCurrency(stripeFee)} → 純MRR: <span className="text-foreground font-medium">{formatCurrency(netMRR)}</span>
                            </div>
                        )}
                    </div>

                    {/* ARR */}
                    <div className="p-6 bg-gradient-to-br from-purple-500/5 to-purple-500/10 border border-purple-500/20 rounded-lg">
                        <div className="text-sm text-muted mb-1">年次経常収益（ARR）</div>
                        <div className="text-3xl font-bold text-purple-500">{formatCompactCurrency(totalARR)}</div>
                        {stripeFeeEnabled && (
                            <div className="mt-2 text-sm text-muted">
                                年間手数料: {formatCompactCurrency(stripeFee * 12)} → 純ARR: <span className="text-foreground font-medium">{formatCompactCurrency(netARR)}</span>
                            </div>
                        )}
                    </div>

                    {/* ARPU / ARPPU */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-gradient-to-br from-green-500/5 to-green-500/10 border border-green-500/20 rounded-lg">
                            <div className="text-xs text-muted mb-1">ARPU（全体）</div>
                            <div className="text-xl font-bold text-green-500">{formatCurrency(arpu)}</div>
                            <div className="text-xs text-muted mt-1">/ ユーザー / 月</div>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-orange-500/5 to-orange-500/10 border border-orange-500/20 rounded-lg">
                            <div className="text-xs text-muted mb-1">ARPPU（有料のみ）</div>
                            <div className="text-xl font-bold text-orange-500">{formatCurrency(arppu)}</div>
                            <div className="text-xs text-muted mt-1">/ 有料ユーザー / 月</div>
                        </div>
                    </div>

                    {/* 12ヶ月後サマリー */}
                    <div className="p-4 border border-border rounded-lg">
                        <div className="text-sm font-medium mb-3">12ヶ月後の予測</div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <div className="text-muted text-xs">ユーザー数</div>
                                <div className="font-medium flex items-center gap-1">
                                    {lastMonth?.ユーザー数.toLocaleString()}人
                                    {userGrowthRate >= 0 ? (
                                        <TrendingUp className="w-3 h-3 text-green-500" />
                                    ) : (
                                        <TrendingDown className="w-3 h-3 text-red-500" />
                                    )}
                                    <span className={userGrowthRate >= 0 ? 'text-green-500 text-xs' : 'text-red-500 text-xs'}>
                                        {userGrowthRate >= 0 ? '+' : ''}{userGrowthRate.toFixed(1)}%
                                    </span>
                                </div>
                            </div>
                            <div>
                                <div className="text-muted text-xs">純MRR</div>
                                <div className="font-medium">{formatCompactCurrency(lastMonth?.純MRR || 0)}</div>
                            </div>
                            <div>
                                <div className="text-muted text-xs">累積純売上</div>
                                <div className="font-medium">{formatCompactCurrency(lastMonth?.累積純売上 || 0)}</div>
                            </div>
                            <div>
                                <div className="text-muted text-xs">年換算ARR</div>
                                <div className="font-medium">{formatCompactCurrency((lastMonth?.純MRR || 0) * 12)}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* グラフエリア */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium">12ヶ月シミュレーション</h2>
                    <button
                        onClick={exportCSV}
                        className="flex items-center gap-2 px-3 py-2 text-sm border border-border rounded-lg hover:bg-accent/10 transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        CSV出力
                    </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* MRR推移 */}
                    <div className="p-4 border border-border rounded-lg">
                        <h3 className="text-sm font-medium mb-4">MRR推移</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={growthData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                    <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="var(--muted)" />
                                    <YAxis
                                        tickFormatter={(v) => `¥${(v / 10000).toFixed(0)}万`}
                                        tick={{ fontSize: 11 }}
                                        stroke="var(--muted)"
                                    />
                                    <Tooltip
                                        formatter={(value) => formatCurrency(Number(value) || 0)}
                                        contentStyle={{
                                            backgroundColor: 'var(--background)',
                                            border: '1px solid var(--border)',
                                            borderRadius: '8px',
                                        }}
                                    />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="総MRR"
                                        stroke="var(--accent)"
                                        strokeWidth={2}
                                        dot={false}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="純MRR"
                                        stroke="#8b5cf6"
                                        strokeWidth={2}
                                        dot={false}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* ユーザー数推移 */}
                    <div className="p-4 border border-border rounded-lg">
                        <h3 className="text-sm font-medium mb-4">ユーザー数推移</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={growthData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                    <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="var(--muted)" />
                                    <YAxis tick={{ fontSize: 11 }} stroke="var(--muted)" />
                                    <Tooltip
                                        formatter={(value) => `${Number(value).toLocaleString()}人`}
                                        contentStyle={{
                                            backgroundColor: 'var(--background)',
                                            border: '1px solid var(--border)',
                                            borderRadius: '8px',
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="ユーザー数"
                                        stroke="#22c55e"
                                        strokeWidth={3}
                                        dot={false}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* プラン別ユーザー数 */}
                    <div className="p-4 border border-border rounded-lg">
                        <h3 className="text-sm font-medium mb-4">プラン別ユーザー数</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={growthData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                    <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="var(--muted)" />
                                    <YAxis tick={{ fontSize: 11 }} stroke="var(--muted)" />
                                    <Tooltip
                                        formatter={(value) => `${Number(value).toLocaleString()}人`}
                                        contentStyle={{
                                            backgroundColor: 'var(--background)',
                                            border: '1px solid var(--border)',
                                            borderRadius: '8px',
                                        }}
                                    />
                                    <Legend />
                                    <Bar dataKey="Free" stackId="a" fill="#9ca3af" />
                                    <Bar dataKey="Starter" stackId="a" fill="var(--accent)" />
                                    <Bar dataKey="Pro" stackId="a" fill="#8b5cf6" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* 累積純売上 */}
                    <div className="p-4 border border-border rounded-lg">
                        <h3 className="text-sm font-medium mb-4">累積純売上</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={growthData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                    <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="var(--muted)" />
                                    <YAxis
                                        tickFormatter={(v) => `¥${(v / 10000).toFixed(0)}万`}
                                        tick={{ fontSize: 11 }}
                                        stroke="var(--muted)"
                                    />
                                    <Tooltip
                                        formatter={(value) => formatCurrency(Number(value) || 0)}
                                        contentStyle={{
                                            backgroundColor: 'var(--background)',
                                            border: '1px solid var(--border)',
                                            borderRadius: '8px',
                                        }}
                                    />
                                    <Bar dataKey="累積純売上" fill="#f97316" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            {/* 注意書き */}
            <div className="text-xs text-muted pt-4 border-t border-border">
                ※ このツールはシミュレーション用です。実際の収益は様々な要因により異なります。
                <br />
                ※ データはブラウザ上でのみ処理され、サーバーには送信されません。
            </div>
        </div>
    )
}


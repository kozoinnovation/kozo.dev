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
import { Download, TrendingUp, TrendingDown, Users, Plus, Trash2, Share2, Copy, Check, X, MessageCircle, Edit3, Globe } from 'lucide-react'

const STRIPE_FEE_RATE = 0.036

// カスタムコスト項目の型
type CostItem = {
    id: string
    name: string
    type: 'fixed' | 'variable'
    amount: number
}

type Lang = 'ja' | 'en'

// 翻訳オブジェクト
const translations = {
    ja: {
        totalUsers: '総ユーザー数',
        people: '人',
        planPricing: 'プラン料金（月額）',
        firstMonthFree: '初月無料',
        freeAvailable: 'Freeあり',
        allPaid: '全員有料',
        firstMonthFreeDesc: '🎁 新規ユーザーは初月無料。翌月から課金開始。',
        userDistribution: 'ユーザー配分',
        growthSimulation: '成長シミュレーション',
        netGrowthRate: '純成長率（月次）',
        monthly: '月',
        growthRate: '成長率',
        churnRate: '解約率',
        presets: 'プリセット:',
        stable: '安定',
        growing: '成長期',
        rapid: '急成長',
        stagnant: '停滞',
        maintenanceCost: '維持コスト',
        total: '合計:',
        perMonth: '/月',
        noCost: 'コストなし（利益率100%）',
        costName: '項目名（例: サーバー費, 人件費）',
        fixedCost: '固定費（¥/月）',
        variableCost: '変動費（% of MRR）',
        amount: '金額',
        ratio: '割合',
        cancel: 'キャンセル',
        add: '追加',
        addCost: 'コストを追加',
        profitRate: '利益率',
        mrr: '月次経常収益（MRR）',
        arr: '年次経常収益（ARR）',
        cost: 'コスト',
        netMrr: '純MRR',
        annualCost: '年間コスト',
        netArr: '純ARR',
        arpuAll: 'ARPU（全体）',
        arppuPaid: 'ARPPU（有料のみ）',
        perUser: '/ ユーザー / 月',
        perPaidUser: '/ 有料ユーザー / 月',
        forecast12: '12ヶ月後の予測',
        users: 'ユーザー数',
        cumulativeNet: '累積純売上',
        annualizedArr: '年換算ARR',
        simulation12: '12ヶ月シミュレーション',
        share: 'シェア',
        mrrTrend: 'MRR推移',
        userTrend: 'ユーザー数推移',
        usersByPlan: 'プラン別ユーザー数',
        cumulativeRevenue: '累積純売上',
        disclaimer1: '※ このツールはシミュレーション用です。実際の収益は様々な要因により異なります。',
        disclaimer2: '※ データはブラウザ上でのみ処理され、サーバーには送信されません。',
        shareText: 'シェアテキスト（編集可能）',
        chars: '文字',
        reset: 'リセット',
        selectDestination: 'シェア先を選択',
        copied: 'コピー済み',
        copy: 'コピー',
        preview: 'プレビュー',
        fixed: '固定',
        variable: '変動',
        stripeFee: 'Stripe手数料',
        currentMrr: '現在のMRRで:',
        firstMonthFreeDiscount: '初月無料',
        peopleUnit: '人分',
        newAcquisition: '新規獲得',
        churn: '解約',
        netIncrease: '純増',
        totalMrr: '総MRR',
        month: '月',
    },
    en: {
        totalUsers: 'Total Users',
        people: '',
        planPricing: 'Plan Pricing (Monthly)',
        firstMonthFree: '1st Free',
        freeAvailable: 'Free Plan',
        allPaid: 'All Paid',
        firstMonthFreeDesc: '🎁 New users get first month free. Billing starts next month.',
        userDistribution: 'User Distribution',
        growthSimulation: 'Growth Simulation',
        netGrowthRate: 'Net Growth Rate (Monthly)',
        monthly: '/mo',
        growthRate: 'Growth',
        churnRate: 'Churn',
        presets: 'Presets:',
        stable: 'Stable',
        growing: 'Growing',
        rapid: 'Rapid',
        stagnant: 'Stagnant',
        maintenanceCost: 'Operating Costs',
        total: 'Total:',
        perMonth: '/mo',
        noCost: 'No costs (100% margin)',
        costName: 'Name (e.g. Server, Staff)',
        fixedCost: 'Fixed ($/mo)',
        variableCost: 'Variable (% of MRR)',
        amount: 'Amount',
        ratio: 'Ratio',
        cancel: 'Cancel',
        add: 'Add',
        addCost: 'Add Cost',
        profitRate: 'Profit Margin',
        mrr: 'Monthly Recurring Revenue (MRR)',
        arr: 'Annual Recurring Revenue (ARR)',
        cost: 'Cost',
        netMrr: 'Net MRR',
        annualCost: 'Annual Cost',
        netArr: 'Net ARR',
        arpuAll: 'ARPU (All)',
        arppuPaid: 'ARPPU (Paid)',
        perUser: '/ user / mo',
        perPaidUser: '/ paid user / mo',
        forecast12: '12-Month Forecast',
        users: 'Users',
        cumulativeNet: 'Cumulative Net',
        annualizedArr: 'Annualized ARR',
        simulation12: '12-Month Simulation',
        share: 'Share',
        mrrTrend: 'MRR Trend',
        userTrend: 'User Trend',
        usersByPlan: 'Users by Plan',
        cumulativeRevenue: 'Cumulative Net Revenue',
        disclaimer1: '※ This tool is for simulation purposes. Actual revenue may vary.',
        disclaimer2: '※ Data is processed locally and not sent to any server.',
        shareText: 'Share Text (Editable)',
        chars: 'chars',
        reset: 'Reset',
        selectDestination: 'Select Destination',
        copied: 'Copied',
        copy: 'Copy',
        preview: 'Preview',
        fixed: 'Fixed',
        variable: 'Variable',
        stripeFee: 'Stripe Fee',
        currentMrr: 'At current MRR:',
        firstMonthFreeDiscount: '1st Free',
        peopleUnit: 'users',
        newAcquisition: 'New',
        churn: 'Churn',
        netIncrease: 'Net',
        totalMrr: 'Total MRR',
        month: '',
    },
}

// 通貨フォーマット
const formatCurrency = (amount: number, lang: Lang = 'ja') => {
    if (lang === 'en') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
        }).format(Math.round(amount / 150)) // 簡易的に円→ドル換算
    }
    return new Intl.NumberFormat('ja-JP', {
        style: 'currency',
        currency: 'JPY',
        minimumFractionDigits: 0,
    }).format(amount)
}

const formatCompactCurrency = (amount: number, lang: Lang = 'ja') => {
    if (lang === 'en') {
        const usd = Math.round(amount / 150)
        if (usd >= 1000000) {
            return `$${(usd / 1000000).toFixed(1)}M`
        }
        if (usd >= 1000) {
            return `$${(usd / 1000).toFixed(1)}K`
        }
        return formatCurrency(amount, lang)
    }
    if (amount >= 100000000) {
        return `¥${(amount / 100000000).toFixed(1)}億`
    }
    if (amount >= 10000) {
        return `¥${(amount / 10000).toFixed(1)}万`
    }
    return formatCurrency(amount, lang)
}

export function SaaSCalculator() {
    // 言語設定
    const [lang, setLang] = useState<Lang>('ja')
    const t = translations[lang]

    // 基本設定
    const [totalUsers, setTotalUsers] = useState<number | ''>(1000)
    const [stripeFeeEnabled, setStripeFeeEnabled] = useState(true)
    const [freePlanEnabled, setFreePlanEnabled] = useState(true)
    const [firstMonthFree, setFirstMonthFree] = useState(false)

    // プラン料金
    const [freePlanPrice, setFreePlanPrice] = useState<number | ''>(0)
    const [starterPlanPrice, setStarterPlanPrice] = useState<number | ''>(980)
    const [proPlanPrice, setProPlanPrice] = useState<number | ''>(2980)

    // ユーザー配分
    const [freePercent, setFreePercent] = useState<number | ''>(60)
    const [starterPercent, setStarterPercent] = useState<number | ''>(30)
    const [proPercent, setProPercent] = useState<number | ''>(10)

    // 成長・解約率
    const [monthlyGrowthRate, setMonthlyGrowthRate] = useState<number | ''>(10)
    const [churnRate, setChurnRate] = useState<number | ''>(5)

    // カスタムコスト項目
    const [customCosts, setCustomCosts] = useState<CostItem[]>([])
    const [showAddCost, setShowAddCost] = useState(false)
    const [newCostName, setNewCostName] = useState('')
    const [newCostType, setNewCostType] = useState<'fixed' | 'variable'>('fixed')
    const [newCostAmount, setNewCostAmount] = useState<number | ''>(0)
    const [copied, setCopied] = useState(false)
    const [showShareModal, setShowShareModal] = useState(false)
    const [customShareText, setCustomShareText] = useState('')

    // UI制御

    // 計算用に数値化（空文字は0として扱う）
    const numTotalUsers = totalUsers || 0
    const numFreePercent = freePercent || 0
    const numStarterPercent = starterPercent || 0
    const numProPercent = proPercent || 0
    const numFreePlanPrice = freePlanPrice || 0
    const numStarterPlanPrice = starterPlanPrice || 0
    const numProPlanPrice = proPlanPrice || 0
    const numMonthlyGrowthRate = monthlyGrowthRate || 0
    const numChurnRate = churnRate || 0
    const numNewCostAmount = newCostAmount || 0

    // 計算値（Freeプラン無効時はFree=0、StarterとProはそのまま使用）
    const effectiveFreePercent = freePlanEnabled ? numFreePercent : 0
    const effectiveStarterPercent = freePlanEnabled ? numStarterPercent : numStarterPercent
    const effectiveProPercent = freePlanEnabled ? numProPercent : numProPercent

    const freeUsers = Math.round((numTotalUsers * effectiveFreePercent) / 100)
    const starterUsers = Math.round((numTotalUsers * effectiveStarterPercent) / 100)
    const proUsers = Math.round((numTotalUsers * effectiveProPercent) / 100)

    // 初月無料: 新規ユーザー（成長率分）は初月無料
    const newUsersPerMonth = Math.round(numTotalUsers * (numMonthlyGrowthRate / 100))
    const freeTrialStarterUsers = firstMonthFree ? Math.round(newUsersPerMonth * effectiveStarterPercent / 100) : 0
    const freeTrialProUsers = firstMonthFree ? Math.round(newUsersPerMonth * effectiveProPercent / 100) : 0

    const freeMRR = freeUsers * numFreePlanPrice
    const starterMRR = (starterUsers - freeTrialStarterUsers) * numStarterPlanPrice
    const proMRR = (proUsers - freeTrialProUsers) * numProPlanPrice
    const totalMRR = freeMRR + starterMRR + proMRR

    // 初月無料なしの場合のMRR（比較用）
    const fullMRR = freeUsers * numFreePlanPrice + starterUsers * numStarterPlanPrice + proUsers * numProPlanPrice
    const freeTrialDiscount = fullMRR - totalMRR

    const stripeFee = stripeFeeEnabled ? totalMRR * STRIPE_FEE_RATE : 0

    // カスタムコストの計算
    const fixedCosts = customCosts
        .filter(c => c.type === 'fixed')
        .reduce((sum, c) => sum + c.amount, 0)
    const variableCosts = customCosts
        .filter(c => c.type === 'variable')
        .reduce((sum, c) => sum + (totalMRR * c.amount / 100), 0)
    const totalCustomCosts = fixedCosts + variableCosts
    const totalCosts = stripeFee + totalCustomCosts

    const netMRR = totalMRR - totalCosts
    const profitRate = totalMRR > 0 ? (netMRR / totalMRR) * 100 : 0
    const totalARR = totalMRR * 12
    const netARR = netMRR * 12

    const arpu = numTotalUsers > 0 ? totalMRR / numTotalUsers : 0
    const paidUsers = starterUsers + proUsers
    const arppu = paidUsers > 0 ? (starterMRR + proMRR) / paidUsers : 0

    // 12ヶ月シミュレーション
    const growthData = useMemo(() => {
        const data = []
        let currentUsers = numTotalUsers
        let cumulativeNetRevenue = 0
        let freeTrialUsers = 0 // 無料トライアル中のユーザー数

        for (let month = 1; month <= 12; month++) {
            const monthStartUsers = month === 1 ? numTotalUsers : currentUsers
            const newUsers = Math.round(monthStartUsers * (numMonthlyGrowthRate / 100))
            const churnedUsers = Math.round(monthStartUsers * (numChurnRate / 100))
            currentUsers = Math.max(0, monthStartUsers + newUsers - churnedUsers)

            const monthlyFreeUsers = Math.round((currentUsers * effectiveFreePercent) / 100)
            const monthlyStarterUsers = Math.round((currentUsers * effectiveStarterPercent) / 100)
            const monthlyProUsers = Math.round((currentUsers * effectiveProPercent) / 100)

            // 初月無料プロモーション: 新規ユーザーは初月無料
            const paidStarterUsers = monthlyStarterUsers - (firstMonthFree ? Math.round(freeTrialUsers * effectiveStarterPercent / 100) : 0)
            const paidProUsers = monthlyProUsers - (firstMonthFree ? Math.round(freeTrialUsers * effectiveProPercent / 100) : 0)

            const monthlyFreeMRR = monthlyFreeUsers * numFreePlanPrice
            const monthlyStarterMRR = Math.max(0, paidStarterUsers) * numStarterPlanPrice
            const monthlyProMRR = Math.max(0, paidProUsers) * numProPlanPrice
            const monthlyTotalMRR = monthlyFreeMRR + monthlyStarterMRR + monthlyProMRR

            const monthlyStripeFee = stripeFeeEnabled ? monthlyTotalMRR * STRIPE_FEE_RATE : 0
            const monthlyVariableCosts = customCosts
                .filter(c => c.type === 'variable')
                .reduce((sum, c) => sum + (monthlyTotalMRR * c.amount / 100), 0)
            const monthlyTotalCosts = monthlyStripeFee + fixedCosts + monthlyVariableCosts
            const monthlyNetMRR = monthlyTotalMRR - monthlyTotalCosts
            cumulativeNetRevenue += monthlyNetMRR

            // 来月用: 今月の新規ユーザーが無料トライアル対象
            freeTrialUsers = newUsers

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
                Standard: monthlyStarterUsers,
                Pro: monthlyProUsers,
                無料トライアル中: firstMonthFree ? freeTrialUsers : 0,
            })
        }
        return data
    }, [
        numTotalUsers,
        numMonthlyGrowthRate,
        numChurnRate,
        effectiveFreePercent,
        effectiveStarterPercent,
        effectiveProPercent,
        numFreePlanPrice,
        numStarterPlanPrice,
        numProPlanPrice,
        stripeFeeEnabled,
        customCosts,
        fixedCosts,
        firstMonthFree,
    ])

    // パーセンテージ変更ハンドラ
    const handlePercentChange = (plan: 'free' | 'starter' | 'pro', value: number) => {
        const clampedValue = Math.max(0, Math.min(100, value))
        const remaining = 100 - clampedValue

        if (!freePlanEnabled) {
            // Freeプラン無効時はStarterとProで100%に
            if (plan === 'starter') {
                setStarterPercent(clampedValue)
                setProPercent(remaining)
            } else if (plan === 'pro') {
                setProPercent(clampedValue)
                setStarterPercent(remaining)
            }
            return
        }

        if (plan === 'free') {
            setFreePercent(clampedValue)
            const starterRatio = numStarterPercent / (numStarterPercent + numProPercent) || 0.5
            setStarterPercent(Math.round(remaining * starterRatio))
            setProPercent(Math.round(remaining * (1 - starterRatio)))
        } else if (plan === 'starter') {
            setStarterPercent(clampedValue)
            const freeRatio = numFreePercent / (numFreePercent + numProPercent) || 0.5
            setFreePercent(Math.round(remaining * freeRatio))
            setProPercent(Math.round(remaining * (1 - freeRatio)))
        } else {
            setProPercent(clampedValue)
            const freeRatio = numFreePercent / (numFreePercent + numStarterPercent) || 0.5
            setFreePercent(Math.round(remaining * freeRatio))
            setStarterPercent(Math.round(remaining * (1 - freeRatio)))
        }
    }

    // カスタムコスト追加
    const addCustomCost = () => {
        if (!newCostName.trim() || numNewCostAmount <= 0) return
        const newCost: CostItem = {
            id: Date.now().toString(),
            name: newCostName.trim(),
            type: newCostType,
            amount: numNewCostAmount,
        }
        setCustomCosts([...customCosts, newCost])
        setNewCostName('')
        setNewCostAmount('')
        setShowAddCost(false)
    }

    // カスタムコスト削除
    const removeCustomCost = (id: string) => {
        setCustomCosts(customCosts.filter(c => c.id !== id))
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
        csv += `総ユーザー数,${numTotalUsers}\n`
        csv += `月次成長率,${numMonthlyGrowthRate}%\n`
        csv += `月次解約率,${numChurnRate}%\n`
        csv += `純成長率,${numMonthlyGrowthRate - numChurnRate}%\n`
        csv += `Stripe手数料,${stripeFeeEnabled ? '有効' : '無効'}\n\n`

        csv += '【プラン配分】\n'
        csv += 'プラン名,配分率,ユーザー数,月額料金,月次収益(MRR)\n'
        csv += `Free,${numFreePercent}%,${freeUsers},${formatCurrency(numFreePlanPrice)},${formatCurrency(freeMRR)}\n`
        csv += `Standard,${numStarterPercent}%,${starterUsers},${formatCurrency(numStarterPlanPrice)},${formatCurrency(starterMRR)}\n`
        csv += `Pro,${numProPercent}%,${proUsers},${formatCurrency(numProPlanPrice)},${formatCurrency(proMRR)}\n`
        csv += `合計,100%,${numTotalUsers},-,${formatCurrency(totalMRR)}\n\n`

        csv += '【コスト内訳】\n'
        csv += '項目,タイプ,金額\n'
        if (stripeFeeEnabled) {
            csv += `Stripe手数料,変動(3.6%),${formatCurrency(stripeFee)}\n`
        }
        customCosts.forEach(cost => {
            const costAmount = cost.type === 'fixed' ? cost.amount : totalMRR * cost.amount / 100
            csv += `${cost.name},${cost.type === 'fixed' ? '固定' : `変動(${cost.amount}%)`},${formatCurrency(costAmount)}\n`
        })
        csv += `コスト合計,-,${formatCurrency(totalCosts)}\n\n`

        csv += '【現在の収益指標】\n'
        csv += '指標,金額\n'
        csv += `総MRR,${formatCurrency(totalMRR)}\n`
        csv += `総コスト,${formatCurrency(totalCosts)}\n`
        csv += `純MRR,${formatCurrency(netMRR)}\n`
        csv += `利益率,${profitRate.toFixed(1)}%\n`
        csv += `総ARR,${formatCurrency(totalARR)}\n`
        csv += `年間コスト,${formatCurrency(totalCosts * 12)}\n`
        csv += `純ARR,${formatCurrency(netARR)}\n`
        csv += `ARPU,${formatCurrency(arpu)}\n`
        csv += `ARPPU,${formatCurrency(arppu)}\n\n`

        csv += '【12ヶ月間の推移データ】\n'
        csv += '月,総ユーザー数,新規獲得,解約数,純増,Freeユーザー,Standardユーザー,Proユーザー,総MRR,純MRR,累積純売上\n'
        growthData.forEach((d) => {
            csv += `${d.month},${d.ユーザー数},${d.新規獲得},${d.解約},${d.純増},${d.Free},${d.Standard},${d.Pro},${formatCurrency(d.総MRR)},${formatCurrency(d.純MRR)},${formatCurrency(d.累積純売上)}\n`
        })

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = `SaaS収益シミュレーション_${timestamp}.csv`
        link.click()
    }

    // シェアテキスト生成
    const generateShareText = () => {
        const netGrowth = numMonthlyGrowthRate - numChurnRate
        const text = `📊 SaaS収益シミュレーション
━━━━━━━━━━━━━━━━━━━━━━
👥 ${numTotalUsers.toLocaleString()}人 → 12ヶ月後 ${lastMonth?.ユーザー数.toLocaleString()}人
💰 MRR ${formatCompactCurrency(totalMRR)} → ${formatCompactCurrency(lastMonth?.純MRR || 0)}
📈 純成長率 ${netGrowth >= 0 ? '+' : ''}${netGrowth.toFixed(1)}%/月
💵 12ヶ月累積 ${formatCompactCurrency(lastMonth?.累積純売上 || 0)}
━━━━━━━━━━━━━━━━━━━━━━
🔗 kozo.dev/tools/saas-calculator`
        return text
    }

    // シェアモーダルを開く
    const openShareModal = () => {
        setCustomShareText(generateShareText())
        setShowShareModal(true)
    }

    // Xでシェア
    const shareToX = (text?: string) => {
        const shareText = text || generateShareText()
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`
        window.open(url, '_blank', 'noopener,noreferrer')
    }

    // LINEでシェア
    const shareToLINE = (text?: string) => {
        const shareText = text || generateShareText()
        const url = `https://social-plugins.line.me/lineit/share?text=${encodeURIComponent(shareText)}`
        window.open(url, '_blank', 'noopener,noreferrer')
    }

    // Threadsでシェア（URLスキーム経由）
    const shareToThreads = async (text?: string) => {
        const shareText = text || generateShareText()
        // ThreadsはWeb共有APIがないため、テキストをコピーしてアプリを開く
        try {
            await navigator.clipboard.writeText(shareText)
            // barcelona://はThreadsのURLスキーム
            window.open('https://www.threads.net/intent/post', '_blank', 'noopener,noreferrer')
        } catch {
            // フォールバック
            const textarea = document.createElement('textarea')
            textarea.value = shareText
            document.body.appendChild(textarea)
            textarea.select()
            document.execCommand('copy')
            document.body.removeChild(textarea)
            window.open('https://www.threads.net', '_blank', 'noopener,noreferrer')
        }
    }

    // クリップボードにコピー
    const copyToClipboard = async (text?: string) => {
        const shareText = text || generateShareText()
        try {
            await navigator.clipboard.writeText(shareText)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch {
            // フォールバック
            const textarea = document.createElement('textarea')
            textarea.value = shareText
            document.body.appendChild(textarea)
            textarea.select()
            document.execCommand('copy')
            document.body.removeChild(textarea)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    const lastMonth = growthData[growthData.length - 1]
    const firstMonth = growthData[0]
    const userGrowthRate = firstMonth ? ((lastMonth.ユーザー数 - firstMonth.ユーザー数) / firstMonth.ユーザー数) * 100 : 0

    return (
        <div className="space-y-8">
            {/* 言語切り替え */}
            <div className="flex justify-end">
                <button
                    onClick={() => setLang(lang === 'ja' ? 'en' : 'ja')}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-accent/10 transition-colors"
                >
                    <Globe className="w-4 h-4" />
                    {lang === 'ja' ? 'EN' : 'JP'}
                </button>
            </div>

            {/* 設定エリア */}
            <div className="grid md:grid-cols-2 gap-8">
                {/* 左カラム: 入力 */}
                <div className="space-y-6">
                    {/* 総ユーザー数 */}
                    <div className="p-4 border border-border rounded-lg">
                        <label className="block text-sm font-medium mb-3">
                            <Users className="inline w-4 h-4 mr-1" />
                            {t.totalUsers}
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                value={totalUsers}
                                onChange={(e) => {
                                    const v = e.target.value
                                    setTotalUsers(v === '' ? '' : Math.max(0, parseInt(v) || 0))
                                }}
                                className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                                inputMode="numeric"
                            />
                            <span className="text-muted text-sm">{t.people}</span>
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
                        <div className="flex items-center justify-between mb-3">
                            <label className="text-sm font-medium">{t.planPricing}</label>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setFirstMonthFree(!firstMonthFree)}
                                    className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-full transition-colors ${
                                        firstMonthFree
                                            ? 'bg-orange-500 text-white'
                                            : 'bg-gray-200 dark:bg-gray-700 text-muted'
                                    }`}
                                >
                                    <span className={`w-2 h-2 rounded-full ${firstMonthFree ? 'bg-white' : 'bg-gray-400'}`} />
                                    {t.firstMonthFree}
                                </button>
                                <button
                                    onClick={() => {
                                        if (freePlanEnabled) {
                                            // Freeプランをオフにする時、配分を調整
                                            const total = numStarterPercent + numProPercent
                                            if (total > 0) {
                                                setStarterPercent(Math.round(numStarterPercent / total * 100))
                                                setProPercent(Math.round(numProPercent / total * 100))
                                            } else {
                                                setStarterPercent(50)
                                                setProPercent(50)
                                            }
                                        }
                                        setFreePlanEnabled(!freePlanEnabled)
                                    }}
                                    className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-full transition-colors ${
                                        freePlanEnabled
                                            ? 'bg-gray-200 dark:bg-gray-700 text-muted'
                                            : 'bg-accent text-white'
                                    }`}
                                >
                                    <span className={`w-2 h-2 rounded-full ${freePlanEnabled ? 'bg-gray-400' : 'bg-white'}`} />
                                    {freePlanEnabled ? t.freeAvailable : t.allPaid}
                                </button>
                            </div>
                        </div>
                        <div className="space-y-3">
                            {[
                                { label: 'Free', value: freePlanPrice, setter: setFreePlanPrice, color: 'text-muted', show: freePlanEnabled },
                                { label: 'Standard', value: starterPlanPrice, setter: setStarterPlanPrice, color: 'text-accent', show: true },
                                { label: 'Pro', value: proPlanPrice, setter: setProPlanPrice, color: 'text-purple-500', show: true },
                            ].filter(plan => plan.show).map((plan) => (
                                <div key={plan.label} className="flex items-center gap-2">
                                    <span className={`w-16 text-sm font-medium ${plan.color}`}>{plan.label}</span>
                                    <span className="text-muted">¥</span>
                                    <input
                                        type="number"
                                        value={plan.value}
                                        onChange={(e) => {
                                            const v = e.target.value
                                            plan.setter(v === '' ? '' : Math.max(0, parseInt(v) || 0))
                                        }}
                                        className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                                        inputMode="numeric"
                                    />
                                </div>
                            ))}
                        </div>
                        {firstMonthFree && (
                            <div className="mt-3 p-2 bg-orange-500/10 rounded-lg text-xs text-orange-600 dark:text-orange-400">
                                {t.firstMonthFreeDesc}
                            </div>
                        )}
                    </div>

                    {/* ユーザー配分 */}
                    <div className="p-4 border border-border rounded-lg">
                        <label className="block text-sm font-medium mb-3">{t.userDistribution}</label>
                        <div className="space-y-4">
                            {[
                                { label: 'Free', value: freePercent, displayValue: effectiveFreePercent, plan: 'free' as const, users: freeUsers, mrr: freeMRR, color: 'bg-gray-400', show: freePlanEnabled },
                                { label: 'Standard', value: starterPercent, displayValue: effectiveStarterPercent, plan: 'starter' as const, users: starterUsers, mrr: starterMRR, color: 'bg-accent', show: true },
                                { label: 'Pro', value: proPercent, displayValue: effectiveProPercent, plan: 'pro' as const, users: proUsers, mrr: proMRR, color: 'bg-purple-500', show: true },
                            ].filter(item => item.show).map((item) => (
                                <div key={item.label}>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm">{item.label}</span>
                                        <span className="text-sm text-muted">{item.displayValue}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={item.value}
                                        onChange={(e) => handlePercentChange(item.plan, parseInt(e.target.value))}
                                        onTouchEnd={(e) => e.preventDefault()}
                                        className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-accent"
                                        style={{ touchAction: 'none' }}
                                    />
                                    <div className="flex justify-between text-xs text-muted mt-1">
                                        <span>{item.users.toLocaleString()}{t.people}</span>
                                        <span>{formatCompactCurrency(item.mrr, lang)}{t.perMonth}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 成長・解約率 */}
                    <div className="p-4 border border-border rounded-lg">
                        <label className="block text-sm font-medium mb-4">
                            <TrendingUp className="inline w-4 h-4 mr-1" />
                            {t.growthSimulation}
                        </label>

                        {/* 純成長率（メイン表示） */}
                        <div className={`text-center p-4 rounded-lg mb-4 ${numMonthlyGrowthRate - numChurnRate >= 0 ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
                            <div className="text-xs text-muted mb-1">{t.netGrowthRate}</div>
                            <div className={`text-2xl font-bold ${numMonthlyGrowthRate - numChurnRate >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {numMonthlyGrowthRate - numChurnRate >= 0 ? '+' : ''}{(numMonthlyGrowthRate - numChurnRate).toFixed(1)}%
                            </div>
                            <div className="text-xs text-muted mt-1">
                                {numMonthlyGrowthRate - numChurnRate >= 0 ? '+' : ''}{Math.round(numTotalUsers * (numMonthlyGrowthRate - numChurnRate) / 100)}{t.people}{t.monthly}
                            </div>
                        </div>

                        {/* 成長率・解約率の入力 */}
                        <div className="grid grid-cols-2 gap-3">
                            {/* 成長率 */}
                            <div className="p-3 bg-green-500/5 rounded-lg border border-green-500/10">
                                <div className="flex items-center gap-1 mb-2">
                                    <TrendingUp className="w-3 h-3 text-green-500" />
                                    <span className="text-xs text-green-600 dark:text-green-400">{t.growthRate}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="text-green-500 text-sm">+</span>
                                    <input
                                        type="number"
                                        value={monthlyGrowthRate}
                                        onChange={(e) => {
                                            const v = e.target.value
                                            setMonthlyGrowthRate(v === '' ? '' : Math.max(0, Math.min(100, parseFloat(v) || 0)))
                                        }}
                                        className="w-full px-2 py-1.5 text-sm border border-green-500/20 rounded bg-background focus:outline-none focus:ring-2 focus:ring-green-500/50"
                                        step="0.1"
                                    />
                                    <span className="text-muted text-sm">%</span>
                                </div>
                                <div className="text-xs text-muted mt-2">
                                    +{Math.round(numTotalUsers * numMonthlyGrowthRate / 100)}{t.people}{t.monthly}
                                </div>
                            </div>

                            {/* 解約率 */}
                            <div className="p-3 bg-red-500/5 rounded-lg border border-red-500/10">
                                <div className="flex items-center gap-1 mb-2">
                                    <TrendingDown className="w-3 h-3 text-red-500" />
                                    <span className="text-xs text-red-600 dark:text-red-400">{t.churnRate}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="text-red-500 text-sm">-</span>
                                    <input
                                        type="number"
                                        value={churnRate}
                                        onChange={(e) => {
                                            const v = e.target.value
                                            setChurnRate(v === '' ? '' : Math.max(0, Math.min(100, parseFloat(v) || 0)))
                                        }}
                                        className="w-full px-2 py-1.5 text-sm border border-red-500/20 rounded bg-background focus:outline-none focus:ring-2 focus:ring-red-500/50"
                                        step="0.1"
                                    />
                                    <span className="text-muted text-sm">%</span>
                                </div>
                                <div className="text-xs text-muted mt-2">
                                    -{Math.round(numTotalUsers * numChurnRate / 100)}{t.people}{t.monthly}
                                </div>
                            </div>
                        </div>

                        {/* クイックプリセット */}
                        <div className="mt-3 flex flex-wrap gap-1">
                            <span className="text-xs text-muted mr-1">{t.presets}</span>
                            {[
                                { label: t.stable, growth: 5, churn: 3 },
                                { label: t.growing, growth: 15, churn: 5 },
                                { label: t.rapid, growth: 30, churn: 8 },
                                { label: t.stagnant, growth: 3, churn: 5 },
                            ].map((preset) => (
                                <button
                                    key={preset.label}
                                    onClick={() => {
                                        setMonthlyGrowthRate(preset.growth)
                                        setChurnRate(preset.churn)
                                    }}
                                    className="px-2 py-0.5 text-xs border border-border rounded hover:bg-accent/10 transition-colors"
                                >
                                    {preset.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* カスタムコスト */}
                    <div className="p-4 border border-border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                            <label className="text-sm font-medium">{t.maintenanceCost}</label>
                            {totalCosts > 0 && (
                                <span className="text-xs text-muted">
                                    {t.total} {formatCurrency(totalCosts, lang)}{t.perMonth}
                                </span>
                            )}
                        </div>

                        {/* コスト一覧 */}
                        <div className="space-y-2 mb-3">
                            {/* Stripe手数料（常に表示） */}
                            {stripeFeeEnabled && (
                                <div className="flex items-center justify-between p-2 bg-accent/5 rounded text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs px-1.5 py-0.5 bg-purple-500/10 text-purple-500 rounded">{t.variable}</span>
                                        <span>{t.stripeFee} (3.6%)</span>
                                    </div>
                                    <span className="text-muted">-{formatCurrency(stripeFee, lang)}</span>
                                </div>
                            )}

                            {/* カスタムコスト項目 */}
                            {customCosts.map(cost => {
                                const costAmount = cost.type === 'fixed' ? cost.amount : totalMRR * cost.amount / 100
                                return (
                                    <div key={cost.id} className="flex items-center justify-between p-2 bg-accent/5 rounded text-sm group">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs px-1.5 py-0.5 rounded ${cost.type === 'fixed' ? 'bg-blue-500/10 text-blue-500' : 'bg-purple-500/10 text-purple-500'}`}>
                                                {cost.type === 'fixed' ? t.fixed : `${cost.amount}%`}
                                            </span>
                                            <span>{cost.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-muted">-{formatCurrency(costAmount, lang)}</span>
                                            <button
                                                onClick={() => removeCustomCost(cost.id)}
                                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/10 rounded transition-all"
                                            >
                                                <Trash2 className="w-3 h-3 text-red-500" />
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}

                            {!stripeFeeEnabled && customCosts.length === 0 && (
                                <div className="text-sm text-muted text-center py-2">
                                    {t.noCost}
                                </div>
                            )}
                        </div>

                        {/* コスト追加フォーム */}
                        {showAddCost ? (
                            <div className="p-3 border border-border rounded-lg space-y-3">
                                <input
                                    type="text"
                                    placeholder={t.costName}
                                    value={newCostName}
                                    onChange={(e) => setNewCostName(e.target.value)}
                                    className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setNewCostType('fixed')}
                                        className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-colors ${newCostType === 'fixed' ? 'border-blue-500 bg-blue-500/10 text-blue-500' : 'border-border hover:bg-accent/5'}`}
                                    >
                                        {t.fixedCost}
                                    </button>
                                    <button
                                        onClick={() => setNewCostType('variable')}
                                        className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-colors ${newCostType === 'variable' ? 'border-purple-500 bg-purple-500/10 text-purple-500' : 'border-border hover:bg-accent/5'}`}
                                    >
                                        {t.variableCost}
                                    </button>
                                </div>
                                <div className="flex items-center gap-2">
                                    {newCostType === 'fixed' ? (
                                        <>
                                            <span className="text-muted">{lang === 'ja' ? '¥' : '$'}</span>
                                            <input
                                                type="number"
                                                placeholder={t.amount}
                                                value={newCostAmount}
                                                onChange={(e) => {
                                                    const v = e.target.value
                                                    setNewCostAmount(v === '' ? '' : Math.max(0, parseInt(v) || 0))
                                                }}
                                                className="flex-1 px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                                                inputMode="numeric"
                                            />
                                            <span className="text-muted text-sm">{t.perMonth}</span>
                                        </>
                                    ) : (
                                        <>
                                            <input
                                                type="number"
                                                placeholder={t.ratio}
                                                value={newCostAmount}
                                                onChange={(e) => {
                                                    const v = e.target.value
                                                    setNewCostAmount(v === '' ? '' : Math.max(0, Math.min(100, parseFloat(v) || 0)))
                                                }}
                                                className="flex-1 px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                                                inputMode="decimal"
                                                step="0.1"
                                            />
                                            <span className="text-muted text-sm">% of MRR</span>
                                        </>
                                    )}
                                </div>
                                {newCostType === 'variable' && numNewCostAmount > 0 && (
                                    <div className="text-xs text-muted">
                                        {t.currentMrr} -{formatCurrency(totalMRR * numNewCostAmount / 100, lang)}{t.perMonth}
                                    </div>
                                )}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setShowAddCost(false)
                                            setNewCostName('')
                                            setNewCostAmount('')
                                        }}
                                        className="flex-1 px-3 py-2 text-sm border border-border rounded-lg hover:bg-accent/5 transition-colors"
                                    >
                                        {t.cancel}
                                    </button>
                                    <button
                                        onClick={addCustomCost}
                                        disabled={!newCostName.trim() || numNewCostAmount <= 0}
                                        className="flex-1 px-3 py-2 text-sm bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {t.add}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowAddCost(true)}
                                className="w-full px-3 py-2 text-sm border border-dashed border-border rounded-lg hover:bg-accent/5 hover:border-accent transition-colors flex items-center justify-center gap-1"
                            >
                                <Plus className="w-4 h-4" />
                                {t.addCost}
                            </button>
                        )}

                        {/* 利益率表示 */}
                        {totalMRR > 0 && (
                            <div className="mt-3 pt-3 border-t border-border">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">{t.profitRate}</span>
                                    <span className={`text-sm font-medium ${profitRate >= 80 ? 'text-green-500' : profitRate >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                                        {profitRate.toFixed(1)}%
                                    </span>
                                </div>
                                <div className="mt-2 h-2 bg-border rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all ${profitRate >= 80 ? 'bg-green-500' : profitRate >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                        style={{ width: `${Math.max(0, Math.min(100, profitRate))}%` }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* 右カラム: 結果 */}
                <div className="space-y-4">
                    {/* MRR */}
                    <div className="p-6 bg-gradient-to-br from-accent/5 to-accent/10 border border-accent/20 rounded-lg">
                        <div className="text-sm text-muted mb-1">{t.mrr}</div>
                        <div className="text-3xl font-bold text-accent">{formatCurrency(totalMRR, lang)}</div>
                        {firstMonthFree && freeTrialDiscount > 0 && (
                            <div className="mt-2 text-sm text-orange-500">
                                🎁 {t.firstMonthFreeDiscount}: -{formatCurrency(freeTrialDiscount, lang)}（{freeTrialStarterUsers + freeTrialProUsers}{t.peopleUnit}）
                            </div>
                        )}
                        {totalCosts > 0 && (
                            <div className="mt-2 text-sm text-muted">
                                {t.cost}: {formatCurrency(totalCosts, lang)} → {t.netMrr}: <span className="text-foreground font-medium">{formatCurrency(netMRR, lang)}</span>
                                <span className={`ml-2 ${profitRate >= 80 ? 'text-green-500' : profitRate >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                                    ({profitRate.toFixed(1)}%)
                                </span>
                            </div>
                        )}
                        {totalCosts === 0 && (
                            <div className="mt-2 text-sm text-green-500">
                                {t.profitRate} 100%
                            </div>
                        )}
                    </div>

                    {/* ARR */}
                    <div className="p-6 bg-gradient-to-br from-purple-500/5 to-purple-500/10 border border-purple-500/20 rounded-lg">
                        <div className="text-sm text-muted mb-1">{t.arr}</div>
                        <div className="text-3xl font-bold text-purple-500">{formatCompactCurrency(totalARR, lang)}</div>
                        {totalCosts > 0 && (
                            <div className="mt-2 text-sm text-muted">
                                {t.annualCost}: {formatCompactCurrency(totalCosts * 12, lang)} → {t.netArr}: <span className="text-foreground font-medium">{formatCompactCurrency(netARR, lang)}</span>
                            </div>
                        )}
                    </div>

                    {/* ARPU / ARPPU */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-gradient-to-br from-green-500/5 to-green-500/10 border border-green-500/20 rounded-lg">
                            <div className="text-xs text-muted mb-1">{t.arpuAll}</div>
                            <div className="text-xl font-bold text-green-500">{formatCurrency(arpu, lang)}</div>
                            <div className="text-xs text-muted mt-1">{t.perUser}</div>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-orange-500/5 to-orange-500/10 border border-orange-500/20 rounded-lg">
                            <div className="text-xs text-muted mb-1">{t.arppuPaid}</div>
                            <div className="text-xl font-bold text-orange-500">{formatCurrency(arppu, lang)}</div>
                            <div className="text-xs text-muted mt-1">{t.perPaidUser}</div>
                        </div>
                    </div>

                    {/* 12ヶ月後サマリー */}
                    <div className="p-4 border border-border rounded-lg">
                        <div className="text-sm font-medium mb-3">{t.forecast12}</div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <div className="text-muted text-xs">{t.users}</div>
                                <div className="font-medium flex items-center gap-1">
                                    {lastMonth?.ユーザー数.toLocaleString()}{t.people}
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
                                <div className="text-muted text-xs">{t.netMrr}</div>
                                <div className="font-medium">{formatCompactCurrency(lastMonth?.純MRR || 0, lang)}</div>
                            </div>
                            <div>
                                <div className="text-muted text-xs">{t.cumulativeNet}</div>
                                <div className="font-medium">{formatCompactCurrency(lastMonth?.累積純売上 || 0, lang)}</div>
                            </div>
                            <div>
                                <div className="text-muted text-xs">{t.annualizedArr}</div>
                                <div className="font-medium">{formatCompactCurrency((lastMonth?.純MRR || 0) * 12, lang)}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* グラフエリア */}
            <div className="space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <h2 className="text-lg font-medium">{t.simulation12}</h2>
                    <div className="flex items-center gap-2 flex-wrap">
                        {/* クイックシェアボタン */}
                        <button
                            onClick={() => copyToClipboard()}
                            className="flex items-center gap-2 px-3 py-2 text-sm border border-border rounded-lg hover:bg-accent/10 transition-colors"
                            title={t.copy}
                        >
                            {copied ? (
                                <Check className="w-4 h-4 text-green-500" />
                            ) : (
                                <Copy className="w-4 h-4" />
                            )}
                        </button>
                        <button
                            onClick={() => shareToX()}
                            className="flex items-center gap-2 px-3 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                            title="X"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => shareToLINE()}
                            className="flex items-center gap-2 px-3 py-2 text-sm bg-[#06C755] text-white rounded-lg hover:bg-[#05b34c] transition-colors"
                            title="LINE"
                        >
                            <MessageCircle className="w-4 h-4" />
                        </button>
                        {/* カスタマイズシェアボタン */}
                        <button
                            onClick={openShareModal}
                            className="flex items-center gap-2 px-3 py-2 text-sm bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
                        >
                            <Edit3 className="w-4 h-4" />
                            {t.share}
                        </button>
                        <button
                            onClick={exportCSV}
                            className="flex items-center gap-2 px-3 py-2 text-sm border border-border rounded-lg hover:bg-accent/10 transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            CSV
                        </button>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* MRR推移 */}
                    <div className="p-4 border border-border rounded-lg">
                        <h3 className="text-sm font-medium mb-4">{t.mrrTrend}</h3>
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
                        <h3 className="text-sm font-medium mb-4">{t.userTrend}</h3>
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
                        <h3 className="text-sm font-medium mb-4">{t.usersByPlan}</h3>
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
                                    <Bar dataKey="Standard" stackId="a" fill="var(--accent)" />
                                    <Bar dataKey="Pro" stackId="a" fill="#8b5cf6" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* 累積純売上 */}
                    <div className="p-4 border border-border rounded-lg">
                        <h3 className="text-sm font-medium mb-4">{t.cumulativeRevenue}</h3>
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
                {t.disclaimer1}
                <br />
                {t.disclaimer2}
            </div>

            {/* シェアモーダル */}
            {showShareModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* オーバーレイ */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setShowShareModal(false)}
                    />

                    {/* モーダル本体 */}
                    <div className="relative bg-background border border-border rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-auto">
                        {/* ヘッダー */}
                        <div className="flex items-center justify-between p-4 border-b border-border">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Share2 className="w-5 h-5" />
                                {t.share}
                            </h3>
                            <button
                                onClick={() => setShowShareModal(false)}
                                className="p-2 hover:bg-accent/10 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* コンテンツ */}
                        <div className="p-4 space-y-4">
                            {/* テキスト編集エリア */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    {t.shareText}
                                </label>
                                <textarea
                                    value={customShareText}
                                    onChange={(e) => setCustomShareText(e.target.value)}
                                    className="w-full h-48 px-3 py-2 text-sm border border-border rounded-lg bg-background font-mono resize-none focus:outline-none focus:ring-2 focus:ring-accent"
                                />
                                <div className="flex justify-between mt-2">
                                    <span className="text-xs text-muted">
                                        {customShareText.length} {t.chars}
                                    </span>
                                    <button
                                        onClick={() => setCustomShareText(generateShareText())}
                                        className="text-xs text-accent hover:underline"
                                    >
                                        {t.reset}
                                    </button>
                                </div>
                            </div>

                            {/* シェア先選択 */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium">
                                    {t.selectDestination}
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {/* X(Twitter) */}
                                    <button
                                        onClick={() => {
                                            shareToX(customShareText)
                                            setShowShareModal(false)
                                        }}
                                        className="flex items-center justify-center gap-2 px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                        <span>X (Twitter)</span>
                                    </button>

                                    {/* LINE */}
                                    <button
                                        onClick={() => {
                                            shareToLINE(customShareText)
                                            setShowShareModal(false)
                                        }}
                                        className="flex items-center justify-center gap-2 px-4 py-3 bg-[#06C755] text-white rounded-lg hover:bg-[#05b34c] transition-colors"
                                    >
                                        <MessageCircle className="w-5 h-5" />
                                        <span>LINE</span>
                                    </button>

                                    {/* Threads */}
                                    <button
                                        onClick={() => {
                                            shareToThreads(customShareText)
                                            setShowShareModal(false)
                                        }}
                                        className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity"
                                    >
                                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01c.024-3.576 1.15-6.428 2.523-8.48C5.844 1.183 8.593.01 12.18 0h.014c2.746.014 5.064.741 6.886 2.165 1.678 1.31 2.894 3.163 3.616 5.514l-2.04.57c-.578-1.9-1.544-3.378-2.871-4.396-1.448-1.11-3.321-1.682-5.57-1.7-2.893.02-5.073.939-6.478 2.731-1.198 1.527-1.831 3.692-1.885 6.446.054 2.754.687 4.92 1.885 6.448 1.405 1.792 3.585 2.711 6.478 2.731 2.109-.015 3.85-.458 5.179-1.317 1.395-.9 2.188-2.14 2.418-3.791l2.022.38c-.31 2.18-1.381 3.911-3.185 5.147-1.734 1.19-4 1.8-6.739 1.82zm6.27-8.49c-.125-3.2-2.159-4.956-5.728-4.956h-.132c-1.354 0-2.522.287-3.474.854-1.076.641-1.714 1.593-1.9 2.834l2.012.323c.266-1.606 1.532-2.084 3.36-2.084h.13c1.127 0 2.006.24 2.615.71.574.448.881 1.095.916 1.92-.92-.14-1.915-.22-2.974-.24-2.26 0-4.063.51-5.202 1.477-.97.822-1.482 1.958-1.48 3.283.003 1.335.55 2.44 1.584 3.199.96.704 2.213 1.06 3.725 1.06 1.884 0 3.455-.617 4.668-1.834.48-.482.857-1.015 1.127-1.586.123.86.333 1.59.633 2.186l1.767-.916c-.55-1.092-.73-2.537-.73-4.626v-1.603h.003z"/>
                                        </svg>
                                        <span>Threads</span>
                                    </button>

                                    {/* コピー */}
                                    <button
                                        onClick={() => copyToClipboard(customShareText)}
                                        className="flex items-center justify-center gap-2 px-4 py-3 border border-border rounded-lg hover:bg-accent/10 transition-colors"
                                    >
                                        {copied ? (
                                            <>
                                                <Check className="w-5 h-5 text-green-500" />
                                                <span className="text-green-500">{t.copied}</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-5 h-5" />
                                                <span>{t.copy}</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* プレビュー */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    {t.preview}
                                </label>
                                <div className="p-4 bg-accent/5 rounded-lg border border-border">
                                    <pre className="text-sm whitespace-pre-wrap font-sans text-muted">
                                        {customShareText}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}


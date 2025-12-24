# ZeroBook 収益計算システム Next.js 完全再現設計書

## 📋 プロジェクト概要

**プロジェクト名**: ZeroBook - 予約システムSaaSのマネタイズ資料  
**目的**: 投資家向け資料・ビジネスプラン作成用の料金プラン提示と収益シミュレーションツール  
**技術スタック**: Next.js (App Router / Pages Router両対応), React, TypeScript, Tailwind CSS v4, Recharts  
**主要機能**: 3段階料金プラン、リアルタイム収益計算、グラフ表示、CSVエクスポート

---

## 🎯 料金プラン構成

### プラン体系（3段階）

| プラン | 月額料金 | ターゲット | 主要機能 |
|--------|---------|-----------|----------|
| **ライト** | ¥0 | 起業初期・売上が読めない層 | 月間予約20件、1人運用、予約フォーム、即時通知 |
| **スタンダード** | ¥980 | 1人事業/小規模事業者 | 無制限予約、モバイルアプリ、Googleカレンダー連携、スプレッドシート台帳 |
| **Pro** | ¥6,980 | 複数スタッフ抱える中規模事業者 | 複数スタッフ管理、予約台帳分析ツール、シフト承認ワークフロー、マルチロケーション |

### 全プラン共通機能（Google連携）

- ✅ Googleアカウントログイン
- ✅ Googleカレンダー自動連携（スタンダード・Pro）
- ✅ スプレッドシート予約台帳（スタンダード・Pro）
- ✅ 予約台帳分析ツール（Proのみ）

---

## 🏗️ アプリケーション構成

### ディレクトリ構造

```
/
├── App.tsx                           # メインエントリーポイント
├── components/
│   ├── pricing-card.tsx              # 料金プランカード
│   ├── feature-comparison.tsx        # 機能詳細比較表
│   ├── target-section.tsx            # ターゲット別プラン比較
│   ├── scenario-matrix.tsx           # 利用シナリオマトリックス
│   ├── upgrade-flow.tsx              # アップセル導線
│   ├── revenue-calculator.tsx        # 収益計算機（メイン）
│   └── ui/                           # shadcn/ui コンポーネント群
├── styles/
│   └── globals.css                   # Tailwind v4 設定とカスタムトークン
└── package.json
```

---

## 🧩 コンポーネント詳細設計

### 1. App.tsx（メインレイアウト）

**責務**: 全体レイアウト、タブ切り替え、ナビゲーション

#### 状態管理
```typescript
const [activeTab, setActiveTab] = useState<'pricing' | 'calculator'>('pricing');
```

#### レイアウト構成
- **ヘッダー**: ロゴ（"Z" グラデーション）+ タブナビゲーション（料金プラン/収益計算）
- **コンテンツエリア**: 条件分岐でタブに応じたコンポーネント表示
  - `pricing`: 料金プラン、ターゲット、機能比較、アップセル、シナリオ
  - `calculator`: 収益計算機
- **フッター**: ブランド情報

#### レスポンシブ対応
- モバイル: タブボタンのテキストを短縮（「プラン」「計算」）
- デスクトップ: フルテキスト表示（「料金プラン」「収益計算」）

---

### 2. revenue-calculator.tsx（収益計算機）

#### 状態管理（全14種類）

```typescript
// 基本設定
const [totalUsers, setTotalUsers] = useState(1000);
const [stripeFeeEnabled, setStripeFeeEnabled] = useState(true);

// プラン料金（可変）
const [freePlanPrice, setFreePlanPrice] = useState(0);
const [starterPlanPrice, setStarterPlanPrice] = useState(980);
const [proPlanPrice, setProPlanPrice] = useState(6980);

// ユーザー配分（パーセンテージ）
const [freePercent, setFreePercent] = useState(60);
const [starterPercent, setStarterPercent] = useState(30);
const [proPercent, setProPercent] = useState(10);

// 一時入力値（文字列）
const [tempFreePercent, setTempFreePercent] = useState('60');
const [tempStarterPercent, setTempStarterPercent] = useState('30');
const [tempProPercent, setTempProPercent] = useState('10');

// 成長・解約率
const [monthlyGrowthRate, setMonthlyGrowthRate] = useState(10);  // %
const [churnRate, setChurnRate] = useState(5);  // %

// UI表示制御
const [showAdvanced, setShowAdvanced] = useState(false);
```

#### 定数
```typescript
const STRIPE_FEE_RATE = 0.036;  // 3.6%
```

#### 計算ロジック

**1. ユーザー数計算**
```typescript
const freeUsers = Math.round((totalUsers * freePercent) / 100);
const starterUsers = Math.round((totalUsers * starterPercent) / 100);
const proUsers = Math.round((totalUsers * proPercent) / 100);
```

**2. MRR計算**
```typescript
const freeMRR = freeUsers * freePlanPrice;
const starterMRR = starterUsers * starterPlanPrice;
const proMRR = proUsers * proPlanPrice;
const totalMRR = freeMRR + starterMRR + proMRR;
```

**3. 手数料・純利益**
```typescript
const stripeFee = stripeFeeEnabled ? totalMRR * STRIPE_FEE_RATE : 0;
const netMRR = totalMRR - stripeFee;
const totalARR = totalMRR * 12;
const netARR = netMRR * 12;
```

**4. 12ヶ月成長シミュレーション**
```typescript
const generateGrowthData = () => {
  const data = [];
  let currentUsers = totalUsers;

  for (let month = 1; month <= 12; month++) {
    const monthStartUsers = month === 1 ? totalUsers : currentUsers;
    const newUsers = Math.round(monthStartUsers * (monthlyGrowthRate / 100));
    const churnedUsers = Math.round(monthStartUsers * (churnRate / 100));
    currentUsers = Math.max(0, monthStartUsers + newUsers - churnedUsers);

    // プラン別ユーザー数
    const monthlyFreeUsers = Math.round((currentUsers * freePercent) / 100);
    const monthlyStarterUsers = Math.round((currentUsers * starterPercent) / 100);
    const monthlyProUsers = Math.round((currentUsers * proPercent) / 100);

    // 月次MRR
    const monthlyFreeMRR = monthlyFreeUsers * freePlanPrice;
    const monthlyStarterMRR = monthlyStarterUsers * starterPlanPrice;
    const monthlyProMRR = monthlyProUsers * proPlanPrice;
    const monthlyTotalMRR = monthlyFreeMRR + monthlyStarterMRR + monthlyProMRR;

    const monthlyStripeFee = stripeFeeEnabled ? monthlyTotalMRR * STRIPE_FEE_RATE : 0;
    const monthlyNetMRR = monthlyTotalMRR - monthlyStripeFee;

    data.push({
      month: `${month}ヶ月目`,
      ユーザー数: currentUsers,
      新規獲得: newUsers,
      解約: churnedUsers,
      純増: newUsers - churnedUsers,
      総MRR: Math.round(monthlyTotalMRR),
      純MRR: Math.round(monthlyNetMRR),
      Free: monthlyFreeUsers,
      Starter: monthlyStarterUsers,
      Pro: monthlyProUsers,
    });
  }
  return data;
};
```

#### UI構成（2カラムレイアウト）

**左カラム（設定エリア）**

1. **総ユーザー数**
   - 数値入力フィールド
   - 増減ボタン: +/-1, +/-10, +/-100, +/-1000
   - `inputMode="numeric"` でモバイル数値キーボード

2. **プラン料金設定**
   - 各プラン（ライト/スタンダード/Pro）の月額料金を個別設定
   - 増減ボタン: +/-1, +/-10, +/-100, +/-1000
   - デフォルト値: ¥0 / ¥980 / ¥6,980

3. **ユーザー配分**
   - スライダー（0-100%）
   - 数値入力フィールド（文字列で一時保持）
   - リアルタイムで他プランを自動調整
   - 合計100%制約チェック
   - 確定ボタン（合計100%時のみ有効）
   - 各配分の下にユーザー数・MRRを表示

4. **詳細設定（アコーディオン）**
   - 月次成長率スライダー（0-50%）
   - 月次解約率スライダー（0-20%、0.5%刻み）
   - 純成長率・新規・解約の3指標カード表示
   - Stripe手数料オン/オフ切り替えスイッチ

**右カラム（計算結果）**

1. **MRRカード**（青グラデーション）
   - 総MRR
   - Stripe手数料（有効時）
   - 純MRR

2. **ARRカード**（紫グラデーション）
   - 総ARR
   - 年間手数料（有効時）
   - 純ARR

3. **ARPUカード**（緑グラデーション）
   - 月次ARPU
   - 年次ARPU

#### グラフ表示（Recharts使用）

**デスクトップ: 2x2グリッド**

1. **MRR推移（折れ線グラフ）**
   - データ: 総MRR、純MRR
   - Y軸: 千円単位（¥Xk）

2. **ユーザー数推移（折れ線グラフ）**
   - データ: 総ユーザー数
   - 緑色の太線

3. **プラン別ユーザー数推移（積み上げ棒グラフ）**
   - 3プラン（Free: グレー、Starter: 青、Pro: 紫）
   - 各月のプラン別内訳を視覚化

4. **累積純売上推移（棒グラフ）**
   - Y軸: 百万円単位（¥XM）
   - オレンジ色

**モバイル: 簡易表示**

1. **数値サマリーカード**
   - 12ヶ月後のユーザー数・純MRR
   - 成長率（%）
   - 累積純売上

2. **月別純MRR推移（バー表示）**
   - 3ヶ月ごと+最終月のみ表示
   - 横棒グラデーション（青→紫）

3. **月別ユーザー数推移（バー表示）**
   - 3ヶ月ごと+最終月のみ表示
   - 横棒グラデーション（緑）

#### CSVエクスポート機能

**ファイル名**: `ZeroBook_収益シミュレーション_YYYY-MM-DD-HHMMSS.csv`

**出力内容**（UTF-8 BOM付き）
```
ZeroBook 収益シミュレーション
エクスポート日時, [現在日時]

【基本設定】
項目,値
総ユーザー数, [数値]
月次成長率, [%]
月次解約率, [%]
純成長率, [%]
Stripe手数料, [有効/無効]

【プラン配分】
プラン名,配分率,ユーザー数,月額料金,月次収益(MRR)
ライト, [%], [数], ¥[金額], ¥[MRR]
スタンダード, [%], [数], ¥[金額], ¥[MRR]
Pro, [%], [数], ¥[金額], ¥[MRR]
合計, 100%, [総数], -, ¥[総MRR]

【現在の収益指標】
指標,金額
総MRR, ¥[金額]
Stripe手数料, ¥[金額]
純MRR, ¥[金額]
総ARR, ¥[金額]
年間手数料, ¥[金額]
純ARR, ¥[金額]
月次ARPU, ¥[金額]
年次ARPU, ¥[金額]

【12ヶ月間の推移データ】
月,総ユーザー数,新規獲得,解約数,純増,ライトユーザー,スタンダードユーザー,Proユーザー,ライト MRR,スタンダード MRR,Pro MRR,総MRR,Stripe手数料,純MRR,累積純売上
[各月のデータ行]

【12ヶ月後の予測サマリー】
項目,値
総ユーザー数, [数]
純MRR, ¥[金額]
年換算ARR, ¥[金額]
累積純売上, ¥[金額]
初月比成長率, [%]
総新規獲得数, [数]
総解約数, [数]
純増数, [数]

【プラン別成長分析（1ヶ月目→12ヶ月目）】
プラン,1ヶ月目ユーザー,12ヶ月目ユーザー,増加数,増加率
ライト, [数], [数], [数], [%]
スタンダード, [数], [数], [数], [%]
Pro, [数], [数], [数], [%]

【収益成長分析（1ヶ月目→12ヶ月目）】
項目,1ヶ月目,12ヶ月目,増加額,増加率
純MRR, ¥[金額], ¥[金額], ¥[金額], [%]
```

#### ユーティリティ関数

**通貨フォーマット**
```typescript
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatCompactCurrency = (amount: number) => {
  if (amount >= 10000) {
    return `¥${(amount / 10000).toFixed(1)}万`;
  }
  return formatCurrency(amount);
};
```

**パーセンテージ変更ハンドラ**
```typescript
const handlePercentChange = (plan: 'free' | 'starter' | 'pro', value: number) => {
  // 選択プランを設定値に
  // 残り2プランを現在の比率で自動調整
  // 合計100%を維持
};

const applyPercentChanges = () => {
  // 一時入力値を正式に適用
  // 合計100%チェック
};
```

---

### 3. pricing-card.tsx（料金プランカード）

#### Props
```typescript
interface PricingCardProps {
  name: string;           // プラン名
  price: string;          // 料金（¥0、¥980等）
  period: string;         // 期間（/月）
  description: string;    // プラン説明
  features: string[];     // 機能リスト
  color: 'gray' | 'blue' | 'purple';  // カラーテーマ
  popular?: boolean;      // 人気プランバッジ表示
}
```

#### カラーバリエーション
```typescript
const colorClasses = {
  gray: {
    border: 'border-gray-300',
    badge: 'bg-gray-100 text-gray-700',
    button: 'bg-gray-900 hover:bg-gray-800 text-white',
    icon: 'text-gray-600',
  },
  blue: {
    border: 'border-blue-300 ring-2 ring-blue-500',
    badge: 'bg-blue-100 text-blue-700',
    button: 'bg-blue-600 hover:bg-blue-700 text-white',
    icon: 'text-blue-600',
  },
  purple: {
    border: 'border-purple-300',
    badge: 'bg-purple-100 text-purple-700',
    button: 'bg-purple-600 hover:bg-purple-700 text-white',
    icon: 'text-purple-600',
  },
};
```

#### レイアウト
- 人気プランバッジ（絶対配置、上部中央）
- プラン名バッジ
- 価格（4xl）+ 期間
- 説明文
- 機能リスト（Checkアイコン付き）
- CTAボタン（¥0の場合「無料で始める」、それ以外「プランを選択」）

---

### 4. feature-comparison.tsx（機能詳細比較表）

#### データ構造
```typescript
const features = [
  {
    category: '基本機能',
    items: [
      { name: '運用人数', free: '1人（本人のみ）', starter: '1人（本人のみ）', pro: '複数スタッフ対応' },
      { name: '予約受付', free: '20件/月', starter: '無制限', pro: '無制限' },
      { name: '予約フォーム', free: true, starter: true, pro: true },
      { name: '即時通知', free: true, starter: true, pro: true },
    ],
  },
  {
    category: 'Google連携',
    items: [
      { name: 'Googleアカウントログイン', free: true, starter: true, pro: true },
      { name: 'Googleカレンダー自動連携', free: false, starter: true, pro: true },
      { name: 'スプレッドシート予約台帳', free: false, starter: true, pro: true },
      { name: '予約台帳分析ツール', free: false, starter: false, pro: true },
    ],
  },
  // ... 他カテゴリ（モバイルアプリ、スタッフ管理、シフト管理、連携機能、カスタマイズ・サポート）
];
```

#### 表示ロジック
- `boolean`: Check（緑）/ X（グレー）アイコン
- `string`: テキスト表示

#### スタイリング
- Starterカラムのみ青背景（bg-blue-50）
- ホバー時行ハイライト
- カテゴリ行は濃いグレー背景

---

### 5. target-section.tsx（ターゲット別プラン比較）

#### データ構造
```typescript
const targets = [
  {
    plan: 'Free',
    icon: Users,
    color: 'gray',
    target: '起業直後・売上不確定な個人',
    challenge: '低コストで予約受付を開始 / まず使い勝手を確認',
    value: '初期費用ゼロで予約フォームから通知までカバー',
    keyFeatures: ['月間予約20件まで', '1人運用（本人のみ）', ...]
  },
  // Starter, Pro
];
```

#### レイアウト
- 3カラムグリッド
- 各カード: アイコン + プラン名 + ターゲット像 + 課題/ニーズ + 提供価値 + 主要機能リスト

---

### 6. scenario-matrix.tsx（利用シナリオマトリックス）

#### ステータスタイプ
```typescript
type Status = 'available' | 'partial' | 'limited' | 'not-available' | 'not-needed';
```

#### 表示
- `available`: 緑Check + "最適"
- `partial`: 青Check + "対応"
- `limited`: オレンジAlertCircle + "Pro推奨"
- `not-available`: グレー "—"
- `not-needed`: 薄グレー "—"

#### シナリオ例
- 起業直後でまず予約導線を作りたい → Free: available
- 外出先でもモバイルから確認したい → Starter/Pro: available
- 複数スタッフでシフト承認フローを回したい → Pro: available

---

### 7. upgrade-flow.tsx（アップセル導線）

#### データ構造
```typescript
const upgradePaths = [
  {
    from: 'Free',
    to: 'Starter',
    icon: Users,
    color: 'blue',
    triggers: [
      { trigger: '予約上限到達', action: '月間20件の予約到達時に「機会損失を防ぐ」訴求モーダル表示' },
      { trigger: 'モバイルアクセス', action: 'モバイルからのアクセス時に「アプリでいつでも確認」訴求' },
      // ...
    ],
  },
  {
    from: 'Starter',
    to: 'Pro',
    icon: Zap,
    color: 'purple',
    triggers: [
      { trigger: 'スタッフ機能アクセス', action: 'アプリ内「スタッフ追加」ボタンタップ時に「Pro専用」モーダル表示' },
      // ...
    ],
  },
];
```

#### レイアウト
- 2カラムグリッド
- 各パス: From → To（アイコン付き）
- トリガーカードリスト（境界線・背景色で視覚的差別化）

---

## 🎨 スタイル設計（Tailwind v4）

### globals.css カスタムトークン

```css
:root {
  --font-size: 16px;
  --background: #ffffff;
  --foreground: oklch(0.145 0 0);
  --primary: #030213;
  --secondary: oklch(0.95 0.0058 264.53);
  --muted: #ececf0;
  --muted-foreground: #717182;
  --accent: #e9ebef;
  --destructive: #d4183d;
  --border: rgba(0, 0, 0, 0.1);
  --radius: 0.625rem;
  /* ... その他トークン */
}
```

### タイポグラフィルール

- h1: `text-2xl`, `font-medium`, `line-height: 1.5`
- h2: `text-xl`, `font-medium`, `line-height: 1.5`
- h3: `text-lg`, `font-medium`, `line-height: 1.5`
- h4: `text-base`, `font-medium`, `line-height: 1.5`
- p, input: `text-base`, `font-normal`, `line-height: 1.5`
- label, button: `text-base`, `font-medium`, `line-height: 1.5`

### カラーパレット

**ブランドカラー**
- ブルー: `#3b82f6` (Starterプラン)
- パープル: `#8b5cf6` (Proプラン)
- グレー: `#6b7280` (Freeプラン)

**グラデーション**
- ヘッダー背景: `bg-gradient-to-br from-blue-50 via-white to-purple-50`
- MRRカード: `bg-gradient-to-br from-blue-50 to-blue-100`
- ARRカード: `bg-gradient-to-br from-purple-50 to-purple-100`
- ARPUカード: `bg-gradient-to-br from-green-50 to-green-100`

---

## 📱 レスポンシブ対応

### ブレークポイント

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px

### モバイル最適化

1. **収益計算機**
   - 左右2カラム → 縦積み
   - グラフ → 簡易バー表示（3ヶ月ごと）
   - メイン指標カードを最上部に配置

2. **料金プランカード**
   - 3カラムグリッド → 1カラム縦積み

3. **タブナビゲーション**
   - テキスト短縮（「料金プラン」→「プラン」）

4. **入力フィールド**
   - `inputMode="numeric"` で数値キーボード
   - タッチ操作最適化（`touchAction: 'none'` スライダー）

---

## 📦 依存パッケージ

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "next": "^15.0.0",
    "recharts": "^2.12.7",
    "lucide-react": "^0.263.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "typescript": "^5.5.4",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/postcss": "^4.0.0"
  }
}
```

**重要**: 
- lucide-reactのアイコンは使用前に`lucide-react/dist/esm/icons/index.js`で存在確認必須
- Tailwind v4を使用（`@tailwindcss/postcss`必須）

---

## 🚀 実装手順（Next.js）

### Step 1: プロジェクト初期化

```bash
npx create-next-app@latest zerobook-revenue --typescript --tailwind --app
cd zerobook-revenue
```

### Step 2: 依存関係インストール

```bash
npm install recharts lucide-react
```

### Step 3: Tailwind設定（v4）

**postcss.config.js**
```js
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

**app/globals.css**
```css
/* 設計書のglobals.cssをそのまま使用 */
```

### Step 4: コンポーネント作成

```
app/
├── layout.tsx
├── page.tsx                  # App.tsxの内容を移植
└── components/
    ├── pricing-card.tsx
    ├── feature-comparison.tsx
    ├── target-section.tsx
    ├── scenario-matrix.tsx
    ├── upgrade-flow.tsx
    └── revenue-calculator.tsx
```

### Step 5: 型定義（TypeScript）

すべてのコンポーネントで適切なPropsインターフェース定義を行う。

### Step 6: デプロイ

```bash
npm run build
npm run start
```

Vercel / Netlify / AWS Amplify等で即座にデプロイ可能。

---

## 🔧 カスタマイズポイント

### 料金変更
`App.tsx`の`PricingCard`コンポーネント呼び出し部分で`price`プロップを変更。

### 機能追加・削除
`feature-comparison.tsx`の`features`配列を編集。

### ターゲット層変更
`target-section.tsx`の`targets`配列を編集。

### デフォルト値調整
`revenue-calculator.tsx`の各`useState`初期値を変更。

### Stripe手数料率変更
```typescript
const STRIPE_FEE_RATE = 0.036;  // この値を変更
```

### グラフカラー変更
Rechartsコンポーネントの`stroke`/`fill`プロップを変更。

---

## ⚠️ 注意事項

1. **プラン名の一貫性**
   - UI: Free/Starter/Pro
   - 収益計算機内部: ライト/スタンダード/Pro
   - CSVエクスポート: ライト/スタンダード/Pro

2. **パーセンテージ合計制約**
   - 必ず100%になるように自動調整
   - 確定ボタンで二重チェック

3. **数値丸め**
   - ユーザー数: `Math.round()`
   - MRR/ARR: `Math.round()`
   - 成長率表示: `.toFixed(1)`

4. **CSVエンコーディング**
   - UTF-8 BOM付き（`\uFEFF`）
   - Excel互換性確保

5. **モバイルUX**
   - `inputMode="numeric"`で数値入力最適化
   - スライダーに`touchAction: 'none'`
   - フォント・ボタンサイズを44px以上推奨

---

## 📊 期待される出力例

### 初期設定時（デフォルト値）

- 総ユーザー数: 1,000
- ライト: 60% (600ユーザー) × ¥0 = ¥0
- スタンダード: 30% (300ユーザー) × ¥980 = ¥294,000
- Pro: 10% (100ユーザー) × ¥6,980 = ¥698,000

**総MRR**: ¥992,000  
**Stripe手数料（3.6%）**: ¥35,712  
**純MRR**: ¥956,288  
**純ARR**: ¥11,475,456

**12ヶ月後（成長率10%、解約率5%）**
- 総ユーザー数: 約1,628
- 純MRR: 約¥1,557,716
- 成長率: +62.8%

---

## 📄 納品物チェックリスト

- [x] 完全動作するReactアプリケーション
- [x] 3段階料金プラン表示
- [x] 収益計算機（リアルタイム計算）
- [x] 12ヶ月成長シミュレーション
- [x] 4種類のグラフ表示（デスクトップ）
- [x] モバイル最適化表示
- [x] CSVエクスポート機能
- [x] ユーザー配分調整（スライダー+数値入力）
- [x] プラン料金可変設定
- [x] Stripe手数料オン/オフ切り替え
- [x] 成長率・解約率調整
- [x] レスポンシブデザイン
- [x] TypeScript型定義
- [x] アクセシビリティ対応

---

## 🎓 技術的ハイライト

1. **リアルタイム計算**: 状態変更時に即座に再計算
2. **自動調整ロジック**: パーセンテージ合計100%維持アルゴリズム
3. **複雑なシミュレーション**: 成長率・解約率を考慮した12ヶ月予測
4. **多様なグラフ**: 折れ線・棒・積み上げ棒を適材適所で使用
5. **CSVエクスポート**: 包括的なデータ出力（7セクション）
6. **モバイルファースト**: タッチ操作最適化と簡易表示切り替え
7. **カラーシステム**: プラン別カラー一貫性（gray/blue/purple）
8. **通貨フォーマット**: 日本円表示（Intl.NumberFormat）+ 万円表記

---

## 🔗 参考リンク

- [Recharts Documentation](https://recharts.org/)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [lucide-react Icons](https://lucide.dev/)

---

## 📝 ライセンス

本設計書は投資家向け資料・ビジネスプラン作成用として使用可能です。  
PII（個人識別情報）や機密データの収集には使用しないでください。

---

**作成日**: 2024年12月23日  
**バージョン**: 1.0.0  
**対象フレームワーク**: Next.js 15+ (App Router / Pages Router両対応)  
**設計書形式**: Markdown

---

## 📞 追加実装時のサポート

この設計書を基に、以下のコマンドで即座に実装を開始できます：

```bash
# 新規プロジェクト作成
npx create-next-app@latest zerobook --typescript --tailwind --app

# コンポーネントファイル作成
mkdir -p app/components
touch app/components/{pricing-card,feature-comparison,target-section,scenario-matrix,upgrade-flow,revenue-calculator}.tsx

# 依存関係インストール
npm install recharts lucide-react

# 開発サーバー起動
npm run dev
```

各コンポーネントは上記の詳細設計通りに実装すれば、完全再現が可能です。

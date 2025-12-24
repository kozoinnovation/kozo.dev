# ZeroContact

「メールを待つ時代」を終わらせる、爆速Push通知特化型の埋め込みフォームSaaS。
1分の設定でサイトに「スマホ直結の窓口」を開設できます。

## 🌐 URL

https://zerocontact.app

## 📱 対応プラットフォーム

- Web
- iOS
- Android

## 🛠️ 技術スタック

| カテゴリ | 技術 |
|---------|------|
| フロントエンド | Next.js 14 |
| バックエンド | Supabase (PostgreSQL + Edge Functions) |
| iOS | SwiftUI |
| Android | Kotlin / Jetpack Compose |
| 埋め込み | Shadow DOM |
| メール送信 | Resend |

## ✨ 特徴

- **0秒Push通知** - お問い合わせが来た瞬間にスマホに通知
- **1行埋め込み（Shadow DOM）** - 親サイトのCSSに影響されない独立したフォーム
- **Row Level Security** - テナント隔離によるセキュアなマルチテナント
- **自動返信メール** - お問い合わせ受付の自動確認メール

## 💰 料金プラン

| プラン | Web (Stripe) | iOS/Android (Store) |
|--------|-------------|---------------------|
| Free | ¥0 | ¥0 |
| Standard | ¥980/月 | ¥1,280/月 |
| Pro | ¥1,480/月 | ¥1,930/月 |

### プラン別機能

| 機能 | Free | Standard | Pro |
|------|------|----------|-----|
| フォーム数 | 1個 | 3個 | 無制限 |
| お問い合わせ/月 | 30件 | 300件 | 無制限 |
| Push通知 | ❌ | ✅ | ✅ |
| メール通知 | ❌ | ✅ | ✅ |
| 返信機能 | ❌ | ✅ | ✅ |
| ロゴ非表示 | ❌ | ❌ | ✅ |

## 🏗️ アーキテクチャ

```
┌─────────────────────────────────────────────────────────────┐
│  Layer 0: Core Infrastructure（完全汎用・コピーして使う）      │
│  • SupabaseClient初期化                                      │
│  • Auth Middleware                                           │
│  • Realtime購読パターン                                       │
│  • Push通知Edge Function                                      │
│  • embed.js Shadow DOM構造                                   │
├─────────────────────────────────────────────────────────────┤
│  Layer 1: Config-Driven（設定ファイルで切り替え）             │
│  • テーブル名定義                                             │
│  • 購読対象テーブル                                           │
│  • 通知タイプとテンプレート                                    │
├─────────────────────────────────────────────────────────────┤
│  Layer 2: Domain Specific（プロダクト固有・新規実装）         │
│  • DBスキーマ                                                 │
│  • モデルクラス                                               │
│  • UI画面                                                     │
│  • ビジネスロジック                                           │
└─────────────────────────────────────────────────────────────┘
```

## 🔔 通知フロー

1. ユーザーがフォーム送信
2. Supabase Database Webhook発火
3. Edge Function `send-inquiry-notification` 実行
4. APNs (iOS) / FCM (Android) でPush通知送信
5. 同時に `send-confirmation-email` で自動返信メール

---

*Built by kozo.dev*


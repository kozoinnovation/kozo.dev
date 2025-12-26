# SaaSはサイトではなく、スクリプトである

> AESF構想の本質、そして「埋め込み型SaaS」という未来

---

## 従来のSaaSモデル

ほとんどのSaaSはこう動く：

1. ユーザーが**SaaSのサイト**にアクセス
2. ログインして操作
3. 自分のサイトに戻る

つまり、**ユーザーはSaaSに「行く」必要がある**。

---

## 埋め込み型SaaSモデル

ZeroBookはこう動く：

1. ユーザーが**自分のサイトに1行のスクリプトを貼る**
2. **そのサイト上で**予約機能が動く
3. どこにも「行く」必要がない

```html
<script src="https://zerobook.jp/embed.js" data-form="xxx"></script>
```

これだけで、予約フォームが出現する。

---

## なぜ「行かなくていい」が重要か

### 1. コンバージョン率

ユーザーが別サイトに遷移するたびに、**離脱が発生する**。

埋め込みなら、遷移ゼロ。予約完了までの導線が最短になる。

### 2. ブランド体験

お客様は「ZeroBook」を意識しない。あなたのサイトの一部として予約する。

### 3. 設置の手軽さ

WordPressだろうが、Wixだろうが、HTMLが書けるなら1行で設置完了。

---

## 技術的にどう実現しているか

### Shadow DOM による隔離

iframeではなく、Shadow DOMを使う。

- **iframeの問題**: 高さ調整が困難、レスポンシブ対応が面倒
- **Shadow DOMの利点**: ホストサイトのCSSと干渉しない、高さは自動調整

```javascript
const host = document.querySelector('[data-zerobook]');
const shadow = host.attachShadow({ mode: 'open' });
shadow.innerHTML = `<style>/* 隔離されたスタイル */</style><div>...</div>`;
```

### Referrer追跡

どのページから予約が来たかを自動記録する。

```javascript
const referrer = document.referrer;
// → "https://example.com/blog/hair-color-article"
```

これにより、「どの記事が予約に貢献しているか」が可視化される。

---

## AESF構想

**AI-Driven Embeddable SaaS Framework**

この考え方を抽象化したのがAESF。

> **「SaaSとは、サイト（場所）ではなく、スクリプト（機能の欠片）である」**

予約だけでなく、決済、フォーム、チャット、分析——あらゆる機能を「埋め込み可能なスクリプト」として提供する。

これがSaaSの次のフェーズだと考えている。

---

## まとめ

- SaaSはユーザーが「行く場所」から、「呼び出す機能」へ進化する
- 埋め込みによって、コンバージョン率・ブランド体験・設置容易性が向上
- Shadow DOM + Referrer追跡が技術的な鍵

> **「あらゆるWebサイトに機能を染み込ませる」** ——これが目指す世界。

---

*2025-12-23*

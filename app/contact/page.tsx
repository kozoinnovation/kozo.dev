'use client'

import Script from 'next/script'

export default function ContactPage() {
    return (
        <main className="max-w-3xl mx-auto px-6 py-16">
            <h1 className="text-3xl font-bold mb-8">Contact</h1>
            <p className="text-muted mb-8">
                お問い合わせは以下のフォームからお気軽にどうぞ。
            </p>
            <div 
                data-zerocontact-form="865a5514-36c7-4b19-bbd6-81a2522ba840"
                className="min-h-[400px]"
            />
            <Script 
                src="https://zerocontact-web.vercel.app/embed.js" 
                strategy="lazyOnload"
            />

            {/* ZeroContact宣伝 */}
            <div className="mt-16 pt-8 border-t border-border">
                <div className="bg-accent/30 rounded-lg p-6">
                    <p className="text-sm text-muted mb-3">
                        💡 このフォーム、いい感じじゃないですか？
                    </p>
                    <h3 className="text-lg font-semibold mb-2">
                        ZeroContact - 最速でお問い合わせフォームを設置
                    </h3>
                    <p className="text-sm text-muted mb-4">
                        コードを1行貼るだけで、美しいお問い合わせフォームをあなたのサイトに。
                        スパム対策も通知もぜんぶ込み。もちろん無料から使えます。
                    </p>
                    <a 
                        href="https://zerocontact-web.vercel.app" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
                    >
                        ZeroContactを試してみる →
                    </a>
                </div>
            </div>
        </main>
    )
}


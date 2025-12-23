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
        </main>
    )
}


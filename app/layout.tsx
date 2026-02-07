import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'NORTIQ AI - AIウェブサイトビルダー',
  description: '日本のビジネス向けAI搭載ウェブサイトビルダー。3分でプロ品質のサイトを作成。',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}

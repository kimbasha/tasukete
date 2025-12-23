import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'タスケテ 〜HELP ME!!〜',
  description: '当日券特化型予約サービス',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">{children}</body>
    </html>
  )
}

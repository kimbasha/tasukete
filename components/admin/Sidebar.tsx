'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navItems = [
  {
    title: 'ダッシュボード',
    href: '/admin',
  },
  {
    title: '劇団管理',
    href: '/admin/theaters',
  },
  {
    title: '公演管理',
    href: '/admin/performances',
  },
  {
    title: 'ユーザー管理',
    href: '/admin/users',
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 border-r bg-muted/40">
      <div className="flex h-full flex-col">
        <div className="p-6">
          <h2 className="text-lg font-semibold">タスケテ 管理画面</h2>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'block rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                {item.title}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

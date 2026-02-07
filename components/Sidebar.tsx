'use client'

import { useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Globe,
  BarChart3,
  FileText,
  Settings,
  User,
  LogOut
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface NavItem {
  icon: React.ReactNode
  label: string
  active?: boolean
}

interface SidebarProps {
  userEmail: string | null
  userName?: string | null
}

const navItems: NavItem[] = [
  { icon: <LayoutDashboard size={20} />, label: 'ダッシュボード', active: true },
  { icon: <Globe size={20} />, label: 'サイト一覧' },
  { icon: <BarChart3 size={20} />, label: 'アナリティクス' },
  { icon: <FileText size={20} />, label: '請求書' },
  { icon: <Settings size={20} />, label: '設定' },
]

export default function Sidebar({ userEmail, userName }: SidebarProps) {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.refresh()
    router.push('/')
  }

  const displayName = userName || userEmail?.split('@')[0] || 'User'
  const displayEmail = userEmail || 'No email'

  return (
    <aside className="w-[260px] min-w-[260px] h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Logo Section */}
      <div className="px-6 py-6">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">NORTIQ</h1>
        <p className="text-sm text-gray-500 mt-0.5">AI Website Builder</p>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 mt-2">
        <ul className="space-y-1">
          {navItems.map((item, index) => (
            <li key={index}>
              <button
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  item.active
                    ? 'bg-slate-800 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile Card */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <User size={20} className="text-gray-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-slate-800 text-sm truncate">{displayName}</p>
            <p className="text-xs text-gray-500 truncate">{displayEmail}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <LogOut size={16} />
          <span>ログアウト</span>
        </button>
      </div>
    </aside>
  )
}

'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LogOut } from 'lucide-react'

interface LogoutButtonProps {
  variant?: 'default' | 'minimal'
  className?: string
}

export default function LogoutButton({ variant = 'default', className = '' }: LogoutButtonProps) {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.refresh()
  }

  if (variant === 'minimal') {
    return (
      <button
        onClick={handleLogout}
        className={`text-gray-600 hover:text-slate-800 font-medium transition-colors ${className}`}
      >
        ログアウト
      </button>
    )
  }

  return (
    <button
      onClick={handleLogout}
      className={`flex items-center gap-2 text-gray-600 hover:text-slate-800 font-medium transition-colors ${className}`}
    >
      <LogOut size={18} />
      <span>ログアウト</span>
    </button>
  )
}

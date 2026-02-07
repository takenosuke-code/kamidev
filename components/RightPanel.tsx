'use client'

import { TrendingUp, Download, HelpCircle, Sparkles } from 'lucide-react'
import type { Project } from '@/lib/types/database'

interface RightPanelProps {
  projects?: Project[]
}

const pageData = [
  { page: '/home', views: 1234, bounce: '32.4%', time: '2:45' },
  { page: '/about', views: 856, bounce: '28.1%', time: '3:12' },
  { page: '/contact', views: 492, bounce: '45.8%', time: '1:23' },
]

const systemServices = [
  { name: 'AI Builder Engine', status: '正常' },
  { name: 'CDN Network', status: '正常' },
  { name: 'Database', status: '正常' },
  { name: 'API Gateway', status: '正常' },
]

export default function RightPanel({ projects = [] }: RightPanelProps) {
  const hasProjects = projects.length > 0
  const publishedCount = projects.filter(p => p.status === 'published').length
  const draftCount = projects.filter(p => p.status === 'draft' || p.status === 'building').length
  const aiEnabledCount = projects.filter(p => p.ai_enabled).length

  return (
    <aside className="w-[340px] min-w-[340px] h-full bg-white overflow-y-auto custom-scrollbar">
      <div className="p-4 space-y-4">
        {hasProjects ? (
          /* Live Analytics Widget */
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800">ライブ分析</h3>
              <div className="flex items-center gap-1 text-emerald-500 text-sm font-medium">
                <TrendingUp size={16} />
                <span>+12.5%</span>
              </div>
            </div>

            <div className="mb-2">
              <p className="text-4xl font-bold text-slate-800">3,847</p>
              <p className="text-sm text-gray-500">本日の訪問者数</p>
            </div>

            <div className="h-20 mb-4 relative">
              <svg viewBox="0 0 300 80" className="w-full h-full">
                <line x1="0" y1="20" x2="300" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="40" x2="300" y2="40" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="60" x2="300" y2="60" stroke="#f1f5f9" strokeWidth="1" />
                <path
                  d="M 0 50 Q 30 55 60 48 T 120 52 T 180 45 T 240 30 T 300 20"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                />
              </svg>
            </div>

            <div className="mt-8">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 text-left">
                    <th className="pb-2 font-medium">ページ</th>
                    <th className="pb-2 font-medium text-right">閲覧数</th>
                    <th className="pb-2 font-medium text-right">直帰率</th>
                    <th className="pb-2 font-medium text-right">滞在</th>
                  </tr>
                </thead>
                <tbody>
                  {pageData.map((row, index) => (
                    <tr key={index} className="border-t border-gray-100">
                      <td className="py-2 text-slate-700">{row.page}</td>
                      <td className="py-2 text-slate-700 text-right">{row.views}</td>
                      <td className="py-2 text-slate-700 text-right">{row.bounce}</td>
                      <td className="py-2 text-slate-700 text-right">{row.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Getting Started Widget */
          <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl p-5 text-white">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={20} />
              <h3 className="font-semibold">はじめましょう</h3>
            </div>
            <p className="text-sm text-gray-300 mb-4">
              AIにあなたのビジネスを伝えるだけで、数分でプロ品質のサイトが完成します。
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-xs">1</span>
                <span>ビジネスについて教えてください</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-xs">2</span>
                <span>AIが作成したデザインを確認</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-xs">3</span>
                <span>公開して完了！</span>
              </div>
            </div>
          </div>
        )}

        {/* Projects Summary */}
        {hasProjects && (
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-slate-800 mb-4">プロジェクト概要</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-slate-800">{projects.length}</p>
                <p className="text-xs text-gray-500">総サイト数</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-green-600">{publishedCount}</p>
                <p className="text-xs text-gray-500">公開中</p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-yellow-600">{draftCount}</p>
                <p className="text-xs text-gray-500">下書き</p>
              </div>
              <div className="bg-indigo-50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-indigo-600">
                  {aiEnabledCount}
                </p>
                <p className="text-xs text-gray-500">AI有効</p>
              </div>
            </div>
          </div>
        )}

        {/* Subscription Status Widget */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-slate-800 mb-4">契約状況</h3>

          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-lg font-semibold text-slate-800">おまかせプラン</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                <span className="text-sm text-emerald-600 font-medium">有効</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-slate-800">¥29,800</p>
              <p className="text-sm text-gray-500">/月</p>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">次回請求日</span>
              <span className="text-slate-700 font-medium">2026年2月16日</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">サイト数</span>
              <span className="text-slate-700 font-medium">無制限</span>
            </div>
          </div>

          <button className="w-full flex items-center justify-center gap-2 py-2.5 border border-gray-300 rounded-lg text-slate-700 font-medium hover:bg-gray-50 transition-colors">
            <Download size={18} />
            <span>請求書ダウンロード</span>
          </button>
        </div>

        {/* System Status Widget */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-slate-800 mb-4">システム状況</h3>

          <div className="flex items-center gap-2 mb-4">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></span>
            <span className="font-medium text-slate-800">全システム正常稼働中</span>
          </div>

          <div className="space-y-3">
            {systemServices.map((service, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{service.name}</span>
                <span className="text-emerald-600 font-medium">{service.status}</span>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-400 mt-4">最終更新: 20:25:21</p>
        </div>

        {/* Anshin Guarantee Widget */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-white">
              <span className="text-xs font-bold">安心</span>
            </div>
            <div>
              <p className="font-semibold text-slate-800">安心保証</p>
              <p className="text-sm text-gray-500">24時間サポート・SSL無料・自動バックアップ</p>
            </div>
          </div>
        </div>

        {/* Help Button */}
        <div className="fixed bottom-6 right-6">
          <button className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-600 shadow-lg transition-colors">
            <HelpCircle size={20} />
          </button>
        </div>
      </div>
    </aside>
  )
}

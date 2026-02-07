'use client'

import { Send } from 'lucide-react'
import { useState } from 'react'

const suggestionChips = [
  '企業サイト',
  'レストランメニュー',
  '採用ページ',
  'ECサイト',
  'ポートフォリオ',
]

export default function ChatWindow() {
  const [message, setMessage] = useState('')

  return (
    <div className="flex-1 flex flex-col h-full bg-white border-r border-gray-200">
      {/* Header */}
      <header className="px-8 py-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-slate-800">AI Website Builder</h2>
        <p className="text-gray-500 text-sm mt-0.5">あなたのビジョンを教えてください</p>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        {/* AI Welcome Message */}
        <div className="max-w-2xl">
          <div className="bg-gray-50 rounded-2xl rounded-tl-sm px-5 py-4 border border-gray-100">
            <p className="text-slate-700 leading-relaxed">
              こんにちは！Nortiq AIです。どのようなウェブサイトを作成したいですか？業種や目的を教えていただければ、最適なデザインを提案いたします。
            </p>
            <p className="text-gray-400 text-xs mt-3">20:20</p>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="px-8 pb-6">
        {/* Suggestion Chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          {suggestionChips.map((chip, index) => (
            <button
              key={index}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 hover:border-gray-400 transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="作りたいサイトを説明してください（例：渋谷の美容室）..."
              className="w-full resize-none rounded-2xl border border-gray-300 px-4 py-3 pr-4 text-slate-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent min-h-[80px]"
              rows={3}
            />
          </div>
          <button className="w-14 h-14 bg-slate-800 hover:bg-slate-700 rounded-2xl flex items-center justify-center text-white transition-colors flex-shrink-0">
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}

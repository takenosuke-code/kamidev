'use client'

import { useState } from 'react'
import { Monitor, Smartphone, Tablet, X } from 'lucide-react'
import type { Template } from '@/lib/templates'
import type { SiteConfig } from '@/lib/types/database'

interface SitePreviewProps {
  template: Template
  siteConfig?: Partial<SiteConfig>
  isModal?: boolean
  onClose?: () => void
}

type ViewportSize = 'desktop' | 'tablet' | 'mobile'

const viewportWidths: Record<ViewportSize, string> = {
  desktop: '100%',
  tablet: '768px',
  mobile: '375px',
}

export default function SitePreview({ template, siteConfig, isModal = false, onClose }: SitePreviewProps) {
  const [viewport, setViewport] = useState<ViewportSize>('desktop')

  // Merge template defaults with site config
  const businessName = siteConfig?.business_name || template.demoContent.heroTitle
  const theme = {
    primaryColor: siteConfig?.theme?.primary_color || template.theme.primaryColor,
    secondaryColor: siteConfig?.theme?.secondary_color || template.theme.secondaryColor,
    backgroundColor: template.theme.backgroundColor,
    textColor: template.theme.textColor,
    fontFamily: siteConfig?.theme?.font_family || template.theme.fontFamily,
  }

  const content = (
    <div className="flex flex-col h-full">
      {/* Viewport Controls */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-100 border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">{template.nameJa}</span>
          <span className="text-xs text-gray-500">プレビュー</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-white rounded-lg border border-gray-200 p-1">
            <button
              onClick={() => setViewport('desktop')}
              className={`p-1.5 rounded transition-colors ${
                viewport === 'desktop' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              title="デスクトップ"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewport('tablet')}
              className={`p-1.5 rounded transition-colors ${
                viewport === 'tablet' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              title="タブレット"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewport('mobile')}
              className={`p-1.5 rounded transition-colors ${
                viewport === 'mobile' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              title="モバイル"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
          {isModal && onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          )}
        </div>
      </div>

      {/* Preview Container */}
      <div className="flex-1 overflow-auto bg-gray-200 p-4">
        <div
          className="mx-auto transition-all duration-300 bg-white shadow-xl rounded-lg overflow-hidden"
          style={{
            width: viewportWidths[viewport],
            maxWidth: '100%',
          }}
        >
          {/* Simulated Site Content */}
          <div
            style={{
              backgroundColor: theme.backgroundColor,
              color: theme.textColor,
              fontFamily: theme.fontFamily === 'serif' ? 'Georgia, serif' : 'system-ui, sans-serif',
            }}
          >
            {/* Hero Section */}
            <section
              className="relative py-20 px-6 text-center"
              style={{
                background: template.preview,
              }}
            >
              <div className="max-w-3xl mx-auto">
                <h1
                  className="text-3xl md:text-5xl font-bold mb-4"
                  style={{ color: '#ffffff' }}
                >
                  {businessName}
                </h1>
                <p className="text-lg md:text-xl mb-8 opacity-90" style={{ color: '#ffffff' }}>
                  {template.demoContent.heroSubtitle}
                </p>
                <button
                  className="px-8 py-3 rounded-full font-medium transition-transform hover:scale-105"
                  style={{
                    backgroundColor: theme.primaryColor,
                    color: '#ffffff',
                  }}
                >
                  {template.demoContent.ctaText}
                </button>
              </div>
            </section>

            {/* About Section */}
            <section className="py-16 px-6">
              <div className="max-w-3xl mx-auto text-center">
                <h2
                  className="text-2xl md:text-3xl font-bold mb-6"
                  style={{ color: theme.primaryColor }}
                >
                  {template.demoContent.aboutTitle}
                </h2>
                <p className="text-base md:text-lg leading-relaxed opacity-80">
                  {template.demoContent.aboutText}
                </p>
              </div>
            </section>

            {/* Services/Features Section */}
            <section className="py-16 px-6" style={{ backgroundColor: theme.secondaryColor }}>
              <div className="max-w-4xl mx-auto">
                <h2
                  className="text-2xl md:text-3xl font-bold mb-12 text-center"
                  style={{ color: theme.primaryColor }}
                >
                  サービス
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                      <div
                        className="w-12 h-12 rounded-lg mb-4 flex items-center justify-center text-white text-xl"
                        style={{ backgroundColor: theme.primaryColor }}
                      >
                        {i === 1 ? '✨' : i === 2 ? '🎯' : '💎'}
                      </div>
                      <h3 className="font-semibold mb-2">サービス {i}</h3>
                      <p className="text-sm opacity-70">
                        お客様のニーズに合わせた高品質なサービスをご提供いたします。
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Contact Section */}
            <section className="py-16 px-6">
              <div className="max-w-xl mx-auto text-center">
                <h2
                  className="text-2xl md:text-3xl font-bold mb-6"
                  style={{ color: theme.primaryColor }}
                >
                  お問い合わせ
                </h2>
                <p className="mb-8 opacity-80">
                  ご質問やご相談はお気軽にどうぞ
                </p>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="お名前"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none"
                    readOnly
                  />
                  <input
                    type="email"
                    placeholder="メールアドレス"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none"
                    readOnly
                  />
                  <textarea
                    placeholder="メッセージ"
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none resize-none"
                    readOnly
                  />
                  <button
                    className="w-full py-3 rounded-lg font-medium text-white transition-transform hover:scale-[1.02]"
                    style={{ backgroundColor: theme.primaryColor }}
                  >
                    送信する
                  </button>
                </div>
              </div>
            </section>

            {/* Footer */}
            <footer
              className="py-8 px-6 text-center"
              style={{
                backgroundColor: theme.primaryColor,
                color: '#ffffff',
              }}
            >
              <p className="text-sm opacity-80">
                © 2026 {businessName}. All rights reserved.
              </p>
              <p className="text-xs mt-2 opacity-60">
                Powered by NORTIQ AI
              </p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  )

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl mx-4 h-[85vh] overflow-hidden">
          {content}
        </div>
      </div>
    )
  }

  return content
}

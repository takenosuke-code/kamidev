'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Save,
  Loader2,
  Eye,
  Type,
  Image as ImageIcon,
  Palette,
  Layout,
  Phone,
  Share2,
} from 'lucide-react'
import { getProject, updateProject } from '@/lib/api/projects'
import { getTemplateById, type Template } from '@/lib/templates'
import type { Project, SiteConfig } from '@/lib/types/database'
import SitePreview from '@/components/SitePreview'

interface PageProps {
  params: { id: string }
}

type EditorTab = 'content' | 'style' | 'contact' | 'social'

export default function SiteEditorPage({ params }: PageProps) {
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [template, setTemplate] = useState<Template | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [activeTab, setActiveTab] = useState<EditorTab>('content')
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Editable content state
  const [content, setContent] = useState({
    heroTitle: '',
    heroSubtitle: '',
    ctaText: '',
    aboutTitle: '',
    aboutText: '',
    services: [
      { name: 'サービス 1', description: 'お客様のニーズに合わせた高品質なサービスをご提供いたします。', price: '' },
      { name: 'サービス 2', description: 'お客様のニーズに合わせた高品質なサービスをご提供いたします。', price: '' },
      { name: 'サービス 3', description: 'お客様のニーズに合わせた高品質なサービスをご提供いたします。', price: '' },
    ],
  })

  const [style, setStyle] = useState({
    primaryColor: '#4f46e5',
    secondaryColor: '#f5f5f5',
    fontFamily: 'sans-serif',
  })

  const [contactInfo, setContactInfo] = useState({
    phone: '',
    email: '',
    address: '',
  })

  const [socialLinks, setSocialLinks] = useState({
    instagram: '',
    twitter: '',
    facebook: '',
    line: '',
  })

  useEffect(() => {
    loadProject()
  }, [params.id])

  const loadProject = async () => {
    setLoading(true)
    const { data, error } = await getProject(params.id)

    if (error || !data) {
      setError(error?.message || 'プロジェクトが見つかりません')
      setLoading(false)
      return
    }

    setProject(data)

    // Load template
    if (data.template_id) {
      const tmpl = getTemplateById(data.template_id)
      if (tmpl) {
        setTemplate(tmpl)

        // Initialize content from site_config or template defaults
        const cfg = data.site_config || {}
        setContent({
          heroTitle: cfg.sections?.hero?.title || tmpl.demoContent.heroTitle,
          heroSubtitle: cfg.sections?.hero?.subtitle || tmpl.demoContent.heroSubtitle,
          ctaText: tmpl.demoContent.ctaText,
          aboutTitle: cfg.sections?.about?.title || tmpl.demoContent.aboutTitle,
          aboutText: cfg.sections?.about?.content || tmpl.demoContent.aboutText,
          services: cfg.sections?.services || [
            { name: 'サービス 1', description: 'お客様のニーズに合わせた高品質なサービスをご提供いたします。', price: '' },
            { name: 'サービス 2', description: 'お客様のニーズに合わせた高品質なサービスをご提供いたします。', price: '' },
            { name: 'サービス 3', description: 'お客様のニーズに合わせた高品質なサービスをご提供いたします。', price: '' },
          ],
        })

        setStyle({
          primaryColor: cfg.theme?.primary_color || tmpl.theme.primaryColor,
          secondaryColor: cfg.theme?.secondary_color || tmpl.theme.secondaryColor,
          fontFamily: cfg.theme?.font_family || tmpl.theme.fontFamily,
        })
      }
    }

    // Load contact info
    const cfg = data.site_config || {}
    setContactInfo({
      phone: cfg.phone || '',
      email: cfg.email || '',
      address: cfg.address || '',
    })

    setSocialLinks({
      instagram: cfg.social?.instagram || '',
      twitter: cfg.social?.twitter || '',
      facebook: cfg.social?.facebook || '',
      line: cfg.social?.line || '',
    })

    setLoading(false)
  }

  const handleSave = async () => {
    if (!project) return

    setSaving(true)
    setError(null)
    setSuccessMessage(null)

    const updatedConfig: Partial<SiteConfig> = {
      ...project.site_config,
      phone: contactInfo.phone,
      email: contactInfo.email,
      address: contactInfo.address,
      social: socialLinks,
      theme: {
        primary_color: style.primaryColor,
        secondary_color: style.secondaryColor,
        font_family: style.fontFamily,
      },
      sections: {
        hero: { title: content.heroTitle, subtitle: content.heroSubtitle },
        about: { title: content.aboutTitle, content: content.aboutText },
        services: content.services,
        contact: { enabled: true },
      },
    }

    const { error } = await updateProject(params.id, {
      site_config: updatedConfig,
    })

    setSaving(false)

    if (error) {
      setError(error.message)
      return
    }

    setSuccessMessage('保存しました')
    setTimeout(() => setSuccessMessage(null), 3000)
  }

  const updateService = (index: number, field: string, value: string) => {
    setContent(prev => ({
      ...prev,
      services: prev.services.map((s, i) =>
        i === index ? { ...s, [field]: value } : s
      ),
    }))
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  if (!project || !template) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-white">
        <p className="text-gray-500 mb-4">{error || 'プロジェクトが見つかりません'}</p>
        <button
          onClick={() => router.push('/dashboard')}
          className="text-indigo-600 hover:underline"
        >
          ダッシュボードに戻る
        </button>
      </div>
    )
  }

  // Create a mock template with current edits for preview
  const previewTemplate: Template = {
    ...template,
    theme: {
      ...template.theme,
      primaryColor: style.primaryColor,
      secondaryColor: style.secondaryColor,
      fontFamily: style.fontFamily,
    },
    demoContent: {
      heroTitle: content.heroTitle,
      heroSubtitle: content.heroSubtitle,
      ctaText: content.ctaText,
      aboutTitle: content.aboutTitle,
      aboutText: content.aboutText,
    },
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push(`/dashboard/projects/${params.id}`)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-slate-800">
                サイトを編集
              </h1>
              <p className="text-sm text-gray-500">{project.project_name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPreview(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-slate-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Eye className="w-4 h-4" />
              プレビュー
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium rounded-lg transition-all disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              保存
            </button>
          </div>
        </div>
      </header>

      {/* Messages */}
      {error && (
        <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      {successMessage && (
        <div className="mx-6 mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
          <p className="text-sm text-green-600">{successMessage}</p>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Panel */}
        <div className="w-[400px] bg-white border-r border-gray-200 flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 shrink-0">
            {[
              { id: 'content', label: 'コンテンツ', icon: Type },
              { id: 'style', label: 'スタイル', icon: Palette },
              { id: 'contact', label: '連絡先', icon: Phone },
              { id: 'social', label: 'SNS', icon: Share2 },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as EditorTab)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'content' && (
              <div className="space-y-6">
                {/* Hero Section */}
                <div>
                  <h3 className="font-medium text-slate-800 mb-3 flex items-center gap-2">
                    <Layout className="w-4 h-4" />
                    ヒーローセクション
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">タイトル</label>
                      <input
                        type="text"
                        value={content.heroTitle}
                        onChange={(e) => setContent({ ...content, heroTitle: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">サブタイトル</label>
                      <textarea
                        value={content.heroSubtitle}
                        onChange={(e) => setContent({ ...content, heroSubtitle: e.target.value })}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* About Section */}
                <div>
                  <h3 className="font-medium text-slate-800 mb-3">紹介セクション</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">タイトル</label>
                      <input
                        type="text"
                        value={content.aboutTitle}
                        onChange={(e) => setContent({ ...content, aboutTitle: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">説明文</label>
                      <textarea
                        value={content.aboutText}
                        onChange={(e) => setContent({ ...content, aboutText: e.target.value })}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Services */}
                <div>
                  <h3 className="font-medium text-slate-800 mb-3">サービス</h3>
                  <div className="space-y-4">
                    {content.services.map((service, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg space-y-2">
                        <input
                          type="text"
                          value={service.name}
                          onChange={(e) => updateService(index, 'name', e.target.value)}
                          placeholder="サービス名"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                        />
                        <textarea
                          value={service.description}
                          onChange={(e) => updateService(index, 'description', e.target.value)}
                          placeholder="説明"
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-sm"
                        />
                        <input
                          type="text"
                          value={service.price}
                          onChange={(e) => updateService(index, 'price', e.target.value)}
                          placeholder="価格（オプション）"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'style' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-slate-800 mb-3">カラー設定</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">メインカラー</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={style.primaryColor}
                          onChange={(e) => setStyle({ ...style, primaryColor: e.target.value })}
                          className="w-12 h-12 rounded-lg cursor-pointer border border-gray-300"
                        />
                        <input
                          type="text"
                          value={style.primaryColor}
                          onChange={(e) => setStyle({ ...style, primaryColor: e.target.value })}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">サブカラー</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={style.secondaryColor}
                          onChange={(e) => setStyle({ ...style, secondaryColor: e.target.value })}
                          className="w-12 h-12 rounded-lg cursor-pointer border border-gray-300"
                        />
                        <input
                          type="text"
                          value={style.secondaryColor}
                          onChange={(e) => setStyle({ ...style, secondaryColor: e.target.value })}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-slate-800 mb-3">フォント</h3>
                  <select
                    value={style.fontFamily}
                    onChange={(e) => setStyle({ ...style, fontFamily: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="sans-serif">ゴシック体（Sans-serif）</option>
                    <option value="serif">明朝体（Serif）</option>
                  </select>
                </div>
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">電話番号</label>
                  <input
                    type="tel"
                    value={contactInfo.phone}
                    onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                    placeholder="03-1234-5678"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">メールアドレス</label>
                  <input
                    type="email"
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                    placeholder="contact@example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">住所</label>
                  <textarea
                    value={contactInfo.address}
                    onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
                    placeholder="東京都渋谷区..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                </div>
              </div>
            )}

            {activeTab === 'social' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Instagram</label>
                  <input
                    type="url"
                    value={socialLinks.instagram}
                    onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
                    placeholder="https://instagram.com/..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Twitter / X</label>
                  <input
                    type="url"
                    value={socialLinks.twitter}
                    onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })}
                    placeholder="https://twitter.com/..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Facebook</label>
                  <input
                    type="url"
                    value={socialLinks.facebook}
                    onChange={(e) => setSocialLinks({ ...socialLinks, facebook: e.target.value })}
                    placeholder="https://facebook.com/..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">LINE</label>
                  <input
                    type="url"
                    value={socialLinks.line}
                    onChange={(e) => setSocialLinks({ ...socialLinks, line: e.target.value })}
                    placeholder="https://line.me/..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Live Preview */}
        <div className="flex-1 overflow-hidden">
          <SitePreview
            template={previewTemplate}
            siteConfig={{
              business_name: project.project_name,
              phone: contactInfo.phone,
              email: contactInfo.email,
              address: contactInfo.address,
              social: socialLinks,
            }}
          />
        </div>
      </div>

      {/* Full Preview Modal */}
      {showPreview && (
        <SitePreview
          template={previewTemplate}
          siteConfig={{
            business_name: project.project_name,
            phone: contactInfo.phone,
            email: contactInfo.email,
            address: contactInfo.address,
            social: socialLinks,
          }}
          isModal
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  )
}

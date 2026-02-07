'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Globe,
  Save,
  Loader2,
  Trash2,
  ExternalLink,
  Sparkles,
  Settings,
  Palette,
  Phone,
  Share2
} from 'lucide-react'
import { getProject, updateProject, deleteProject } from '@/lib/api/projects'
import type { Project, UpdateProjectInput, ProjectStatus, SiteConfig } from '@/lib/types/database'

interface PageProps {
  params: { id: string }
}

const statusOptions: { value: ProjectStatus; label: string; color: string }[] = [
  { value: 'draft', label: '下書き', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'building', label: '構築中', color: 'bg-blue-100 text-blue-800' },
  { value: 'published', label: '公開中', color: 'bg-green-100 text-green-800' },
  { value: 'maintenance', label: 'メンテナンス', color: 'bg-orange-100 text-orange-800' },
]

export default function ProjectSettingsPage({ params }: PageProps) {
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'general' | 'contact' | 'social' | 'theme'>('general')

  // Form state
  const [formData, setFormData] = useState<{
    project_name: string
    subdomain: string
    custom_domain: string
    status: ProjectStatus
    ai_enabled: boolean
    site_config: Partial<SiteConfig>
  }>({
    project_name: '',
    subdomain: '',
    custom_domain: '',
    status: 'draft',
    ai_enabled: false,
    site_config: {}
  })

  useEffect(() => {
    loadProject()
  }, [params.id])

  const loadProject = async () => {
    setLoading(true)
    const { data, error } = await getProject(params.id)

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    if (data) {
      setProject(data)
      setFormData({
        project_name: data.project_name,
        subdomain: data.subdomain || '',
        custom_domain: data.custom_domain || '',
        status: data.status,
        ai_enabled: data.ai_enabled,
        site_config: data.site_config || {}
      })
    }
    setLoading(false)
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    setSuccessMessage(null)

    const updateData: UpdateProjectInput = {
      project_name: formData.project_name,
      subdomain: formData.subdomain || undefined,
      custom_domain: formData.custom_domain || undefined,
      status: formData.status,
      ai_enabled: formData.ai_enabled,
      site_config: formData.site_config
    }

    const { data, error } = await updateProject(params.id, updateData)

    setSaving(false)

    if (error) {
      setError(error.message)
      return
    }

    if (data) {
      setProject(data)
      setSuccessMessage('設定を保存しました')
      setTimeout(() => setSuccessMessage(null), 3000)
    }
  }

  const handleDelete = async () => {
    if (!project) return

    if (!confirm(`「${project.project_name}」を削除してもよろしいですか？この操作は取り消せません。`)) {
      return
    }

    setDeleting(true)
    const { error } = await deleteProject(params.id)

    if (error) {
      setError(error.message)
      setDeleting(false)
      return
    }

    router.push('/dashboard')
  }

  const updateSiteConfig = (path: string, value: string) => {
    setFormData(prev => {
      const newConfig = { ...prev.site_config }
      const keys = path.split('.')
      let current: Record<string, unknown> = newConfig as Record<string, unknown>

      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {}
        }
        current = current[keys[i]] as Record<string, unknown>
      }

      current[keys[keys.length - 1]] = value
      return { ...prev, site_config: newConfig }
    })
  }

  const getSiteConfigValue = (path: string): string => {
    const keys = path.split('.')
    let current: Record<string, unknown> = formData.site_config as Record<string, unknown>

    for (const key of keys) {
      if (!current || typeof current !== 'object') return ''
      current = current[key] as Record<string, unknown>
    }

    return (current as unknown as string) || ''
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-white">
        <p className="text-gray-500 mb-4">プロジェクトが見つかりません</p>
        <button
          onClick={() => router.push('/dashboard')}
          className="text-indigo-600 hover:underline"
        >
          ダッシュボードに戻る
        </button>
      </div>
    )
  }

  const siteUrl = project.custom_domain
    ? `https://${project.custom_domain}`
    : project.subdomain
    ? `https://${project.subdomain}.nortiq.site`
    : null

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-slate-800">
                {project.project_name}
              </h1>
              {siteUrl && (
                <a
                  href={siteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-indigo-600 hover:underline flex items-center gap-1"
                >
                  {project.subdomain}.nortiq.site
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-2 border border-red-300 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              {deleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
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
        <div className="mx-8 mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      {successMessage && (
        <div className="mx-8 mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
          <p className="text-sm text-green-600">{successMessage}</p>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto">
          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {[
              { id: 'general', label: '基本設定', icon: Settings },
              { id: 'contact', label: '連絡先', icon: Phone },
              { id: 'social', label: 'SNS', icon: Share2 },
              { id: 'theme', label: 'テーマ', icon: Palette },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              {/* Project Name */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-slate-800 mb-4">プロジェクト情報</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      サイト名
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Globe className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={formData.project_name}
                        onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ステータス
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as ProjectStatus })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Domain Settings */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-slate-800 mb-4">ドメイン設定</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      サブドメイン
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={formData.subdomain}
                        onChange={(e) => setFormData({ ...formData, subdomain: e.target.value })}
                        placeholder="example"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      <span className="text-gray-500">.nortiq.site</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      カスタムドメイン
                      <span className="ml-2 text-xs text-indigo-600">(Proプラン以上)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.custom_domain}
                      onChange={(e) => setFormData({ ...formData, custom_domain: e.target.value })}
                      placeholder="www.example.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* AI Settings */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">Nortiq AI</h3>
                      <p className="text-sm text-gray-500">AIアシスタントを有効にする</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.ai_enabled}
                      onChange={(e) => setFormData({ ...formData, ai_enabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>

              {/* Business Info */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-slate-800 mb-4">ビジネス情報</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ビジネス名
                    </label>
                    <input
                      type="text"
                      value={getSiteConfigValue('business_name')}
                      onChange={(e) => updateSiteConfig('business_name', e.target.value)}
                      placeholder="店舗・会社名"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      説明
                    </label>
                    <textarea
                      value={getSiteConfigValue('description')}
                      onChange={(e) => updateSiteConfig('description', e.target.value)}
                      placeholder="ビジネスの説明を入力"
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Contact Settings */}
          {activeTab === 'contact' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-slate-800 mb-4">連絡先情報</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    電話番号
                  </label>
                  <input
                    type="tel"
                    value={getSiteConfigValue('phone')}
                    onChange={(e) => updateSiteConfig('phone', e.target.value)}
                    placeholder="03-1234-5678"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    メールアドレス
                  </label>
                  <input
                    type="email"
                    value={getSiteConfigValue('email')}
                    onChange={(e) => updateSiteConfig('email', e.target.value)}
                    placeholder="contact@example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    住所
                  </label>
                  <textarea
                    value={getSiteConfigValue('address')}
                    onChange={(e) => updateSiteConfig('address', e.target.value)}
                    placeholder="東京都渋谷区..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Social Settings */}
          {activeTab === 'social' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-slate-800 mb-4">SNSリンク</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instagram
                  </label>
                  <input
                    type="url"
                    value={getSiteConfigValue('social.instagram')}
                    onChange={(e) => updateSiteConfig('social.instagram', e.target.value)}
                    placeholder="https://instagram.com/..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Twitter / X
                  </label>
                  <input
                    type="url"
                    value={getSiteConfigValue('social.twitter')}
                    onChange={(e) => updateSiteConfig('social.twitter', e.target.value)}
                    placeholder="https://twitter.com/..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Facebook
                  </label>
                  <input
                    type="url"
                    value={getSiteConfigValue('social.facebook')}
                    onChange={(e) => updateSiteConfig('social.facebook', e.target.value)}
                    placeholder="https://facebook.com/..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    LINE
                  </label>
                  <input
                    type="url"
                    value={getSiteConfigValue('social.line')}
                    onChange={(e) => updateSiteConfig('social.line', e.target.value)}
                    placeholder="https://line.me/..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Theme Settings */}
          {activeTab === 'theme' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-slate-800 mb-4">テーマ設定</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    メインカラー
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={getSiteConfigValue('theme.primary_color') || '#4f46e5'}
                      onChange={(e) => updateSiteConfig('theme.primary_color', e.target.value)}
                      className="w-12 h-12 rounded-lg cursor-pointer border border-gray-300"
                    />
                    <input
                      type="text"
                      value={getSiteConfigValue('theme.primary_color') || '#4f46e5'}
                      onChange={(e) => updateSiteConfig('theme.primary_color', e.target.value)}
                      placeholder="#4f46e5"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    サブカラー
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={getSiteConfigValue('theme.secondary_color') || '#7c3aed'}
                      onChange={(e) => updateSiteConfig('theme.secondary_color', e.target.value)}
                      className="w-12 h-12 rounded-lg cursor-pointer border border-gray-300"
                    />
                    <input
                      type="text"
                      value={getSiteConfigValue('theme.secondary_color') || '#7c3aed'}
                      onChange={(e) => updateSiteConfig('theme.secondary_color', e.target.value)}
                      placeholder="#7c3aed"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    フォント
                  </label>
                  <select
                    value={getSiteConfigValue('theme.font_family') || 'system'}
                    onChange={(e) => updateSiteConfig('theme.font_family', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="system">システムフォント</option>
                    <option value="noto-sans-jp">Noto Sans JP</option>
                    <option value="zen-kaku-gothic">Zen Kaku Gothic</option>
                    <option value="m-plus-1p">M PLUS 1p</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

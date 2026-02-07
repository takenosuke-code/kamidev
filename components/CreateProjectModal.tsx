'use client'

import { useState } from 'react'
import { X, Sparkles, Globe, Loader2, ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { createProject } from '@/lib/api/projects'
import TemplateSelector from './TemplateSelector'
import type { Template } from '@/lib/templates'

interface CreateProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function CreateProjectModal({ isOpen, onClose, onSuccess }: CreateProjectModalProps) {
  const [step, setStep] = useState(1)
  const [projectName, setProjectName] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const totalSteps = 3

  const handleCreate = async () => {
    if (!projectName.trim()) {
      setError('プロジェクト名を入力してください')
      return
    }

    setLoading(true)
    setError(null)

    const { error: createError } = await createProject({
      project_name: projectName.trim(),
      template_id: selectedTemplate?.id,
      site_config: {
        business_type: selectedTemplate?.category,
        theme: selectedTemplate ? {
          primary_color: selectedTemplate.theme.primaryColor,
          secondary_color: selectedTemplate.theme.secondaryColor,
          font_family: selectedTemplate.theme.fontFamily,
        } : undefined,
      },
    })

    setLoading(false)

    if (createError) {
      setError(createError.message)
      return
    }

    // Reset and close
    setProjectName('')
    setSelectedTemplate(null)
    setStep(1)
    onSuccess()
    onClose()
  }

  const handleClose = () => {
    setProjectName('')
    setSelectedTemplate(null)
    setStep(1)
    setError(null)
    onClose()
  }

  const canProceed = () => {
    if (step === 1) return projectName.trim().length > 0
    if (step === 2) return selectedTemplate !== null
    return true
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-800">新しいサイトを作成</h2>
              <p className="text-sm text-gray-500">ステップ {step} / {totalSteps}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-4 shrink-0">
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  s <= step ? 'bg-indigo-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Step 1: Project Name */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  サイト名
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Globe className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="例: 渋谷ヘアサロン"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && canProceed() && setStep(2)}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  お店やビジネスの名前を入力してください
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Template Selection */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  テンプレートを選択
                </label>
                <TemplateSelector
                  selectedId={selectedTemplate?.id || null}
                  onSelect={setSelectedTemplate}
                />
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800">確認</h3>
                <p className="text-sm text-gray-500">以下の内容でサイトを作成します</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">サイト名</span>
                  <span className="font-medium text-slate-800">{projectName}</span>
                </div>
                <div className="border-t border-gray-200" />
                <div className="flex justify-between items-start">
                  <span className="text-sm text-gray-500">テンプレート</span>
                  <div className="text-right">
                    <span className="font-medium text-slate-800 flex items-center gap-2">
                      <span>{selectedTemplate?.icon}</span>
                      {selectedTemplate?.nameJa}
                    </span>
                    <span className="text-xs text-gray-500">{selectedTemplate?.descriptionJa}</span>
                  </div>
                </div>
                {selectedTemplate && (
                  <>
                    <div className="border-t border-gray-200" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">テーマカラー</span>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-full border border-gray-300"
                          style={{ backgroundColor: selectedTemplate.theme.primaryColor }}
                        />
                        <div
                          className="w-6 h-6 rounded-full border border-gray-300"
                          style={{ backgroundColor: selectedTemplate.theme.secondaryColor }}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 shrink-0">
          <div className="flex gap-3">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-2 px-4 py-3 border border-gray-300 text-slate-700 font-medium rounded-xl hover:bg-gray-50 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                戻る
              </button>
            )}

            {step < totalSteps ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                次へ
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleCreate}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    作成中...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    サイトを作成
                  </>
                )}
              </button>
            )}
          </div>

          {step === 2 && (
            <button
              onClick={() => setStep(3)}
              className="w-full mt-3 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              テンプレートなしで続ける
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Check, Eye } from 'lucide-react'
import { templates, getCategories, type Template } from '@/lib/templates'
import SitePreview from './SitePreview'

interface TemplateSelectorProps {
  selectedId: string | null
  onSelect: (template: Template) => void
}

export default function TemplateSelector({ selectedId, onSelect }: TemplateSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<Template['category'] | 'all'>('all')
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null)
  const categories = getCategories()

  const filteredTemplates = activeCategory === 'all'
    ? templates
    : templates.filter(t => t.category === activeCategory)

  return (
    <>
      <div className="space-y-4">
        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 text-sm font-medium rounded-full whitespace-nowrap transition-colors ${
              activeCategory === 'all'
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            すべて ({templates.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 text-sm font-medium rounded-full whitespace-nowrap transition-colors ${
                activeCategory === cat.id
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.label} ({cat.count})
            </button>
          ))}
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto pr-1">
          {filteredTemplates.map((template) => {
            const isSelected = selectedId === template.id

            return (
              <div
                key={template.id}
                onClick={() => onSelect(template)}
                className={`relative group cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${
                  isSelected
                    ? 'border-indigo-500 ring-2 ring-indigo-200'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {/* Preview Gradient */}
                <div
                  className="aspect-[4/3] w-full"
                  style={{ background: template.preview }}
                >
                  {/* Template Info Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Preview Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setPreviewTemplate(template)
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    title="プレビュー"
                  >
                    <Eye className="w-4 h-4 text-gray-700" />
                  </button>

                  {/* Selected Check */}
                  {isSelected && (
                    <div className="absolute top-2 left-2 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}

                  {/* Template Name */}
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{template.icon}</span>
                      <div>
                        <p className="text-white font-medium text-sm leading-tight">
                          {template.nameJa}
                        </p>
                        <p className="text-white/70 text-xs">
                          {template.descriptionJa}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <SitePreview
          template={previewTemplate}
          isModal
          onClose={() => setPreviewTemplate(null)}
        />
      )}
    </>
  )
}

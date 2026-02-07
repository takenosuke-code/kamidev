'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Globe, ExternalLink, Settings, Trash2, Plus, Loader2, Pencil } from 'lucide-react'
import type { Project, ProjectStatus } from '@/lib/types/database'
import { deleteProject } from '@/lib/api/projects'
import CreateProjectModal from './CreateProjectModal'

interface ProjectsDashboardProps {
  projects: Project[]
}

const statusColors: Record<ProjectStatus, string> = {
  draft: 'bg-yellow-100 text-yellow-800',
  building: 'bg-blue-100 text-blue-800',
  published: 'bg-green-100 text-green-800',
  maintenance: 'bg-orange-100 text-orange-800',
}

const statusLabels: Record<ProjectStatus, string> = {
  draft: '下書き',
  building: '構築中',
  published: '公開中',
  maintenance: 'メンテナンス',
}

export default function ProjectsDashboard({ projects: initialProjects }: ProjectsDashboardProps) {
  const router = useRouter()
  const [projects, setProjects] = useState(initialProjects)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (projectId: string, projectName: string) => {
    if (!confirm(`「${projectName}」を削除してもよろしいですか？この操作は取り消せません。`)) {
      return
    }

    setDeletingId(projectId)
    const { error } = await deleteProject(projectId)
    setDeletingId(null)

    if (error) {
      alert(error.message)
      return
    }

    // Remove from local state
    setProjects(projects.filter(p => p.id !== projectId))
  }

  const handleCreateSuccess = () => {
    // Refresh the page to get updated projects
    router.refresh()
  }

  const getSubdomainUrl = (project: Project) => {
    if (project.custom_domain) {
      return `https://${project.custom_domain}`
    }
    if (project.subdomain) {
      return `https://${project.subdomain}.nortiq.site`
    }
    return null
  }

  return (
    <>
      <div className="flex-1 flex flex-col h-full bg-white border-r border-gray-200">
        {/* Header */}
        <header className="px-8 py-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-800">サイト一覧</h2>
              <p className="text-gray-500 text-sm mt-0.5">
                {projects.length}件のサイトを管理中
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium rounded-xl transition-all"
            >
              <Plus className="w-4 h-4" />
              新規作成
            </button>
          </div>
        </header>

        {/* Projects List */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Globe className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-800 mb-2">サイトがありません</h3>
              <p className="text-gray-500 mb-6">最初のサイトを作成しましょう</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium rounded-xl transition-all"
              >
                <Plus className="w-5 h-5" />
                サイトを作成
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {projects.map((project) => {
                const siteUrl = getSubdomainUrl(project)
                const isDeleting = deletingId === project.id

                return (
                  <div
                    key={project.id}
                    className={`bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all ${
                      isDeleting ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        {/* Project Icon */}
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
                          <Globe className="w-6 h-6 text-indigo-600" />
                        </div>

                        {/* Project Info */}
                        <div>
                          <h3 className="font-semibold text-slate-800">{project.project_name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            {siteUrl ? (
                              <a
                                href={siteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-indigo-600 hover:underline flex items-center gap-1"
                              >
                                {project.subdomain}.nortiq.site
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            ) : (
                              <span className="text-sm text-gray-500">URLなし</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Status & Actions */}
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${statusColors[project.status]}`}>
                          {statusLabels[project.status]}
                        </span>
                        {project.template_id && (
                          <button
                            onClick={() => router.push(`/dashboard/projects/${project.id}/edit`)}
                            className="p-2 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="サイトを編集"
                          >
                            <Pencil className="w-4 h-4 text-indigo-500" />
                          </button>
                        )}
                        <button
                          onClick={() => router.push(`/dashboard/projects/${project.id}`)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="設定"
                        >
                          <Settings className="w-4 h-4 text-gray-500" />
                        </button>
                        <button
                          onClick={() => handleDelete(project.id, project.project_name)}
                          disabled={isDeleting}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="削除"
                        >
                          {isDeleting ? (
                            <Loader2 className="w-4 h-4 text-red-500 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4 text-red-500" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Project Details Row */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-6">
                        <div className="text-sm">
                          <span className="text-gray-500">AI: </span>
                          <span className="font-medium text-slate-700">
                            {project.ai_enabled ? '有効' : '無効'}
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-500">作成日: </span>
                          <span className="font-medium text-slate-700">
                            {new Date(project.created_at).toLocaleDateString('ja-JP', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>
                      {project.template_id && (
                        <button
                          onClick={() => router.push(`/dashboard/projects/${project.id}/edit`)}
                          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          サイトを編集
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Bottom Action */}
        {projects.length > 0 && (
          <div className="px-8 py-4 border-t border-gray-200">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              新しいサイトを作成
            </button>
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </>
  )
}

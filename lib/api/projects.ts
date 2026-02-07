import { createClient } from '@/lib/supabase/client'
import type { Project, CreateProjectInput, UpdateProjectInput } from '@/lib/types/database'

// Generate a URL-safe subdomain from project name
function generateSubdomain(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Remove consecutive hyphens
    .substring(0, 30) // Limit length
    + '-' + Math.random().toString(36).substring(2, 6) // Add random suffix for uniqueness
}

// Create a new project
export async function createProject(input: CreateProjectInput): Promise<{ data: Project | null; error: Error | null }> {
  const supabase = createClient()

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { data: null, error: new Error('認証エラー: ログインしてください') }
  }

  // Generate subdomain if not provided
  const subdomain = input.subdomain || generateSubdomain(input.project_name)

  const { data, error } = await supabase
    .from('projects')
    .insert({
      user_id: user.id,
      project_name: input.project_name,
      subdomain,
      template_id: input.template_id || null,
      site_config: input.site_config || {},
      status: 'draft',
      ai_enabled: false,
    })
    .select()
    .single()

  if (error) {
    // Handle duplicate subdomain
    if (error.code === '23505') {
      return { data: null, error: new Error('このサブドメインは既に使用されています') }
    }
    return { data: null, error: new Error(error.message) }
  }

  return { data: data as Project, error: null }
}

// Get all projects for current user
export async function getProjects(): Promise<{ data: Project[] | null; error: Error | null }> {
  const supabase = createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { data: null, error: new Error('認証エラー: ログインしてください') }
  }

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return { data: null, error: new Error(error.message) }
  }

  return { data: data as Project[], error: null }
}

// Get a single project by ID
export async function getProject(projectId: string): Promise<{ data: Project | null; error: Error | null }> {
  const supabase = createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { data: null, error: new Error('認証エラー: ログインしてください') }
  }

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .eq('user_id', user.id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return { data: null, error: new Error('プロジェクトが見つかりません') }
    }
    return { data: null, error: new Error(error.message) }
  }

  return { data: data as Project, error: null }
}

// Update a project
export async function updateProject(
  projectId: string,
  input: UpdateProjectInput
): Promise<{ data: Project | null; error: Error | null }> {
  const supabase = createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { data: null, error: new Error('認証エラー: ログインしてください') }
  }

  // Prepare update data
  const updateData: Record<string, unknown> = {
    ...input,
    updated_at: new Date().toISOString(),
  }

  // If updating site_config, merge with existing
  if (input.site_config) {
    const { data: existing } = await supabase
      .from('projects')
      .select('site_config')
      .eq('id', projectId)
      .single()

    if (existing) {
      updateData.site_config = {
        ...existing.site_config,
        ...input.site_config,
      }
    }
  }

  const { data, error } = await supabase
    .from('projects')
    .update(updateData)
    .eq('id', projectId)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      return { data: null, error: new Error('このサブドメインは既に使用されています') }
    }
    return { data: null, error: new Error(error.message) }
  }

  return { data: data as Project, error: null }
}

// Delete a project
export async function deleteProject(projectId: string): Promise<{ error: Error | null }> {
  const supabase = createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: new Error('認証エラー: ログインしてください') }
  }

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId)
    .eq('user_id', user.id)

  if (error) {
    return { error: new Error(error.message) }
  }

  return { error: null }
}

// Check if a subdomain is available
export async function checkSubdomainAvailable(subdomain: string): Promise<boolean> {
  const supabase = createClient()

  const { data } = await supabase
    .from('projects')
    .select('id')
    .eq('subdomain', subdomain)
    .single()

  return !data
}

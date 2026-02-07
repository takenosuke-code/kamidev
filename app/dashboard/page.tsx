import Sidebar from '@/components/Sidebar'
import RightPanel from '@/components/RightPanel'
import ProjectsDashboard from '@/components/ProjectsDashboard'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Project } from '@/lib/types/database'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch user's projects
  const { data: projects, error: projectsError } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (projectsError) {
    console.error('Error fetching projects:', projectsError)
  }

  const userProjects = (projects as Project[]) || []

  return (
    <main className="h-screen flex overflow-hidden bg-gray-50">
      {/* Left Sidebar */}
      <Sidebar
        userEmail={user.email || null}
        userName={user.user_metadata?.full_name || null}
      />

      {/* Center Panel - Always show ProjectsDashboard (handles empty state) */}
      <ProjectsDashboard projects={userProjects} />

      {/* Right Sidebar */}
      <RightPanel projects={userProjects} />
    </main>
  )
}

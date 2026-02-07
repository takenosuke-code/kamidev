// Database Types for NORTIQ AI
// These types match the Supabase schema

export type PlanType = 'free' | 'starter' | 'pro' | 'business'
export type ProjectStatus = 'draft' | 'building' | 'published' | 'maintenance'
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing'
export type MessageStatus = 'pending' | 'auto_replied' | 'manual_replied' | 'archived'
export type PolicyType = 'refund' | 'shipping' | 'support' | 'hours' | 'general' | 'custom'
export type AIModel = 'gpt-4' | 'gpt-3.5' | 'haiku' | 'sonnet'
export type RequestType = 'site_generation' | 'translation' | 'response' | 'content'

// Plan limits for rate limiting
export const PLAN_LIMITS: Record<PlanType, { requests: number; sites: number; models: AIModel[] }> = {
  free: { requests: 10, sites: 1, models: ['haiku'] },
  starter: { requests: 100, sites: 1, models: ['haiku', 'gpt-3.5'] },
  pro: { requests: 500, sites: 3, models: ['haiku', 'gpt-3.5', 'gpt-4', 'sonnet'] },
  business: { requests: 2000, sites: 10, models: ['haiku', 'gpt-3.5', 'gpt-4', 'sonnet'] },
}

// Profile (User)
export interface Profile {
  id: string
  full_name: string | null
  email: string | null
  avatar_url: string | null
  created_at: string
}

// Subscription
export interface Subscription {
  id: string
  user_id: string
  plan: PlanType
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  status: SubscriptionStatus
  current_period_start: string | null
  current_period_end: string | null
  created_at: string
  updated_at: string
}

// Project (Website)
export interface Project {
  id: string
  user_id: string
  project_name: string
  subdomain: string | null
  custom_domain: string | null
  status: ProjectStatus
  template_id: string | null
  site_config: SiteConfig
  ai_enabled: boolean
  created_at: string
  updated_at: string
}

// Site configuration stored as JSON
export interface SiteConfig {
  // Business info
  business_name?: string
  business_type?: string
  description?: string

  // Contact
  phone?: string
  email?: string
  address?: string

  // Social links
  social?: {
    instagram?: string
    twitter?: string
    facebook?: string
    line?: string
  }

  // Theme settings
  theme?: {
    primary_color?: string
    secondary_color?: string
    font_family?: string
  }

  // SEO
  seo?: {
    title?: string
    description?: string
    keywords?: string[]
  }

  // Content sections
  sections?: {
    hero?: { title?: string; subtitle?: string; image?: string }
    about?: { title?: string; content?: string }
    services?: Array<{ name: string; description: string; price?: string }>
    gallery?: string[]
    contact?: { enabled: boolean }
  }
}

// Monthly usage tracking
export interface Usage {
  id: string
  user_id: string
  month: string // Format: '2025-01'
  ai_requests: number
  ai_cost_usd: number
  sites_generated: number
  created_at: string
  updated_at: string
}

// AI request logging
export interface AILog {
  id: string
  user_id: string
  project_id: string | null
  model: AIModel
  request_type: RequestType
  tokens_in: number | null
  tokens_out: number | null
  cost_usd: number | null
  created_at: string
}

// Customer messages (inbox)
export interface Message {
  id: string
  project_id: string
  sender_name: string | null
  sender_email: string | null
  sender_language: string
  original_message: string
  translated_message: string | null
  status: MessageStatus
  ai_draft_response: string | null
  final_response: string | null
  created_at: string
}

// Business policies for AI responses
export interface Policy {
  id: string
  project_id: string
  policy_type: PolicyType
  policy_title: string | null
  policy_content: string
  auto_apply: boolean
  created_at: string
}

// For creating new projects
export interface CreateProjectInput {
  project_name: string
  subdomain?: string
  template_id?: string
  site_config?: Partial<SiteConfig>
}

// For updating projects
export interface UpdateProjectInput {
  project_name?: string
  subdomain?: string
  custom_domain?: string
  status?: ProjectStatus
  template_id?: string
  site_config?: Partial<SiteConfig>
  ai_enabled?: boolean
}

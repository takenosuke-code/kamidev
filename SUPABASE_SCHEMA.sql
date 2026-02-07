-- NORTIQ AI - Database Schema
-- Run this in Supabase SQL Editor

-- ============================================
-- 1. PROFILES (User profiles, linked to auth)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, avatar_url)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email,
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ============================================
-- 2. SUBSCRIPTIONS (User billing plans)
-- ============================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'pro', 'business')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own subscription" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Auto-create free subscription on profile creation
CREATE OR REPLACE FUNCTION public.handle_new_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.subscriptions (user_id, plan, status)
  VALUES (new.id, 'free', 'active');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_profile_created ON public.profiles;

CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_profile();


-- ============================================
-- 3. PROJECTS (Websites users build)
-- ============================================
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  project_name TEXT NOT NULL,
  subdomain TEXT UNIQUE,
  custom_domain TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'building', 'published', 'maintenance')),
  template_id TEXT,
  site_config JSONB DEFAULT '{}'::jsonb,
  ai_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own projects" ON public.projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create projects" ON public.projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" ON public.projects
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects" ON public.projects
  FOR DELETE USING (auth.uid() = user_id);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_subdomain ON public.projects(subdomain);


-- ============================================
-- 4. USAGE (Monthly AI usage tracking)
-- ============================================
CREATE TABLE IF NOT EXISTS public.usage (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  month TEXT NOT NULL, -- Format: '2025-01'
  ai_requests INTEGER DEFAULT 0,
  ai_cost_usd DECIMAL(10,4) DEFAULT 0,
  sites_generated INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, month)
);

-- Enable RLS
ALTER TABLE public.usage ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own usage" ON public.usage
  FOR SELECT USING (auth.uid() = user_id);


-- ============================================
-- 5. AI_LOGS (Detailed AI request logging)
-- ============================================
CREATE TABLE IF NOT EXISTS public.ai_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  project_id UUID REFERENCES public.projects(id),
  model TEXT NOT NULL, -- 'gpt-4', 'gpt-3.5', 'haiku', 'sonnet'
  request_type TEXT NOT NULL, -- 'site_generation', 'translation', 'response', 'content'
  tokens_in INTEGER,
  tokens_out INTEGER,
  cost_usd DECIMAL(10,6),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.ai_logs ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own AI logs" ON public.ai_logs
  FOR SELECT USING (auth.uid() = user_id);

-- Index for analytics
CREATE INDEX IF NOT EXISTS idx_ai_logs_user_id ON public.ai_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_logs_created_at ON public.ai_logs(created_at);


-- ============================================
-- 6. MESSAGES (Customer inquiries inbox)
-- ============================================
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) NOT NULL,
  sender_name TEXT,
  sender_email TEXT,
  sender_language TEXT DEFAULT 'en',
  original_message TEXT NOT NULL,
  translated_message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'auto_replied', 'manual_replied', 'archived')),
  ai_draft_response TEXT,
  final_response TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view messages for their projects
CREATE POLICY "Users can view messages for own projects" ON public.messages
  FOR SELECT USING (
    project_id IN (
      SELECT id FROM public.projects WHERE user_id = auth.uid()
    )
  );

-- Index
CREATE INDEX IF NOT EXISTS idx_messages_project_id ON public.messages(project_id);


-- ============================================
-- 7. POLICIES (Business rules for AI responses)
-- ============================================
CREATE TABLE IF NOT EXISTS public.policies (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) NOT NULL,
  policy_type TEXT NOT NULL CHECK (policy_type IN ('refund', 'shipping', 'support', 'hours', 'general', 'custom')),
  policy_title TEXT,
  policy_content TEXT NOT NULL,
  auto_apply BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.policies ENABLE ROW LEVEL SECURITY;

-- Policy: Users can manage policies for own projects
CREATE POLICY "Users can view policies for own projects" ON public.policies
  FOR SELECT USING (
    project_id IN (
      SELECT id FROM public.projects WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create policies for own projects" ON public.policies
  FOR INSERT WITH CHECK (
    project_id IN (
      SELECT id FROM public.projects WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update policies for own projects" ON public.policies
  FOR UPDATE USING (
    project_id IN (
      SELECT id FROM public.projects WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete policies for own projects" ON public.policies
  FOR DELETE USING (
    project_id IN (
      SELECT id FROM public.projects WHERE user_id = auth.uid()
    )
  );


-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Get current month in YYYY-MM format
CREATE OR REPLACE FUNCTION public.get_current_month()
RETURNS TEXT AS $$
BEGIN
  RETURN TO_CHAR(NOW(), 'YYYY-MM');
END;
$$ LANGUAGE plpgsql;

-- Increment AI usage for a user
CREATE OR REPLACE FUNCTION public.increment_ai_usage(
  p_user_id UUID,
  p_cost DECIMAL DEFAULT 0
)
RETURNS void AS $$
BEGIN
  INSERT INTO public.usage (user_id, month, ai_requests, ai_cost_usd)
  VALUES (p_user_id, public.get_current_month(), 1, p_cost)
  ON CONFLICT (user_id, month)
  DO UPDATE SET
    ai_requests = public.usage.ai_requests + 1,
    ai_cost_usd = public.usage.ai_cost_usd + p_cost,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get user's current usage
CREATE OR REPLACE FUNCTION public.get_user_usage(p_user_id UUID)
RETURNS TABLE (
  ai_requests INTEGER,
  ai_cost_usd DECIMAL,
  sites_generated INTEGER,
  plan TEXT,
  request_limit INTEGER
) AS $$
DECLARE
  v_plan TEXT;
  v_limit INTEGER;
BEGIN
  -- Get user's plan
  SELECT s.plan INTO v_plan
  FROM public.subscriptions s
  WHERE s.user_id = p_user_id;

  -- Set limit based on plan
  v_limit := CASE v_plan
    WHEN 'free' THEN 10
    WHEN 'starter' THEN 100
    WHEN 'pro' THEN 500
    WHEN 'business' THEN 2000
    ELSE 10
  END;

  RETURN QUERY
  SELECT
    COALESCE(u.ai_requests, 0),
    COALESCE(u.ai_cost_usd, 0),
    COALESCE(u.sites_generated, 0),
    COALESCE(v_plan, 'free'),
    v_limit
  FROM public.usage u
  WHERE u.user_id = p_user_id
    AND u.month = public.get_current_month();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

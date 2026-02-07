-- NORTIQ AI - Migration Script
-- Run this if you have an EXISTING database with projects table
-- This adds missing columns and creates new tables

-- ============================================
-- STEP 1: Add missing columns to projects table
-- ============================================

-- Add subdomain column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'projects'
    AND column_name = 'subdomain'
  ) THEN
    ALTER TABLE public.projects ADD COLUMN subdomain TEXT UNIQUE;
  END IF;
END $$;

-- Add custom_domain column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'projects'
    AND column_name = 'custom_domain'
  ) THEN
    ALTER TABLE public.projects ADD COLUMN custom_domain TEXT;
  END IF;
END $$;

-- Add site_config column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'projects'
    AND column_name = 'site_config'
  ) THEN
    ALTER TABLE public.projects ADD COLUMN site_config JSONB DEFAULT '{}'::jsonb;
  END IF;
END $$;

-- Add ai_enabled column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'projects'
    AND column_name = 'ai_enabled'
  ) THEN
    ALTER TABLE public.projects ADD COLUMN ai_enabled BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Add template_id column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'projects'
    AND column_name = 'template_id'
  ) THEN
    ALTER TABLE public.projects ADD COLUMN template_id TEXT;
  END IF;
END $$;

-- Add updated_at column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'projects'
    AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE public.projects ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
  END IF;
END $$;

-- Update status CHECK constraint to include all values
-- First drop the old constraint if it exists
DO $$
BEGIN
  ALTER TABLE public.projects DROP CONSTRAINT IF EXISTS projects_status_check;
EXCEPTION WHEN undefined_object THEN
  NULL;
END $$;

-- Add new status constraint
DO $$
BEGIN
  ALTER TABLE public.projects ADD CONSTRAINT projects_status_check
    CHECK (status IN ('draft', 'building', 'published', 'maintenance'));
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;

-- Create index on subdomain if not exists
CREATE INDEX IF NOT EXISTS idx_projects_subdomain ON public.projects(subdomain);


-- ============================================
-- STEP 2: Create subscriptions table
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

-- Drop existing policy if exists, then create
DROP POLICY IF EXISTS "Users can view own subscription" ON public.subscriptions;
CREATE POLICY "Users can view own subscription" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);


-- ============================================
-- STEP 3: Create usage table
-- ============================================
CREATE TABLE IF NOT EXISTS public.usage (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  month TEXT NOT NULL,
  ai_requests INTEGER DEFAULT 0,
  ai_cost_usd DECIMAL(10,4) DEFAULT 0,
  sites_generated INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, month)
);

-- Enable RLS
ALTER TABLE public.usage ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if exists, then create
DROP POLICY IF EXISTS "Users can view own usage" ON public.usage;
CREATE POLICY "Users can view own usage" ON public.usage
  FOR SELECT USING (auth.uid() = user_id);


-- ============================================
-- STEP 4: Create ai_logs table
-- ============================================
CREATE TABLE IF NOT EXISTS public.ai_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  project_id UUID REFERENCES public.projects(id),
  model TEXT NOT NULL,
  request_type TEXT NOT NULL,
  tokens_in INTEGER,
  tokens_out INTEGER,
  cost_usd DECIMAL(10,6),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.ai_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if exists, then create
DROP POLICY IF EXISTS "Users can view own AI logs" ON public.ai_logs;
CREATE POLICY "Users can view own AI logs" ON public.ai_logs
  FOR SELECT USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_ai_logs_user_id ON public.ai_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_logs_created_at ON public.ai_logs(created_at);


-- ============================================
-- STEP 5: Create messages table
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

-- Drop existing policy if exists, then create
DROP POLICY IF EXISTS "Users can view messages for own projects" ON public.messages;
CREATE POLICY "Users can view messages for own projects" ON public.messages
  FOR SELECT USING (
    project_id IN (
      SELECT id FROM public.projects WHERE user_id = auth.uid()
    )
  );

-- Index
CREATE INDEX IF NOT EXISTS idx_messages_project_id ON public.messages(project_id);


-- ============================================
-- STEP 6: Create policies table (business rules)
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

-- Drop existing policies if exist, then create
DROP POLICY IF EXISTS "Users can view policies for own projects" ON public.policies;
DROP POLICY IF EXISTS "Users can create policies for own projects" ON public.policies;
DROP POLICY IF EXISTS "Users can update policies for own projects" ON public.policies;
DROP POLICY IF EXISTS "Users can delete policies for own projects" ON public.policies;

CREATE POLICY "Users can view policies for own projects" ON public.policies
  FOR SELECT USING (
    project_id IN (SELECT id FROM public.projects WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create policies for own projects" ON public.policies
  FOR INSERT WITH CHECK (
    project_id IN (SELECT id FROM public.projects WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update policies for own projects" ON public.policies
  FOR UPDATE USING (
    project_id IN (SELECT id FROM public.projects WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can delete policies for own projects" ON public.policies
  FOR DELETE USING (
    project_id IN (SELECT id FROM public.projects WHERE user_id = auth.uid())
  );


-- ============================================
-- STEP 7: Helper functions
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


-- ============================================
-- STEP 8: Auto-create subscription trigger
-- ============================================

-- Auto-create free subscription on profile creation
CREATE OR REPLACE FUNCTION public.handle_new_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.subscriptions (user_id, plan, status)
  VALUES (new.id, 'free', 'active')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_profile_created ON public.profiles;

CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_profile();


-- ============================================
-- STEP 9: Create subscription for existing users
-- ============================================

-- Insert free subscription for any existing profiles without one
INSERT INTO public.subscriptions (user_id, plan, status)
SELECT p.id, 'free', 'active'
FROM public.profiles p
WHERE NOT EXISTS (
  SELECT 1 FROM public.subscriptions s WHERE s.user_id = p.id
)
ON CONFLICT (user_id) DO NOTHING;


-- ============================================
-- Done! All tables and functions are ready.
-- ============================================

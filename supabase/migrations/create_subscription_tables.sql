/*
  # Create subscription tables

  1. New Tables
    - `subscriptions`
      - Controla assinaturas dos usuários
    - `subscription_features`
      - Define recursos disponíveis por plano
    - `user_subscription_logs`
      - Registra histórico de assinaturas

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create subscription plans enum
CREATE TYPE subscription_plan AS ENUM ('free', 'basic', 'premium');

-- Create subscriptions table
CREATE TABLE subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL UNIQUE,
  plan subscription_plan NOT NULL DEFAULT 'free',
  started_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create subscription features table
CREATE TABLE subscription_features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan subscription_plan NOT NULL,
  feature_name text NOT NULL,
  feature_limit integer,
  created_at timestamptz DEFAULT now(),
  UNIQUE(plan, feature_name)
);

-- Create subscription logs table
CREATE TABLE user_subscription_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  plan subscription_plan NOT NULL,
  action text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscription_logs ENABLE ROW LEVEL SECURITY;

-- Subscription policies
CREATE POLICY "Users can view their own subscription"
  ON subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Features policies
CREATE POLICY "Anyone can view subscription features"
  ON subscription_features
  FOR SELECT
  TO public
  USING (true);

-- Insert subscription features
INSERT INTO subscription_features (plan, feature_name, feature_limit) VALUES
  -- Free Plan
  ('free', 'saved_trips', 3),
  ('free', 'checklist_templates', 1),
  ('free', 'weather_forecast_days', 3),
  ('free', 'local_events', 5),
  
  -- Basic Plan
  ('basic', 'saved_trips', 10),
  ('basic', 'checklist_templates', 5),
  ('basic', 'weather_forecast_days', 7),
  ('basic', 'local_events', 15),
  ('basic', 'offline_access', NULL),
  ('basic', 'ad_free', NULL),
  
  -- Premium Plan
  ('premium', 'saved_trips', -1), -- Unlimited
  ('premium', 'checklist_templates', -1), -- Unlimited
  ('premium', 'weather_forecast_days', 14),
  ('premium', 'local_events', -1), -- Unlimited
  ('premium', 'offline_access', NULL),
  ('premium', 'ad_free', NULL),
  ('premium', 'priority_support', NULL),
  ('premium', 'custom_themes', NULL),
  ('premium', 'advanced_analytics', NULL),
  ('premium', 'group_planning', NULL);

-- Function to create default subscription for new users
CREATE OR REPLACE FUNCTION create_default_subscription()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO subscriptions (user_id, plan)
  VALUES (NEW.id, 'free');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create default subscription
CREATE TRIGGER create_user_subscription
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION create_default_subscription();

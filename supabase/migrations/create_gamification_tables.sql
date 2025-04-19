/*
  # Create gamification tables

  1. New Tables
    - `achievements`
      - Armazena todas as conquistas disponíveis
    - `user_achievements`
      - Registra conquistas dos usuários
    - `user_points`
      - Controla pontos e níveis dos usuários

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create achievements table
CREATE TABLE achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  icon_name text NOT NULL,
  points integer NOT NULL DEFAULT 0,
  category text NOT NULL,
  requirement_count integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

-- Create user achievements table
CREATE TABLE user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  achievement_id uuid REFERENCES achievements NOT NULL,
  progress integer DEFAULT 0,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Create user points table
CREATE TABLE user_points (
  user_id uuid PRIMARY KEY REFERENCES auth.users,
  total_points integer DEFAULT 0,
  level integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_points ENABLE ROW LEVEL SECURITY;

-- Achievements policies
CREATE POLICY "Anyone can view achievements"
  ON achievements
  FOR SELECT
  TO public
  USING (true);

-- User achievements policies
CREATE POLICY "Users can view their own achievements"
  ON user_achievements
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can create user achievements"
  ON user_achievements
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- User points policies
CREATE POLICY "Users can view their own points"
  ON user_points
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Insert initial achievements
INSERT INTO achievements (name, description, icon_name, points, category, requirement_count) VALUES
  ('Primeira Viagem', 'Complete seu primeiro roteiro de viagem', 'map', 100, 'basics', 1),
  ('Explorador Iniciante', 'Visite 5 destinos diferentes', 'compass', 200, 'exploration', 5),
  ('Crítico de Viagens', 'Faça 10 avaliações de destinos', 'star', 300, 'social', 10),
  ('Mestre do Check-in', 'Complete 20 checklists de viagem', 'checklist', 400, 'organization', 20),
  ('Viajante Cultural', 'Visite destinos em 3 continentes diferentes', 'globe', 500, 'exploration', 3),
  ('Fotógrafo de Viagem', 'Compartilhe 15 fotos de viagens', 'camera', 300, 'social', 15),
  ('Planejador Expert', 'Crie 10 roteiros personalizados', 'calendar', 400, 'organization', 10),
  ('Aventureiro', 'Complete 5 destinos de aventura', 'mountain', 300, 'adventure', 5),
  ('Guru do Orçamento', 'Complete 10 viagens dentro do orçamento', 'wallet', 400, 'finance', 10),
  ('Viajante Social', 'Conecte-se com 20 outros viajantes', 'users', 300, 'social', 20);

-- Function to calculate level based on points
CREATE OR REPLACE FUNCTION calculate_level(points integer)
RETURNS integer AS $$
BEGIN
  -- Simple level calculation: level = 1 + floor(points/1000)
  RETURN 1 + FLOOR(points::numeric / 1000);
END;
$$ LANGUAGE plpgsql;

-- Function to update user points and check achievements
CREATE OR REPLACE FUNCTION update_user_progress()
RETURNS TRIGGER AS $$
BEGIN
  -- Update user points
  INSERT INTO user_points (user_id, total_points, level)
  VALUES (NEW.user_id, NEW.points, calculate_level(NEW.points))
  ON CONFLICT (user_id)
  DO UPDATE SET
    total_points = user_points.total_points + NEW.points,
    level = calculate_level(user_points.total_points + NEW.points),
    updated_at = now();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

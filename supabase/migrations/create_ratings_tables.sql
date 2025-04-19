/*
  # Create ratings and reviews tables

  1. New Tables
    - `ratings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `destination_id` (text)
      - `rating` (integer)
      - `review` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `destinations`
      - `id` (uuid, primary key)
      - `name` (text)
      - `avg_rating` (float)
      - `total_ratings` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Create destinations table
CREATE TABLE destinations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  avg_rating float DEFAULT 0,
  total_ratings integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create ratings table
CREATE TABLE ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  destination_id uuid REFERENCES destinations NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, destination_id)
);

-- Enable RLS
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

-- Destinations policies
CREATE POLICY "Anyone can view destinations"
  ON destinations
  FOR SELECT
  TO public
  USING (true);

-- Ratings policies
CREATE POLICY "Users can create their own ratings"
  ON ratings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view all ratings"
  ON ratings
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can update their own ratings"
  ON ratings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Function to update destination average rating
CREATE OR REPLACE FUNCTION update_destination_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE destinations
  SET 
    avg_rating = (
      SELECT ROUND(AVG(rating)::numeric, 2)
      FROM ratings
      WHERE destination_id = NEW.destination_id
    ),
    total_ratings = (
      SELECT COUNT(*)
      FROM ratings
      WHERE destination_id = NEW.destination_id
    ),
    updated_at = now()
  WHERE id = NEW.destination_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update destination rating on rating changes
CREATE TRIGGER update_destination_rating
AFTER INSERT OR UPDATE OR DELETE ON ratings
FOR EACH ROW
EXECUTE FUNCTION update_destination_rating();

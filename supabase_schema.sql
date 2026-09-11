-- Run this block in the Supabase SQL editor to create the necessary tables.

CREATE TABLE profiles (
  id uuid primary key default gen_random_uuid(),
  first_name text,
  last_name text,
  email text unique not null,
  avatar text,
  loan_amount numeric
);

-- Insert guest user profile since Auth is disabled
INSERT INTO profiles (first_name, last_name, email, avatar, loan_amount)
VALUES ('Guest', 'User', 'guest@expenseflow.app', 'https://ui-avatars.com/api/?name=Guest&background=EAB308&color=000&size=150', 0)
ON CONFLICT DO NOTHING;

CREATE TABLE transactions (
  id text primary key,
  text text not null,
  amount numeric not null,
  type text,
  date text not null
);

CREATE TABLE budgets (
  month_key text primary key,
  amount numeric not null
);

-- Enable RLS and add public access policies for simple testing
-- ONLY for demo/development environments!

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Enable update access for all profiles" ON profiles FOR UPDATE USING (true);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all access for all transactions" ON transactions FOR ALL USING (true);

ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all access for all budgets" ON budgets FOR ALL USING (true);

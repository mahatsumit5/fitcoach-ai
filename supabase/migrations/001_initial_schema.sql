-- ─────────────────────────────────────────────────────────────────────────────
-- FitCoach AI — Initial schema
-- Run via: supabase db push
-- ─────────────────────────────────────────────────────────────────────────────

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ─── Profiles ────────────────────────────────────────────────────────────────
create table if not exists profiles (
  id                  uuid        primary key references auth.users(id) on delete cascade,
  email               text        not null,
  display_name        text,
  age                 int,
  weight_kg           numeric(5,2),
  height_cm           numeric(5,2),
  fitness_goal        text,
  experience_level    text        check (experience_level in ('beginner','intermediate','advanced')),
  dietary_prefs       text[],
  injuries            text[],
  days_per_week       int         default 4,
  equipment           text        default 'gym',
  push_token          text,
  onboarding_complete boolean     not null default false,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- Auto-create profile on sign up
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on profiles
  for each row execute procedure update_updated_at();

-- ─── Exercises ───────────────────────────────────────────────────────────────
create table if not exists exercises (
  id           uuid        primary key default gen_random_uuid(),
  name         text        not null,
  muscle_group text        not null,
  equipment    text,
  difficulty   text        check (difficulty in ('beginner','intermediate','advanced')),
  instructions text,
  created_at   timestamptz not null default now()
);

-- ─── Workout sessions ────────────────────────────────────────────────────────
create table if not exists workout_sessions (
  id               uuid        primary key default gen_random_uuid(),
  profile_id       uuid        not null references profiles(id) on delete cascade,
  name             text        not null,
  duration_seconds int,
  calories_burned  int,
  completed        boolean     not null default false,
  started_at       timestamptz not null default now(),
  completed_at     timestamptz
);

-- ─── Session exercises (the actual sets logged) ───────────────────────────────
create table if not exists session_exercises (
  id          uuid        primary key default gen_random_uuid(),
  session_id  uuid        not null references workout_sessions(id) on delete cascade,
  exercise_id uuid        references exercises(id),
  name        text        not null,   -- denormalised for flexibility
  sets        int,
  reps        int,
  weight_kg   numeric(6,2),
  rest_seconds int,
  set_logs    jsonb       default '[]'::jsonb,
  sort_order  int         default 0
);

-- ─── Nutrition logs ───────────────────────────────────────────────────────────
create table if not exists nutrition_logs (
  id         uuid        primary key default gen_random_uuid(),
  profile_id uuid        not null references profiles(id) on delete cascade,
  meal_name  text        not null,
  calories   int         not null default 0,
  protein_g  numeric(6,2) default 0,
  carbs_g    numeric(6,2) default 0,
  fat_g      numeric(6,2) default 0,
  logged_at  timestamptz not null default now()
);

-- ─── Water logs ───────────────────────────────────────────────────────────────
create table if not exists water_logs (
  id         uuid        primary key default gen_random_uuid(),
  profile_id uuid        not null references profiles(id) on delete cascade,
  amount_ml  int         not null,
  logged_at  timestamptz not null default now()
);

-- ─── AI messages ──────────────────────────────────────────────────────────────
create table if not exists ai_messages (
  id           uuid        primary key default gen_random_uuid(),
  profile_id   uuid        not null references profiles(id) on delete cascade,
  role         text        not null check (role in ('user','assistant')),
  content      text        not null,
  context_type text,       -- 'workout', 'nutrition', 'general', etc.
  created_at   timestamptz not null default now()
);

-- ─── Row Level Security ───────────────────────────────────────────────────────
alter table profiles          enable row level security;
alter table workout_sessions  enable row level security;
alter table session_exercises enable row level security;
alter table nutrition_logs    enable row level security;
alter table water_logs        enable row level security;
alter table ai_messages       enable row level security;

-- Exercises are public (read) but only admins insert
alter table exercises enable row level security;
create policy "Exercises are readable by all authenticated users"
  on exercises for select to authenticated using (true);

-- Profiles — users can only read/update their own
create policy "Users can read own profile"
  on profiles for select using (auth.uid() = id);
create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

-- Workout sessions
create policy "Users can manage own sessions"
  on workout_sessions for all using (auth.uid() = profile_id);

-- Session exercises
create policy "Users can manage own session exercises"
  on session_exercises for all using (
    exists (
      select 1 from workout_sessions ws
      where ws.id = session_exercises.session_id
        and ws.profile_id = auth.uid()
    )
  );

-- Nutrition logs
create policy "Users can manage own nutrition logs"
  on nutrition_logs for all using (auth.uid() = profile_id);

-- Water logs
create policy "Users can manage own water logs"
  on water_logs for all using (auth.uid() = profile_id);

-- AI messages
create policy "Users can manage own AI messages"
  on ai_messages for all using (auth.uid() = profile_id);

-- ─── Indexes ──────────────────────────────────────────────────────────────────
create index if not exists idx_workout_sessions_profile  on workout_sessions(profile_id, started_at desc);
create index if not exists idx_nutrition_logs_profile    on nutrition_logs(profile_id, logged_at desc);
create index if not exists idx_water_logs_profile        on water_logs(profile_id, logged_at desc);
create index if not exists idx_ai_messages_profile       on ai_messages(profile_id, created_at desc);

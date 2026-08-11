-- Hury Shop database schema for Supabase.

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null,
  campus text not null default '',
  bio text not null default '',
  role text not null default 'user',
  verification_status text not null default 'NOT_VERIFIED',
  avatar_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists categories (
  id bigserial primary key,
  name text not null unique,
  slug text not null unique,
  description text,
  created_at timestamp with time zone default now()
);

create table if not exists listings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  price numeric not null,
  campus_location text not null,
  condition text not null,
  listing_type text not null,
  status text not null default 'PENDING',
  cover_url text,
  image_urls jsonb,
  seller_id uuid references profiles(id) on delete cascade,
  category_id bigint references categories(id) on delete set null,
  rejection_reason text,
  views integer not null default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists offers (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references listings(id) on delete cascade,
  buyer_id uuid references profiles(id) on delete cascade,
  amount numeric not null,
  status text not null default 'PENDING',
  message text,
  created_at timestamp with time zone default now()
);

create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references listings(id) on delete cascade,
  sender_id uuid references profiles(id) on delete cascade,
  receiver_id uuid references profiles(id) on delete cascade,
  updated_at timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references conversations(id) on delete cascade,
  sender_id uuid references profiles(id) on delete cascade,
  body text not null,
  read boolean not null default false,
  created_at timestamp with time zone default now()
);

create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references profiles(id) on delete cascade,
  reported_user_id uuid references profiles(id),
  listing_id uuid references listings(id),
  reason text not null,
  details text,
  status text not null default 'OPEN',
  created_at timestamp with time zone default now()
);

-- Seed default categories
insert into categories (name, slug, description)
values
  ('Electronics', 'electronics', 'Devices, accessories, and campus tech'),
  ('Phones & Tablets', 'phones-tablets', 'Mobile devices, tablets, and chargers'),
  ('Computers', 'computers', 'Laptops, desktops, and peripherals'),
  ('Fashion', 'fashion', 'Clothing, bags, and campus style'),
  ('Shoes', 'shoes', 'Footwear for campus life'),
  ('Books', 'books', 'Textbooks, study guides, and notes'),
  ('Furniture', 'furniture', 'Dorm furniture, desks, and storage'),
  ('Home Items', 'home-items', 'Dorm and household essentials'),
  ('Food', 'food', 'Snacks, meals, and groceries'),
  ('Beauty', 'beauty', 'Grooming supplies and self-care'),
  ('Sports', 'sports', 'Equipment and active gear'),
  ('School Supplies', 'school-supplies', 'Notebooks, stationery, and supplies'),
  ('Services', 'services', 'Tutoring, repair, and campus services'),
  ('Other', 'other', 'General campus marketplace items')
on conflict (slug) do nothing;

-- ============================================================
-- HeavyForce Mongolia — Supabase schema
-- Run this in: Supabase Dashboard → SQL Editor → New query → Run
-- ============================================================

-- 1) Extension for uuid generation
create extension if not exists "pgcrypto";

-- 2) products table — matches the shape used by app/admin/page.tsx
create table if not exists public.products (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  category     text not null,
  brand        text not null,
  description  text,
  price        text not null,
  power        text,
  weight       text,
  engine       text,
  image        text,
  badge        text,                          -- 'New' | 'Best Seller' | null
  phone        text default '+976 8588-0999',
  specs        jsonb not null default '[]'::jsonb,  -- [{label, value}, ...]
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists products_category_idx on public.products (category);
create index if not exists products_brand_idx    on public.products (brand);
create index if not exists products_created_idx  on public.products (created_at desc);

-- 3) Auto-bump updated_at on every UPDATE
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- 4) Row-Level Security
alter table public.products enable row level security;

-- Anyone (including anon) can read — needed by the public homepage / catalog
drop policy if exists "products_public_read" on public.products;
create policy "products_public_read"
  on public.products
  for select
  to anon, authenticated
  using (true);

-- Only authenticated users whose JWT carries is_admin = true can write.
-- The admin UI sets this via supabase.auth.admin.updateUserById(...,
-- { user_metadata: { is_admin: true } }) or you set it manually below.
drop policy if exists "products_admin_insert" on public.products;
create policy "products_admin_insert"
  on public.products
  for insert
  to authenticated
  with check (
    coalesce((auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean, false) = true
  );

drop policy if exists "products_admin_update" on public.products;
create policy "products_admin_update"
  on public.products
  for update
  to authenticated
  using (
    coalesce((auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean, false) = true
  )
  with check (
    coalesce((auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean, false) = true
  );

drop policy if exists "products_admin_delete" on public.products;
create policy "products_admin_delete"
  on public.products
  for delete
  to authenticated
  using (
    coalesce((auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean, false) = true
  );

-- ============================================================
-- 5) orders — created by checkout, kept in sync with Wire Payment
--    via app/api/payments/webhook/route.ts (uses the service-role
--    key, so it bypasses RLS — that's expected for webhooks).
-- ============================================================
create table if not exists public.orders (
  id                 uuid primary key default uuid_generate_v4(),
  user_id            uuid references auth.users (id) on delete set null,
  status             text not null default 'pending'
                       check (status in ('pending', 'paid', 'failed', 'canceled', 'refunded')),
  amount             integer not null check (amount > 0),   -- MNT, whole tögrög
  currency           text not null default 'MNT',
  payment_intent_id  text,                                  -- Wire PaymentIntent id (obj_...)
  items              jsonb not null default '[]'::jsonb,    -- [{ product_id, name, qty, price }]
  contact            jsonb not null default '{}'::jsonb,    -- { name, phone, address } — no card data ever
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index if not exists orders_user_id_idx           on public.orders (user_id);
create index if not exists orders_payment_intent_id_idx on public.orders (payment_intent_id);
create index if not exists orders_status_idx            on public.orders (status);

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

alter table public.orders enable row level security;

-- Customers can see their own orders only.
drop policy if exists "orders_select_own" on public.orders;
create policy "orders_select_own"
  on public.orders
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Customers can create their own orders (status always starts 'pending' —
-- enforced below — the actual payment confirmation happens server-side).
drop policy if exists "orders_insert_own" on public.orders;
create policy "orders_insert_own"
  on public.orders
  for insert
  to authenticated
  with check (auth.uid() = user_id and status = 'pending');

-- Admins can see and manage every order (support / fulfilment).
drop policy if exists "orders_admin_all" on public.orders;
create policy "orders_admin_all"
  on public.orders
  for all
  to authenticated
  using (coalesce((auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean, false) = true)
  with check (coalesce((auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean, false) = true);

-- NOTE: status transitions to 'paid'/'failed'/'canceled' are written by the
-- webhook route using the service-role key (bypasses RLS by design — there
-- is no end-user JWT in a server-to-server webhook call).

-- ============================================================
-- 6) Promote a user to admin (run once, replace the email)
-- ============================================================
-- Step A: create the user first via Supabase Dashboard → Authentication → Users → Add user
-- Step B: run this to flip the is_admin flag:
--
--   update auth.users
--   set raw_user_meta_data = coalesce(raw_user_meta_data, '{}'::jsonb)
--                            || '{"is_admin": true}'::jsonb
--   where email = 'you@example.com';
--
-- After running it, the user must sign out and sign back in so the new JWT carries is_admin=true.

-- ============================================================
-- 7) (Optional) Seed a few products to test the homepage
-- ============================================================
-- insert into public.products (name, category, brand, description, price, power, weight, engine, image, badge, specs)
-- values
-- ('CAT 390F L',     'Excavator',    'Caterpillar', 'Large hydraulic excavator for heavy-duty mining and construction.', '₮1,240,000', '523 HP',   '88,450 kg',  'Cat C18',           '/images/product-excavator.jpg',   'New',         '[{"label":"Engine","value":"Cat C18 ACERT"}]'::jsonb),
-- ('Komatsu PC800',  'Excavator',    'Komatsu',     'High-performance mining excavator with advanced hydraulics.',       '₮980,000',   '513 HP',   '79,200 kg',  'Komatsu SAA6D140E', '/images/product-excavator-2.jpg', null,          '[]'::jsonb),
-- ('CAT D9T',        'Bulldozer',    'Caterpillar', 'Track-type tractor for heavy dozing and ripping.',                  '₮720,000',   '410 HP',   '48,000 kg',  'Cat C18',           '/images/product-bulldozer.jpg',   'Best Seller', '[]'::jsonb);

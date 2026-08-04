-- ==============================================================================
-- Anatolia Web Application - Complete Supabase Database Schema (schema.sql)
-- Website: https://www.anatolia.com/
-- Description: Full DDL DDL Scripts, RLS Policies, Indexes, and Initial Seed Data
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. MENUS TABLE (Dynamic Layout & Menu Engine)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.menus (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    parent_id UUID REFERENCES public.menus(id) ON DELETE CASCADE,
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    position TEXT NOT NULL CHECK (position IN ('header', 'footer', 'both')),
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. HERO_SLIDES TABLE (Hero Banner & Media Slider CMS)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.hero_slides (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
    media_url TEXT NOT NULL,
    poster_url TEXT,
    title TEXT NOT NULL,
    subtitle TEXT,
    cta_label TEXT DEFAULT 'Explore Collections',
    cta_url TEXT DEFAULT '/collections',
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 3. PRODUCTS TABLE (Product CRUD, Catalog & Gourmet E-Commerce)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    collection TEXT NOT NULL,
    category TEXT,
    price NUMERIC(10, 2) NOT NULL DEFAULT 50.00,
    original_price NUMERIC(10, 2),
    stock INT NOT NULL DEFAULT 20,
    rating NUMERIC(3, 2) DEFAULT 4.9,
    reviews_count INT DEFAULT 12,
    sku TEXT,
    format TEXT NOT NULL,
    finish TEXT NOT NULL,
    color TEXT NOT NULL,
    look TEXT NOT NULL,
    image_url TEXT NOT NULL,
    description TEXT,
    thickness TEXT DEFAULT 'Single Estate',
    origin TEXT DEFAULT 'Italy',
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 4. USER_PROFILES TABLE (Customer Profiles & Address Book)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    addresses JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 5. ORDERS TABLE (E-Commerce Orders & Purchase History)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY, -- e.g. 'ORD-2026-8891'
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    status TEXT NOT NULL CHECK (status IN ('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled')) DEFAULT 'Processing',
    items JSONB NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    discount NUMERIC(10, 2) DEFAULT 0.00,
    shipping NUMERIC(10, 2) DEFAULT 0.00,
    total NUMERIC(10, 2) NOT NULL,
    shipping_address JSONB NOT NULL,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('credit_card', 'bank_transfer', 'kakao_pay')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 6. CONTENT_BLOCKS TABLE (Section Content Block Editor)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.content_blocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_key TEXT UNIQUE NOT NULL,
    page TEXT NOT NULL DEFAULT 'home',
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    media_url TEXT,
    media_type TEXT DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
    badge TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 7. JOURNAL_ARTICLES TABLE (News / Event / Blog Journal Editor)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.journal_articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('News', 'Event', 'Architecture', 'Design')),
    excerpt TEXT,
    content TEXT NOT NULL,
    cover_image TEXT,
    is_published BOOLEAN DEFAULT true,
    published_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 8. MEDIA_LIBRARY TABLE (Media Library & File Upload Manager)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.media_library (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('image', 'video')),
    size TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_menus_parent ON public.menus(parent_id);
CREATE INDEX IF NOT EXISTS idx_menus_position_active ON public.menus(position, is_active);
CREATE INDEX IF NOT EXISTS idx_products_collection ON public.products(collection);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured);
CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_journal_slug ON public.journal_articles(slug);
CREATE INDEX IF NOT EXISTS idx_journal_published ON public.journal_articles(is_published);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;

-- 0. Drop Existing Policies for Clean Re-execution
DROP POLICY IF EXISTS "Public Read Active Menus" ON public.menus;
DROP POLICY IF EXISTS "Public Read Hero Slides" ON public.hero_slides;
DROP POLICY IF EXISTS "Public Read Products" ON public.products;
DROP POLICY IF EXISTS "Public Read Content Blocks" ON public.content_blocks;
DROP POLICY IF EXISTS "Public Read Published Journal Articles" ON public.journal_articles;
DROP POLICY IF EXISTS "Public Read Media Library" ON public.media_library;

DROP POLICY IF EXISTS "Users Read Own Profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users Update Own Profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users Read Own Orders" ON public.orders;
DROP POLICY IF EXISTS "Users Insert Orders" ON public.orders;

DROP POLICY IF EXISTS "Admin Full Access Menus" ON public.menus;
DROP POLICY IF EXISTS "Admin Full Access Hero Slides" ON public.hero_slides;
DROP POLICY IF EXISTS "Admin Full Access Products" ON public.products;
DROP POLICY IF EXISTS "Admin Full Access User Profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admin Full Access Orders" ON public.orders;
DROP POLICY IF EXISTS "Admin Full Access Content Blocks" ON public.content_blocks;
DROP POLICY IF EXISTS "Admin Full Access Journal Articles" ON public.journal_articles;
DROP POLICY IF EXISTS "Admin Full Access Media Library" ON public.media_library;

-- 1. Public Read Policies (Allow anyone to read active items)
CREATE POLICY "Public Read Active Menus" ON public.menus FOR SELECT USING (true);
CREATE POLICY "Public Read Hero Slides" ON public.hero_slides FOR SELECT USING (true);
CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public Read Content Blocks" ON public.content_blocks FOR SELECT USING (true);
CREATE POLICY "Public Read Published Journal Articles" ON public.journal_articles FOR SELECT USING (true);
CREATE POLICY "Public Read Media Library" ON public.media_library FOR SELECT USING (true);

-- 2. Customer Policies for User Profiles & Orders (Authenticated Users Only)
CREATE POLICY "Users Read Own Profile" ON public.user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users Update Own Profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users Read Own Orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users Insert Orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- 3. Admin & Service Role Access Policies (Service Role / Admin Role)
CREATE POLICY "Admin Full Access Menus" ON public.menus FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Admin Full Access Hero Slides" ON public.hero_slides FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Admin Full Access Products" ON public.products FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Admin Full Access User Profiles" ON public.user_profiles FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Admin Full Access Orders" ON public.orders FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Admin Full Access Content Blocks" ON public.content_blocks FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Admin Full Access Journal Articles" ON public.journal_articles FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Admin Full Access Media Library" ON public.media_library FOR ALL USING (auth.role() = 'service_role');


-- ==============================================================================
-- INITIAL SEED DATA INSERT STATEMENTS
-- ==============================================================================

-- Seed Content Blocks
INSERT INTO public.content_blocks (section_key, page, title, subtitle, description, badge)
VALUES
(
    'featured_categories',
    'home',
    'Curated Gourmet Collections',
    'Product Categories',
    'From cold-pressed Tuscan EVOO to 36-month DOP Parmigiano Reggiano and wild truffles, each item is imported directly from heritage artisans.',
    'Fine Foods Showcase'
),
(
    'brand_story',
    'home',
    'Pioneering Heritage Gastronomy.',
    'Leadership & Excellence',
    'Anatolia stands at the forefront of global luxury gourmet imports. Driven by uncompromised quality standards and cold-chain precision, we curate artisanal ingredients for Michelin-starred dining and discerning homes.',
    'Artisanal Craftsmanship'
)
ON CONFLICT (section_key) DO NOTHING;

-- Seed Gourmet Products
INSERT INTO public.products (name, collection, category, price, original_price, stock, rating, reviews_count, sku, format, finish, color, look, image_url, description, thickness, origin, is_featured)
VALUES
(
    'Toscana Reserve Extra Virgin Olive Oil',
    'Artisanal Pantry',
    'Olive Oil & Vinegar',
    48.00,
    55.00,
    42,
    4.9,
    28,
    'EVOO-TOS-500',
    '500ml Glass Bottle',
    'Cold-Pressed & Unfiltered',
    'Emerald Gold',
    'Italian Heritage',
    'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=1000&h=700&auto=format&fit=crop',
    'First cold-pressed EVOO from hand-picked Tuscan Frantoio olives, offering notes of fresh artichoke, green tomato, and a spicy pepper finish.',
    'Single Estate',
    'Tuscany, Italy',
    true
),
(
    'Parmigiano Reggiano DOP 36-Month Aged',
    'Dairy & Charcuterie',
    'Cheese & Dairy',
    62.50,
    70.00,
    18,
    5.0,
    41,
    'CHZ-PARM-36',
    '500g Vacuum Wedge',
    'Artisanal Raw Milk Aged',
    'Warm Ivory',
    'DOP Certified Organic',
    'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=1000&h=700&auto=format&fit=crop',
    'Slowly matured for 36 months in Reggio Emilia. Characterized by crunchy tyrosine crystals, deep savory umami, and rich pineapple aromas.',
    'Wheel Cut',
    'Emolia-Romagna, Italy',
    true
);


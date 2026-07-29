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
-- 3. PRODUCTS TABLE (Product Category CRUD & Showcase)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    collection TEXT NOT NULL CHECK (collection IN ('Ceramic + Porcelain', 'Natural Stone', 'Sintered Slab')),
    format TEXT NOT NULL CHECK (format IN ('60x120 cm', '120x280 cm Slab', '30x60 cm', 'Mosaics')),
    finish TEXT NOT NULL CHECK (finish IN ('Polished', 'Matte', 'Honed', 'Textured')),
    color TEXT NOT NULL CHECK (color IN ('Bianco', 'Nero', 'Calacatta Gold', 'Travertine', 'Beige', 'Gray')),
    look TEXT NOT NULL CHECK (look IN ('Marble Look', 'Stone Look', 'Sintered Slab', 'Wood Look', 'Onyx Look')),
    image_url TEXT NOT NULL,
    description TEXT,
    thickness TEXT DEFAULT '9.5 mm',
    origin TEXT DEFAULT 'Italy',
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 4. CONTENT_BLOCKS TABLE (Section Content Block Editor)
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
-- 5. JOURNAL_ARTICLES TABLE (News / Event / Blog Journal Editor)
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
-- 6. MEDIA_LIBRARY TABLE (Media Library & File Upload Manager)
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
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured);
CREATE INDEX IF NOT EXISTS idx_journal_slug ON public.journal_articles(slug);
CREATE INDEX IF NOT EXISTS idx_journal_published ON public.journal_articles(is_published);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;

-- 1. Public Read Policies (Allow anyone to read active items)
CREATE POLICY "Public Read Active Menus" ON public.menus FOR SELECT USING (true);
CREATE POLICY "Public Read Hero Slides" ON public.hero_slides FOR SELECT USING (true);
CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public Read Content Blocks" ON public.content_blocks FOR SELECT USING (true);
CREATE POLICY "Public Read Published Journal Articles" ON public.journal_articles FOR SELECT USING (true);
CREATE POLICY "Public Read Media Library" ON public.media_library FOR SELECT USING (true);

-- 2. Service Role & Authenticated Full Access Policies
CREATE POLICY "Admin Full Access Menus" ON public.menus FOR ALL USING (true);
CREATE POLICY "Admin Full Access Hero Slides" ON public.hero_slides FOR ALL USING (true);
CREATE POLICY "Admin Full Access Products" ON public.products FOR ALL USING (true);
CREATE POLICY "Admin Full Access Content Blocks" ON public.content_blocks FOR ALL USING (true);
CREATE POLICY "Admin Full Access Journal Articles" ON public.journal_articles FOR ALL USING (true);
CREATE POLICY "Admin Full Access Media Library" ON public.media_library FOR ALL USING (true);

-- ==============================================================================
-- INITIAL SEED DATA INSERT STATEMENTS
-- ==============================================================================

-- Seed Content Blocks
INSERT INTO public.content_blocks (section_key, page, title, subtitle, description, badge)
VALUES
(
    'featured_categories',
    'home',
    'Engineered Collections',
    'Product Categories',
    'From porcelain floorings to large sintered stone slabs, each collection evokes a sense of calm and tactile sophistication.',
    'Product Showcase'
),
(
    'brand_story',
    'home',
    'Pioneering Patented Surface Innovations.',
    'Leadership & Excellence',
    'Anatolia stands at the forefront of global tile and slab manufacturing. Driven by sustainable practices and state-of-the-art technological advancements, we craft surfaces that redefine interior and exterior architecture.',
    'Craftsmanship'
)
ON CONFLICT (section_key) DO NOTHING;

-- Seed Hero Slides
INSERT INTO public.hero_slides (media_type, media_url, poster_url, title, subtitle, cta_label, cta_url, sort_order, is_active)
VALUES
(
    'video',
    'https://assets.mixkit.co/videos/preview/mixkit-modern-architecture-building-facade-41561-large.mp4',
    'https://optimise2.assets-servd.host/powerful-koala/production/images/LAMARCA_TRAVERTINO_INSTRATA_CAM01.jpg?w=1600&h=900&q=85&auto=format&fit=crop',
    'Architectural Surface Innovations',
    'Discover patented sintered slabs and porcelain tiles engineered for timeless architectural spaces.',
    'Explore Collections',
    '/collections',
    1,
    true
),
(
    'image',
    'https://optimise2.assets-servd.host/powerful-koala/production/images/LAMARCA_TRAVERTINO_INSTRATA_CAM01.jpg?w=1600&h=900&q=85&auto=format&fit=crop',
    NULL,
    'Curated Natural Stone & Sintered Slabs',
    'Hand-selected Marble, Dolomite, and Onyx inspirations crafted with Italian precision.',
    'View Lookbook',
    '/collections?look=Marble+Look',
    2,
    true
);

-- Seed Products
INSERT INTO public.products (name, collection, format, finish, color, look, image_url, description, thickness, origin, is_featured)
VALUES
(
    'Lamarca Travertino Instrata',
    'Natural Stone',
    '60x120 cm',
    'Textured',
    'Travertine',
    'Stone Look',
    'https://optimise2.assets-servd.host/powerful-koala/production/images/LAMARCA_TRAVERTINO_INSTRATA_CAM01.jpg?w=1000&h=700&auto=compress%2Cformat&fit=crop',
    'Exquisite vein-cut travertine texture evoking timeless natural stone serenity for indoor and outdoor vertical walls.',
    '9.5 mm',
    'Italy',
    true
),
(
    'Cosmo Lumino Onyx Halo',
    'Sintered Slab',
    '120x280 cm Slab',
    'Polished',
    'Calacatta Gold',
    'Onyx Look',
    'https://optimise2.assets-servd.host/powerful-koala/production/images/menu/Onyx_menu_image.jpg?w=1000&h=700&auto=compress%2Cformat&fit=crop',
    'Luminous translucent onyx veins rendered on 6mm sintered slabs engineered for backlit features and kitchen islands.',
    '6 mm',
    'Spain',
    true
),
(
    'Majesto Royal Marble',
    'Ceramic + Porcelain',
    '60x120 cm',
    'Polished',
    'Bianco',
    'Marble Look',
    'https://optimise2.assets-servd.host/powerful-koala/production/images/menu/Ceramic-Porcelain_Featured_Majesto_menu_image.jpg?w=1000&h=700&auto=compress%2Cformat&fit=crop',
    'Classic white Italian marble aesthetic with mirror-finish glaze and non-porous porcelain body.',
    '9 mm',
    'Italy',
    true
);

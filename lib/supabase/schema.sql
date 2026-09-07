-- ============================================================
-- SKEMA LENGKAP DATABASE PPM NURISBA APP (POSTGRESQL / SUPABASE)
-- ============================================================

-- 1. Mengaktifkan ekstensi pembuat ID unik acak (UUID)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABEL PROFILES (Profil User: Admin & Donatur)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    role VARCHAR(20) NOT NULL DEFAULT 'donor' CHECK (role IN ('admin', 'donor')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. TABEL CAMPAIGNS (Program Donasi & Wakaf)
CREATE TABLE IF NOT EXISTS public.campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    category VARCHAR(100) DEFAULT 'Wakaf Pembangunan',
    target_amount BIGINT NOT NULL CHECK (target_amount > 0),
    current_amount BIGINT NOT NULL DEFAULT 0 CHECK (current_amount >= 0),
    image_url TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'completed', 'archived')),
    start_date DATE DEFAULT CURRENT_DATE,
    end_date DATE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. TABEL DONATIONS (Niat & Komitmen Donasi)
CREATE TABLE IF NOT EXISTS public.donations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE RESTRICT,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    donor_name VARCHAR(255) DEFAULT 'Hamba Allah',
    donor_email VARCHAR(255),
    donor_phone VARCHAR(50),
    is_anonymous BOOLEAN DEFAULT false,
    amount BIGINT NOT NULL CHECK (amount > 0),
    message TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'expired', 'cancelled', 'refunded')),
    payment_method VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. TABEL PAYMENTS (Detail Transaksi Gateway / Transfer)
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    donation_id UUID NOT NULL REFERENCES public.donations(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL DEFAULT 'midtrans',
    order_id VARCHAR(100) UNIQUE NOT NULL,
    transaction_id VARCHAR(255),
    payment_type VARCHAR(100),
    gross_amount BIGINT NOT NULL CHECK (gross_amount > 0),
    status VARCHAR(30) NOT NULL DEFAULT 'pending',
    raw_status VARCHAR(50),
    fraud_status VARCHAR(50),
    settlement_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. TABEL FINANCIAL TRANSACTIONS (Buku Kas / Ledger Terverifikasi)
CREATE TABLE IF NOT EXISTS public.financial_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    donation_id UUID REFERENCES public.donations(id) ON DELETE SET NULL,
    campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE RESTRICT,
    type VARCHAR(30) NOT NULL CHECK (type IN ('income', 'expense', 'refund')),
    amount BIGINT NOT NULL CHECK (amount > 0),
    source VARCHAR(50) NOT NULL,
    reference VARCHAR(255),
    description TEXT,
    transaction_date TIMESTAMPTZ DEFAULT now(),
    verified_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 7. TABEL POSTS, EVENTS, GALLERY, TRANSPARENCY, AUDIT
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT,
    thumbnail_url TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMPTZ,
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    location VARCHAR(255),
    start_at TIMESTAMPTZ NOT NULL,
    end_at TIMESTAMPTZ,
    image_url TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    category VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.transparency_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    document_url TEXT,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. MEMASUKKAN DATA PROGRAM AWAL (SEED DATA)
INSERT INTO public.campaigns (
    title,
    slug,
    description,
    category,
    target_amount,
    current_amount,
    status
)
VALUES (
    'Pembangunan Masjid dan Ruang Kelas/Asrama PPM Nurul Ikhlas',
    'pembangunan-masjid-ruang-kelas-nurisba',
    'Pembangunan 1 unit masjid berukuran 10x10 meter dan 3 ruang kelas/asrama santri berukuran 8x10 meter di atas tanah wakaf aset Yayasan Nurul Ikhlas Soreang Bandung seluas 3.885 m².',
    'Wakaf',
    1203800000,
    0,
    'active'
)
ON CONFLICT (slug) DO NOTHING;

-- 9. MENGAKTIFKAN ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transparency_reports ENABLE ROW LEVEL SECURITY;

-- 10. KEBIJAKAN AKSES PUBLIK (RLS POLICIES)
CREATE POLICY "Public can view active campaigns" ON public.campaigns FOR SELECT USING (status = 'active');
CREATE POLICY "Public can insert donations" ON public.donations FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view published posts" ON public.posts FOR SELECT USING (status = 'published');
CREATE POLICY "Public can view published events" ON public.events FOR SELECT USING (status = 'published');
CREATE POLICY "Public can view gallery" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "Public can view published reports" ON public.transparency_reports FOR SELECT USING (published_at IS NOT NULL);
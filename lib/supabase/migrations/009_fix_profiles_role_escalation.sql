-- ============================================================
-- MIGRATION 009: FIX PROFILES ROLE ESCALATION VULNERABILITY
-- ============================================================
-- Problem: Current policy "Profiles self-read and admin all" uses
-- OR logic in WITH CHECK: user_id = auth.uid() OR public.is_admin()
-- This allows a donor to UPDATE their own profile and change
-- role from 'donor' to 'admin' — privilege escalation!
--
-- Fix: Separate the conditions:
--   - USING: controls who can access/read the profile
--   - WITH CHECK: controls what can be written, explicitly
--     prohibiting role changes by non-admin users
-- ============================================================

-- 1. Hapus policy lama yang berbahaya
DROP POLICY IF EXISTS "Profiles self-read and admin all" ON public.profiles;

-- 2. Buat policy SELECT: pengguna bisa baca profile sendiri
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT
  USING (user_id = auth.uid());

-- 3. Buat policy SELECT untuk admin: admin bisa baca semua profile
CREATE POLICY "Admin can view all profiles" ON public.profiles
  FOR SELECT
  USING (public.is_admin());

-- 4. Buat policy UPDATE: pengguna bisa UPDATE profile sendiri
--     tetapi TIDAK BOLEH mengubah field 'role'
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid() AND role = (SELECT role FROM public.profiles WHERE user_id = auth.uid()));

-- 5. Buat policy INSERT: hanya bisa insert dengan role DEFAULT 'donor'
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT
  WITH CHECK (user_id = auth.uid() AND role = 'donor');
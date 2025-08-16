-- Políticas para o bucket 'logos'
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('logos', 'logos', true, 5242880, ARRAY['image/*'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Políticas para o bucket 'login-images'
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('login-images', 'login-images', true, 10485760, ARRAY['image/*'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Políticas para o bucket 'cover-hero'
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('cover-hero', 'cover-hero', true, 10485760, ARRAY['image/*'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Políticas para o bucket 'ebook-covers'
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('ebook-covers', 'ebook-covers', true, 5242880, ARRAY['image/*', 'application/pdf'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Políticas para o bucket 'ebooks'
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('ebooks', 'ebooks', false, 104857600, ARRAY['application/pdf', 'application/epub+zip'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Políticas para o bucket 'uploads'
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('uploads', 'uploads', false, 10485760, ARRAY['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Políticas de acesso para logos (público)
CREATE POLICY "Logos são acessíveis publicamente" ON storage.objects
  FOR SELECT USING (bucket_id = 'logos');

CREATE POLICY "Apenas admins podem fazer upload de logos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'logos' AND 
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid()::text 
      AND users.role = 'ADMIN_MASTER'
    )
  );

-- Políticas de acesso para login-images (público)
CREATE POLICY "Login images são acessíveis publicamente" ON storage.objects
  FOR SELECT USING (bucket_id = 'login-images');

CREATE POLICY "Apenas admins podem fazer upload de login images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'login-images' AND 
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid()::text 
      AND users.role = 'ADMIN_MASTER'
    )
  );

-- Políticas de acesso para cover-hero (público)
CREATE POLICY "Cover hero images são acessíveis publicamente" ON storage.objects
  FOR SELECT USING (bucket_id = 'cover-hero');

CREATE POLICY "Apenas admins podem fazer upload de cover hero images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'cover-hero' AND 
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid()::text 
      AND users.role = 'ADMIN_MASTER'
    )
  );

-- Políticas de acesso para ebook-covers (público)
CREATE POLICY "Ebook covers são acessíveis publicamente" ON storage.objects
  FOR SELECT USING (bucket_id = 'ebook-covers');

CREATE POLICY "Apenas admins podem fazer upload de ebook covers" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'ebook-covers' AND 
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid()::text 
      AND users.role = 'ADMIN_MASTER'
    )
  );

-- Políticas de acesso para ebooks (privado)
CREATE POLICY "Usuários autenticados podem baixar ebooks" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'ebooks' AND 
    auth.role() = 'authenticated'
  );

CREATE POLICY "Apenas admins podem fazer upload de ebooks" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'ebooks' AND 
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid()::text 
      AND users.role = 'ADMIN_MASTER'
    )
  );

-- Políticas de acesso para uploads (privado)
CREATE POLICY "Apenas admins podem acessar uploads" ON storage.objects
  FOR ALL USING (
    bucket_id = 'uploads' AND 
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid()::text 
      AND users.role = 'ADMIN_MASTER'
    )
  );

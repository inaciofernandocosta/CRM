-- Permitir acesso público para visualizar imagens
CREATE POLICY "Give public access to product images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');

-- Permitir upload de imagens
CREATE POLICY "Allow public to upload images"
ON storage.objects FOR INSERT
TO public
WITH CHECK (
  bucket_id = 'product-images' AND
  (LOWER(RIGHT(name, 4)) = '.jpg' OR 
   LOWER(RIGHT(name, 4)) = '.png' OR 
   LOWER(RIGHT(name, 4)) = '.gif')
);

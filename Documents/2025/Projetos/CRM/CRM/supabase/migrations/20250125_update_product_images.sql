-- Atualizar URLs das imagens dos produtos
UPDATE products 
SET image_url = CASE name
    WHEN 'iPhone 15' THEN 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch_GEO_US?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1693009284541'
    WHEN 'MacBook Pro M3' THEN 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp-14-spacegray-select-202310?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1697311054290'
    WHEN 'iPad Pro' THEN 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-pro-model-select-gallery-1-202212?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1670887217055'
    WHEN 'AirPods Pro' THEN 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQD83?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1660803972361'
    WHEN 'Apple Watch Series 9' THEN 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/watch-s9-select-49mm-lineup-202309_GEO_BR?wid=1280&hei=492&fmt=jpeg&qlt=90&.v=1693598639539'
    WHEN 'iMac 24"' THEN 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/imac-24-blue-selection-hero-202310?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1697301183070'
    WHEN 'Mac Mini' THEN 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mac-mini-hero-202301?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1670038314708'
    WHEN 'Magic Keyboard' THEN 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MMMR3?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1645719947833'
    WHEN 'Magic Mouse' THEN 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MK2E3?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1628010471000'
    ELSE image_url
END,
updated_at = CURRENT_TIMESTAMP;

-- Verificar se as imagens foram atualizadas
SELECT name, image_url FROM products ORDER BY name;

-- Insert Products from catalog
INSERT IGNORE INTO products
(external_id, name, category, price, original_price, material, tag, description, image) VALUES

('ring_1', 'Ethereal Solitaire', 'Rings', 850, 1200, '18k Gold & Diamond', 'Sale', 'A timeless masterpiece featuring a brilliant-cut solitary diamond that captures and refracts light beautifully.', '/images/rings/ring_01.jpg'),
('ring_2', 'Celestial Rose Band', 'Rings', 640, NULL, 'Rose Gold & Morganite', 'Trending', 'Elegant rose band with a central morganite stone, reflecting celestial light with unmatched warmth.', '/images/rings/ring_02.jpg'),
('ring_3', 'Onyx Sovereign', 'Rings', 1100, NULL, 'Black Gold & Onyx', 'Exclusive', 'A powerful statement piece with a polished black onyx centerpiece set in dark metal for an unmistakable presence.', '/images/rings/ring_03.png'),
('ring_4', 'Moonlit Elegance', 'Rings', 720, NULL, 'White Gold & Pearl', 'Essential', 'Sophisticated ring combining the lustrous beauty of a pearl with refined white gold craftsmanship.', '/images/rings/ring_04.jpg'),
('ring_5', 'Emerald Enchantment', 'Rings', 960, 1350, 'Platinum & Emerald', 'Sale', 'Captivating ring featuring a vivid emerald stone set in luxurious platinum.', '/images/rings/ring_05.jpg'),

('ear_1', 'Aura Hoops', 'Earrings', 320, NULL, '14k Gold', 'Essential', 'Classic hoops with a polished, modern finish.', '/images/earrings/earring_01.png'),
('ear_2', 'Starlight Drops', 'Earrings', 720, NULL, '18k Gold & Diamond', 'Premium', 'Elegant drop earrings with sparkling diamond accents.', '/images/earrings/earring_02.jpg'),
('ear_3', 'Pearl Whispers', 'Earrings', 440, 650, 'White Gold & Pearl', 'Sale', 'Delicate earrings featuring lustrous freshwater pearls.', '/images/earrings/earring_03.jpg'),
('ear_4', 'Sapphire Bliss', 'Earrings', 580, NULL, 'Gold & Sapphire', 'Trending', 'Eye-catching earrings with brilliant sapphire stones.', '/images/earrings/earring_04.jpg'),

('nck_1', 'Golden Grace', 'Necklaces', 890, 1200, '18k Gold', 'Trending', 'Timeless gold necklace with intricate detailing and elegant simplicity.', '/images/necklaces/necklace_01.jpg'),
('nck_2', 'Diamond Cascade', 'Necklaces', 1450, 1900, 'Platinum & Diamond', 'Exclusive', 'Stunning multi-stone necklace with cascading diamonds.', '/images/necklaces/necklace_02.jpg'),
('nck_3', 'Sapphire Dreams', 'Necklaces', 780, NULL, 'White Gold & Sapphire', 'Premium', 'Elegant necklace featuring a deep blue sapphire centerpiece.', '/images/necklaces/necklace_03.jpg'),
('nck_4', 'Pearl Harmony', 'Necklaces', 520, 750, 'Gold & Pearl', 'Sale', 'Classic pearl necklace with timeless appeal and sophistication.', '/images/necklaces/necklace_04.jpg'),

('brc_1', 'Radiant Wrist', 'Bracelets', 640, 900, '18k Gold', 'Sale', 'Stunning gold bracelet with a radiant finish and comfortable fit.', '/images/bracelets/bracelet_01.jpg'),
('brc_2', 'Diamond Sparkle', 'Bracelets', 1100, NULL, 'Platinum & Diamond', 'Exclusive', 'Luxurious bracelet embellished with brilliant diamonds.', '/images/bracelets/bracelet_02.jpg'),
('brc_3', 'Emerald Embrace', 'Bracelets', 850, 1150, 'Gold & Emerald', 'Trending', 'Beautiful bracelet featuring vibrant emerald stones.', '/images/bracelets/bracelet_03.jpg'),
('brc_4', 'Ruby Passion', 'Bracelets', 920, NULL, 'White Gold & Ruby', 'Premium', 'Striking bracelet with deep red rubies in white gold.', '/images/bracelets/bracelet_04.jpg'),

('set_1', 'Royal Ensemble', 'Sets', 2400, 3200, '18k Gold & Diamond', 'Exclusive', 'Complete jewelry set including earrings, necklace, and bracelet.', '/images/sets/set_01.jpg'),
('set_2', 'Pearl Perfection', 'Sets', 1680, 2200, 'Gold & Pearl', 'Premium', 'Elegant three-piece set featuring lustrous pearls.', '/images/sets/set_02.jpg'),
('set_3', 'Emerald Garden', 'Sets', 1920, 2500, 'Gold & Emerald', 'Trending', 'Coordinated set with matching emerald accents.', '/images/sets/set_03.jpg'),
('set_4', 'Sapphire Romance', 'Sets', 2100, NULL, 'Platinum & Sapphire', 'Exclusive', 'Luxurious set with beautiful sapphire gemstones.', '/images/sets/set_04.jpg');

-- Insert default admin user (password: admin123 hashed with bcrypt)
INSERT IGNORE INTO admin (email, password)
VALUES ('admin@khalid-bijoux.com', '$2a$10$Jm5nRQzPEUwv3FJW.VpNkeLKj9z3xn6g/BJ9CnNdTQEKkpQ5V3Q4K');

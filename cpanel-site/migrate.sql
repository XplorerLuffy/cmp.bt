-- Run this ONCE in phpMyAdmin (database cmpbt_cmpbt) to upgrade the existing
-- products table for the new design. Safe to run on the data you already have.

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS ingredients TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS category VARCHAR(120) NOT NULL DEFAULT '';

CREATE TABLE IF NOT EXISTS contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(190) NOT NULL,
  email VARCHAR(190) NOT NULL,
  message TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

UPDATE products SET category = 'masala tea'      WHERE slug = 'masala-tea';
UPDATE products SET category = 'turmeric'        WHERE slug = 'turmeric-powder';
UPDATE products SET category = 'ginger'          WHERE slug = 'ginger-powder';
UPDATE products SET category = 'fireball'        WHERE slug = 'dalle-powder';
UPDATE products SET category = 'fireball'        WHERE slug = 'dalle-paste';
UPDATE products SET category = 'fireball'        WHERE slug = 'dalle-chutney';
UPDATE products SET category = 'chilli'          WHERE slug = 'green-chilli-pickle';
UPDATE products SET category = 'fireball'        WHERE slug = 'dalle-pickle';
UPDATE products SET category = 'red fireball'    WHERE slug = 'red-dalle-pickle';
UPDATE products SET category = 'Garlic Pickle'   WHERE slug = 'garlic-with-chilli-pickle';
UPDATE products SET category = 'Soup Mix'        WHERE slug = 'pumpkin-soup';
UPDATE products SET category = 'Soup Mix'        WHERE slug = 'oyster-mushroom-soup';
UPDATE products SET category = 'mix vegetables'  WHERE slug = 'mixed-vegetable-pickle';
UPDATE products SET category = 'Mango'           WHERE slug = 'mango-pickle';

UPDATE products SET ingredients = 'Garlic, Green Chilli, Oil, Mustard Seed, Black Salt powder, Salt, Fenugreek, Turmeric.' WHERE slug = 'garlic-with-chilli-pickle';
UPDATE products SET ingredients = 'Pumpkin powder, coriander leaves, onion leaves, garlic powder, Sichuan pepper, salt.'  WHERE slug = 'pumpkin-soup';
UPDATE products SET ingredients = 'Oyster Mushroom, Coriander leaves, Onion leaf, Salt, Garlic powder.'                    WHERE slug = 'oyster-mushroom-soup';

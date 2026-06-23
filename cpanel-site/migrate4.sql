-- Run ONCE in phpMyAdmin (database cmpbt_cmpbt) to seed default homepage
-- text so /admin/home has starting values. Safe to re-run.
-- (Not strictly required — the homepage falls back to these same defaults
-- in code even if this is skipped — but running it keeps the settings
-- table in sync with what's shown.)

INSERT IGNORE INTO settings (setting_key, setting_value) VALUES
('home_tagline', 'Handmade in Bhutan'),
('home_heading', 'Achaar, crafted under\na crystal moon.'),
('home_subtext', 'Small-batch Bhutanese pickles made with traditional family recipes, fresh local chilies, and a whole lot of patience.'),
('home_feature1_emoji', '🤲'),
('home_feature1_title', 'Handmade in Bhutan'),
('home_feature1_text', 'Every jar is made by hand using recipes passed down through generations.'),
('home_feature2_emoji', '🌿'),
('home_feature2_title', 'Fresh, Local Ingredients'),
('home_feature2_text', 'We source chilies, vegetables, and spices from local Bhutanese farmers.'),
('home_feature3_emoji', '🚚'),
('home_feature3_title', 'Delivered Across Bhutan'),
('home_feature3_text', 'Cash on delivery or bank transfer — order from anywhere in the country.');

-- Run ONCE in phpMyAdmin (database cmpbt_cmpbt) to enable editable
-- About & Contact pages from the admin panel. Safe to re-run.

CREATE TABLE IF NOT EXISTS settings (
  setting_key   VARCHAR(80) PRIMARY KEY,
  setting_value TEXT
);

-- Default content (INSERT IGNORE keeps any values you've already saved)
INSERT IGNORE INTO settings (setting_key, setting_value) VALUES
('about_title', 'Empowering women, supporting farmers, made in Bhutan.'),
('about_image', '/logo.png'),
('about_intro', 'Crystal Moon Products (CMP) Women and Youth Group was established in 2015 in Jigmeling, Sarpang, to create sustainable employment opportunities for disadvantaged women and unemployed youth. The group produces organic, value-added food products using locally sourced raw materials from farmers across Bhutan.\n\nCurrently employing seven women, CMP manufactures a range of products including pickles, pastes (Ezzays), spices, soups, and fruit powders. By adding value to local agricultural produce, the organization supports farmers, promotes local products, and contributes to income generation and economic development.'),
('about_commitment_title', 'Our Commitment'),
('about_commitment_text', 'With a growing distribution network across Bhutan, CMP is committed to delivering high-quality, affordable products while empowering women and youth through entrepreneurship and skill development.'),
('contact_phone', '+975 17 123 456'),
('contact_email', 'hello@cmp.bt'),
('contact_location', 'Thimphu, Bhutan');

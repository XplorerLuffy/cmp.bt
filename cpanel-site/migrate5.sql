-- Run ONCE in phpMyAdmin (database cmpbt_cmpbt) to add a wholesale price
-- field to products. Safe to re-run.
--
-- This price is admin-only (your own reference for quoting wholesalers by
-- phone/WhatsApp/email) — it is never shown on the public storefront.

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS wholesale_price INT DEFAULT NULL;

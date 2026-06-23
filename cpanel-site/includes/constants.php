<?php
const DZONGKHAGS = [
  'Thimphu', 'Paro', 'Punakha', 'Wangdue Phodrang', 'Chukha (Phuentsholing)',
  'Samtse', 'Haa', 'Bumthang', 'Trongsa', 'Mongar', 'Trashigang', 'Trashiyangtse',
  'Pemagatshel', 'Samdrup Jongkhar', 'Sarpang', 'Tsirang', 'Dagana', 'Zhemgang',
  'Lhuentse', 'Gasa',
];

const ORDER_STATUS_LABELS = [
  'PENDING_PAYMENT_VERIFICATION' => 'Pending Payment Verification',
  'CONFIRMED'                    => 'Confirmed',
  'PROCESSING'                   => 'Processing',
  'OUT_FOR_DELIVERY'             => 'Out for Delivery',
  'DELIVERED'                    => 'Delivered',
  'CANCELLED'                    => 'Cancelled',
];

const BANK_DETAILS = [
  'bankName'      => 'Bank of Bhutan Ltd.',
  'accountName'   => 'Crystal Moon Products',
  'accountNumber' => '1234567890123',
];

function generate_order_number(): string {
    return 'CMP-' . date('Ymd') . '-' . random_int(1000, 9999);
}

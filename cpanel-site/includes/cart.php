<?php
// Server-side cart stored in the PHP session.
// Structure: $_SESSION['cart'][productId] = [name, slug, price, image_url, quantity]

function cart_items(): array {
    return $_SESSION['cart'] ?? [];
}

function cart_add(array $item, int $qty = 1): void {
    if (!isset($_SESSION['cart'])) $_SESSION['cart'] = [];
    $id = $item['productId'];
    if (isset($_SESSION['cart'][$id])) {
        $_SESSION['cart'][$id]['quantity'] += $qty;
    } else {
        $_SESSION['cart'][$id] = [
            'name'      => $item['name'],
            'slug'      => $item['slug'],
            'price'     => (float)$item['price'],
            'image_url' => $item['image_url'] ?? null,
            'quantity'  => $qty,
        ];
    }
}

function cart_update(string $productId, int $qty): void {
    if ($qty <= 0) {
        cart_remove($productId);
    } elseif (isset($_SESSION['cart'][$productId])) {
        $_SESSION['cart'][$productId]['quantity'] = $qty;
    }
}

function cart_remove(string $productId): void {
    unset($_SESSION['cart'][$productId]);
}

function cart_clear(): void {
    $_SESSION['cart'] = [];
}

function cart_subtotal(): float {
    $sum = 0;
    foreach (cart_items() as $i) {
        $sum += $i['price'] * $i['quantity'];
    }
    return $sum;
}

function cart_count(): int {
    $n = 0;
    foreach (cart_items() as $i) {
        $n += $i['quantity'];
    }
    return $n;
}

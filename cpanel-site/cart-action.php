<?php
require __DIR__ . '/includes/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    redirect('/cart');
}

$action = $_POST['action'] ?? '';
$db = get_db();

switch ($action) {
    case 'add':
    case 'buy':
        $productId = $_POST['product_id'] ?? '';
        $qty = max(1, (int)($_POST['quantity'] ?? 1));
        $stmt = $db->prepare("SELECT id, slug, name, price, image_url, out_of_stock FROM products WHERE id = ? AND is_active = 1 LIMIT 1");
        $stmt->bind_param('s', $productId);
        $stmt->execute();
        $p = $stmt->get_result()->fetch_assoc();
        if ($p && !$p['out_of_stock']) {
            cart_add([
                'productId' => $p['id'],
                'slug'      => $p['slug'],
                'name'      => $p['name'],
                'price'     => $p['price'],
                'image_url' => $p['image_url'],
            ], $qty);
        }
        redirect($action === 'buy' ? '/cart' : ($_POST['return'] ?? '/products'));
        break;

    case 'update':
        cart_update($_POST['product_id'] ?? '', (int)($_POST['quantity'] ?? 0));
        redirect('/cart');
        break;

    case 'remove':
        cart_remove($_POST['product_id'] ?? '');
        redirect('/cart');
        break;

    case 'clear':
        cart_clear();
        redirect('/cart');
        break;

    default:
        redirect('/cart');
}

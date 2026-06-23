<?php
require __DIR__ . '/../includes/bootstrap.php';
require __DIR__ . '/../includes/admin-auth.php';

if (admin_logged_in()) redirect('/admin');
if (admin_count() === 0) redirect('/admin/setup');

$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = strtolower(trim($_POST['email'] ?? ''));
    $password = $_POST['password'] ?? '';
    $db = get_db();
    $stmt = $db->prepare("SELECT id, password_hash FROM admins WHERE email = ? LIMIT 1");
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $admin = $stmt->get_result()->fetch_assoc();
    if ($admin && password_verify($password, $admin['password_hash'])) {
        $_SESSION['admin_id'] = $admin['id'];
        redirect('/admin');
    }
    $error = 'Invalid email or password.';
}
?>
<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Admin Login | Crystal Moon</title>
<script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="flex min-h-screen items-center justify-center bg-[#0a0f1c] p-4">
  <form method="post" class="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
    <img src="/logo.png" alt="logo" class="mx-auto mb-3 h-14 w-14 rounded-full object-contain">
    <h1 class="mb-5 text-center text-xl font-bold text-[#0a0a0a]">Admin Login</h1>
    <?php if ($error): ?><p class="mb-3 rounded-lg bg-red-50 p-2 text-sm text-red-600"><?= htmlspecialchars($error) ?></p><?php endif; ?>
    <label class="mb-1 block text-sm font-medium">Email</label>
    <input name="email" type="email" required class="mb-4 w-full rounded-lg border border-black/15 p-2.5">
    <label class="mb-1 block text-sm font-medium">Password</label>
    <input name="password" type="password" required class="mb-5 w-full rounded-lg border border-black/15 p-2.5">
    <button class="w-full rounded-full bg-[#3b82f6] py-3 font-semibold text-white hover:bg-[#1d4ed8]">Log In</button>
  </form>
</body></html>

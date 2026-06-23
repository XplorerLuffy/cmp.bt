<?php
require __DIR__ . '/../includes/bootstrap.php';
require __DIR__ . '/../includes/admin-auth.php';

// One-time setup: only works while no admin account exists.
if (admin_count() > 0) {
    redirect('/admin/login');
}

$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = strtolower(trim($_POST['email'] ?? ''));
    $password = $_POST['password'] ?? '';
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = 'Please enter a valid email.';
    } elseif (strlen($password) < 8) {
        $error = 'Password must be at least 8 characters.';
    } else {
        $hash = password_hash($password, PASSWORD_DEFAULT);
        $db = get_db();
        $stmt = $db->prepare("INSERT INTO admins (email, password_hash) VALUES (?, ?)");
        $stmt->bind_param('ss', $email, $hash);
        $stmt->execute();
        $_SESSION['admin_id'] = $db->insert_id;
        redirect('/admin');
    }
}
?>
<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Admin Setup | Crystal Moon</title>
<script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="flex min-h-screen items-center justify-center bg-[#0a0f1c] p-4">
  <form method="post" class="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
    <img src="/logo.png" alt="logo" class="mx-auto mb-3 h-14 w-14 rounded-full object-contain">
    <h1 class="text-center text-xl font-bold text-[#0a0a0a]">Create Admin Account</h1>
    <p class="mb-5 mt-1 text-center text-sm text-black/50">This page only works once. Set your login.</p>
    <?php if ($error): ?><p class="mb-3 rounded-lg bg-red-50 p-2 text-sm text-red-600"><?= htmlspecialchars($error) ?></p><?php endif; ?>
    <label class="mb-1 block text-sm font-medium">Email</label>
    <input name="email" type="email" required class="mb-4 w-full rounded-lg border border-black/15 p-2.5">
    <label class="mb-1 block text-sm font-medium">Password (min 8 chars)</label>
    <input name="password" type="password" required class="mb-5 w-full rounded-lg border border-black/15 p-2.5">
    <button class="w-full rounded-full bg-[#3b82f6] py-3 font-semibold text-white hover:bg-[#1d4ed8]">Create Account</button>
  </form>
</body></html>

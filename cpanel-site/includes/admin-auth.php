<?php
// Admin authentication helpers (session-based). Requires bootstrap loaded first.

function admin_logged_in(): bool {
    return !empty($_SESSION['admin_id']);
}

function require_admin(): void {
    if (!admin_logged_in()) {
        redirect('/cmp/login');
    }
}

function admin_count(): int {
    $res = get_db()->query("SELECT COUNT(*) AS c FROM admins");
    return (int)($res->fetch_assoc()['c'] ?? 0);
}

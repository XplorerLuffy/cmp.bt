<?php
// Shared bootstrap: starts the session, loads DB config + helpers.
// Every page requires this first (before any HTML output).

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once __DIR__ . '/../config.php';   // DB credentials + get_db() + format_btn()
require_once __DIR__ . '/cart.php';        // session cart helpers
require_once __DIR__ . '/settings.php';    // editable site content (about/contact)

// Small unique id generator (cuid-ish) for orders.
function gen_id(): string {
    return bin2hex(random_bytes(16));
}

function redirect(string $to): void {
    header('Location: ' . $to);
    exit;
}

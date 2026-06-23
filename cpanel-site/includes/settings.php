<?php
// Editable site content stored in the `settings` table (key/value).

function all_settings(): array {
    static $cache = null;
    if ($cache !== null) return $cache;
    $cache = [];
    $db = get_db();
    if ($res = @$db->query("SELECT setting_key, setting_value FROM settings")) {
        while ($row = $res->fetch_assoc()) {
            $cache[$row['setting_key']] = $row['setting_value'];
        }
    }
    return $cache;
}

function get_setting(string $key, string $default = ''): string {
    $s = all_settings();
    return $s[$key] ?? $default;
}

function set_setting(string $key, string $value): void {
    $db = get_db();
    $stmt = $db->prepare("INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)");
    $stmt->bind_param('ss', $key, $value);
    $stmt->execute();
}

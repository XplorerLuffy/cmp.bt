<?php
// Fill these in with the database details from cPanel > MySQL Databases.
define('DB_HOST', 'localhost');
define('DB_NAME', 'yourcpaneluser_cmpbt');
define('DB_USER', 'yourcpaneluser_dbuser');
define('DB_PASS', 'your-db-password');

function get_db(): mysqli {
    static $conn = null;
    if ($conn === null) {
        $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
        if ($conn->connect_error) {
            http_response_code(500);
            die('Database connection failed: ' . htmlspecialchars($conn->connect_error));
        }
        $conn->set_charset('utf8mb4');
    }
    return $conn;
}

function format_btn(float $amount): string {
    return 'Nu. ' . number_format($amount, 0);
}

<?php
session_start();
require 'vendor/autoload.php'; // Adjust the path if necessary

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "nutritrack";
$port = 3307; // Adjust if your MySQL server runs on a different port

$conn = new mysqli($servername, $username, $password, $dbname, $port);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['token'])) {
    $token = $conn->real_escape_string($_GET['token']);

    // Validate the token
    $stmt = $conn->prepare("SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > NOW()");
    $stmt->bind_param("s", $token);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // Token is valid, show reset form (HTML form for new password)
        echo '<form action="" method="POST">
                <input type="hidden" name="token" value="' . htmlspecialchars($token) . '">
                <label for="new_password">New Password:</label>
                <input type="password" name="new_password" required>
                <button type="submit">Reset Password</button>
              </form>';
    } else {
        echo "Invalid or expired token.";
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['token']) && isset($_POST['new_password'])) {
    $token = $conn->real_escape_string($_POST['token']);
    $new_password = password_hash($conn->real_escape_string($_POST['new_password']), PASSWORD_BCRYPT);

    // Update password
    $stmt = $conn->prepare("UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE reset_token = ?");
    $stmt->bind_param("ss", $new_password, $token);

    if ($stmt->execute()) {
        echo "Password has been reset successfully.";
    } else {
        echo "Error updating password: " . $stmt->error;
    }
}

// Close connection
$conn->close();
?>

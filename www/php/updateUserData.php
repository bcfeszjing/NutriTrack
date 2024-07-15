<?php
session_start();

// Database connection details
$servername = "localhost";
$usernameDB = "root";
$passwordDB = "";
$dbname = "nutritrack";
$port = 3306;

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'User not logged in']);
    exit();
}

// Create connection
$conn = new mysqli($servername, $usernameDB, $passwordDB, $dbname, $port);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get input data
$input = json_decode(file_get_contents('php://input'), true);
$field = $input['field'];
$value = $input['value'];
$userId = $_SESSION['user_id'];

// Sanitize input
$field = htmlspecialchars(strip_tags($field));
$value = htmlspecialchars(strip_tags($value));

// Hash password if the field is password
if ($field === 'password') {
    $value = password_hash($value, PASSWORD_DEFAULT);
}

// Prepare SQL statement to update user data
$sql = "UPDATE users SET $field=? WHERE id=?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("si", $value, $userId);

// Execute statement
if ($stmt->execute()) {
    echo json_encode(array("success" => "User data updated successfully"));
} else {
    echo json_encode(array("error" => "Failed to update user data"));
}

// Close statement and connection
$stmt->close();
$conn->close();
?>

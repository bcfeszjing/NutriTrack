<?php
session_start();

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'User not logged in', 'session' => $_SESSION]);
    exit();
}

$servername = "localhost";
$usernameDB = "root";
$passwordDB = "";
$dbname = "nutritrack";
$port = 3306;

$conn = new mysqli($servername, $usernameDB, $passwordDB, $dbname, $port);

if ($conn->connect_error) {
    die(json_encode(['error' => 'Connection failed: ' . $conn->connect_error]));
}

$userId = $_SESSION['user_id'];
$sql = "SELECT username, email FROM users WHERE id=?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $userData = $result->fetch_assoc();
    $userData['passwordLength'] = $_SESSION['password_length']; // Get password length from session
    $userData['originalPassword'] = $_SESSION['original_password']; // Get original password from session
    echo json_encode($userData);
} else {
    echo json_encode(['error' => 'User not found', 'userId' => $userId]);
}

$stmt->close();
$conn->close();
?>

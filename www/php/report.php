<?php
session_start();
header('Content-Type: application/json');

// Database connection details
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "nutritrack";
$port = 3307;

// Create a connection
$conn = new mysqli($servername, $username, $password, $dbname, $port);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get the period from the request
$period = isset($_GET['period']) ? $_GET['period'] : 'thisWeek';

// Define the date range based on the period
switch ($period) {
    case 'today':
        $startDate = date('Y-m-d');
        $endDate = $startDate;
        break;
    case 'yesterday':
        $startDate = date('Y-m-d', strtotime('-1 day'));
        $endDate = $startDate;
        break;
    case 'thisWeek':
        $startDate = date('Y-m-d', strtotime('monday this week'));
        $endDate = date('Y-m-d', strtotime('sunday this week'));
        break;
    case 'lastWeek':
        $startDate = date('Y-m-d', strtotime('monday last week'));
        $endDate = date('Y-m-d', strtotime('sunday last week'));
        break;
    default:
        $startDate = date('Y-m-d');
        $endDate = $startDate;
        break;
}

// Prepare the SQL statement
$sql = "SELECT category, date, food_name, serving_size, calories FROM user_food_entries 
        WHERE date BETWEEN ? AND ?";

// Prepare and execute the query
$stmt = $conn->prepare($sql);
$stmt->bind_param('ss', $startDate, $endDate);
$stmt->execute();
$result = $stmt->get_result();

// Fetch all rows
$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

// Close connections
$stmt->close();
$conn->close();

// Output the data in JSON format
echo json_encode($data);
?>

<?php
session_start(); // Start session for storing messages (optional)

require 'vendor/autoload.php';

use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "nutritrack";
$port = 3306; // Adjust if your MySQL server runs on a different port

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname, $port);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $conn->real_escape_string($_POST['email']);

    // Validate email format (optional)
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "Invalid email format";
        exit; // Stop further execution if email format is invalid
    }

    // Check if email exists in database using prepared statement
    $check_sql = "SELECT * FROM users WHERE email = ?";
    $stmt = $conn->prepare($check_sql);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // Generate a unique token (a random string or hash)
        $token = bin2hex(random_bytes(32)); // Generate a 32-character hexadecimal token

        // Set token expiration (e.g., 12 hour from now)
        $expires = date('Y-m-d H:i:s', strtotime('+12 hour'));

        // Update token in the database using prepared statement
        $update_sql = "UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE email = ?";
        $stmt = $conn->prepare($update_sql);
        $stmt->bind_param("sss", $token, $expires, $email);

        if ($stmt->execute()) {
            // Generate reset link
            $reset_link = "http://localhost/NutriTrack/NutriTrack/www/php/resetPassword.php?token=$token";

            // Send email using Elastic Email API
            $apiKey = '5C12CA309D6D39028C0D41CAEF50C396C18706A1B5021D286669F4B246BEC585A4CF59BFA899B8561F6A5A4F0784D7EF';
            $url = 'https://api.elasticemail.com/v2/email/send';

            $client = new Client();

            try {
                // Prepare email parameters
                $response = $client->request('POST', $url, [
                    'form_params' => [
                        'apikey'    => $apiKey,
                        'from'      => 'pingsengpoh@gmail.com',
                        'to'        => $email,
                        'subject'   => 'Password Reset Request',
                        'bodyHtml'  => "Hi,<br><br>We received a request to reset your password. Click the link below to reset your password:<br><a href='$reset_link'>$reset_link</a><br><br>If you didn't request this, you can ignore this email.<br><br>Thanks!",
                    ]
                ]);

                $responseBody = json_decode($response->getBody(), true);

                if ($response->getStatusCode() === 200 && $responseBody['success']) {
                    echo "Password reset instructions sent to your email.";
                } else {
                    echo "Failed to send password reset instructions. Please try again later. API response: " . print_r($responseBody, true);
                }
            } catch (RequestException $e) {
                echo 'Exception when calling Elastic Email API: ' . $e->getMessage();
                if ($e->hasResponse()) {
                    echo 'API Response: ' . $e->getResponse()->getBody()->getContents();
                }
            }
        } else {
            echo "Error updating record: " . $stmt->error;
        }
    } else {
        echo "No user found with that email.";
    }

    // Close statement
    $stmt->close();
}

// Close connection
$conn->close();
?>

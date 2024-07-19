-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3307
-- Generation Time: Jul 19, 2024 at 03:51 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `nutritrack`
--

-- --------------------------------------------------------

--
-- Table structure for table `rdi`
--

CREATE TABLE `rdi` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `rdi` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rdi`
--

INSERT INTO `rdi` (`id`, `user_id`, `rdi`, `created_at`) VALUES
(1, 9, 2711, '2024-07-19 12:48:35');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `reset_token` varchar(64) DEFAULT NULL,
  `reset_token_expires` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `age` int(11) DEFAULT NULL,
  `gender` enum('Male','Female','Other') DEFAULT NULL,
  `weight` float DEFAULT NULL,
  `height` float DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `profile_picture` longblob DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `reset_token`, `reset_token_expires`, `created_at`, `age`, `gender`, `weight`, `height`, `birth_date`, `profile_picture`) VALUES
(2, 'pohpingseng1', 'Pp3ng1073@gmail.com', '$2y$10$CU0gKonti6jcp3epX.TQyOTeHXhzJrWy7bYDRVWmP0SBCvg5Mstiq', NULL, NULL, '2024-07-18 01:28:18', 1, 'Male', 66, 180, '2024-07-20', NULL);
INSERT INTO `users` (`id`, `username`, `email`, `password`, `reset_token`, `reset_token_expires`, `created_at`, `age`, `gender`, `weight`, `height`, `birth_date`, `profile_picture`) VALUES
INSERT INTO `users` (`id`, `username`, `email`, `password`, `reset_token`, `reset_token_expires`, `created_at`, `age`, `gender`, `weight`, `height`, `birth_date`, `profile_picture`) VALUES
(8, 'Shaka', '02cheeyoongng@gmail.com', '$2y$10$.cu6gfOLtmmoO46L.ltLUeY27uixWMUu.8fErpa2yt3buxa75Em.a', NULL, NULL, '2024-07-18 14:35:13', NULL, NULL, NULL, NULL, NULL, NULL),
(9, 'pohpingseng', 'pingsengpoh@gmail.com', '$2y$10$xjsPmhbJKIqDOUXva0MrEuOGlSClt72Qle5ii36twWJ57N3OYdUse', NULL, NULL, '2024-07-19 01:17:11', 23, 'Male', 70, 190, '2000-08-09', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_food_entries`
--

CREATE TABLE `user_food_entries` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `food_name` varchar(255) DEFAULT NULL,
  `serving_size` int(11) DEFAULT NULL,
  `calories` decimal(10,2) DEFAULT NULL,
  `protein` decimal(10,2) DEFAULT NULL,
  `fat` decimal(10,2) DEFAULT NULL,
  `fiber` decimal(10,2) DEFAULT NULL,
  `sugar` decimal(10,2) DEFAULT NULL,
  `carbs` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_food_entries`
--

INSERT INTO `user_food_entries` (`id`, `user_id`, `category`, `date`, `food_name`, `serving_size`, `calories`, `protein`, `fat`, `fiber`, `sugar`, `carbs`) VALUES
(4, 9, 'lunch', '2024-07-19', 'burger', 100, 237.70, 15.20, 11.50, 0.00, 0.00, 18.10),
(5, 9, 'lunch', '2024-07-19', 'coke', 75, 29.50, 0.00, 0.00, 0.00, 8.20, 8.10),
(6, 9, 'breakfast', '2024-07-19', 'fries', 100, 317.70, 3.40, 14.80, 3.80, 0.30, 41.10),
(7, 9, 'dinner', '2024-07-19', 'spaghetti', 200, 308.20, 10.70, 1.20, 2.60, 2.20, 61.20),
(8, 9, 'snack', '2024-07-19', 'carrot cake', 50, 167.40, 1.90, 8.50, 0.50, 14.80, 21.10),
(9, 9, 'breakfast', '2024-07-19', 'burger', 70, 166.40, 10.70, 8.10, 0.00, 0.00, 12.70),
(10, 9, 'breakfast', '2024-07-12', 'pizza', 80, 210.30, 9.10, 7.80, 1.80, 2.80, 26.30),
(11, 9, 'lunch', '2024-07-18', 'rice', 200, 254.80, 5.30, 0.60, 0.80, 0.10, 56.90),
(12, 9, 'breakfast', '2024-07-20', 'bread', 40, 104.60, 3.50, 1.40, 1.10, 2.30, 20.10);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `rdi`
--
ALTER TABLE `rdi`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `user_food_entries`
--
ALTER TABLE `user_food_entries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `rdi`
--
ALTER TABLE `rdi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `user_food_entries`
--
ALTER TABLE `user_food_entries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `rdi`
--
ALTER TABLE `rdi`
  ADD CONSTRAINT `rdi_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_food_entries`
--
ALTER TABLE `user_food_entries`
  ADD CONSTRAINT `user_food_entries_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
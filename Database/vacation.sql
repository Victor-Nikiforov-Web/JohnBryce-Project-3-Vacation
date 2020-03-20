-- phpMyAdmin SQL Dump
-- version 5.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 20, 2020 at 01:10 PM
-- Server version: 10.4.11-MariaDB
-- PHP Version: 7.4.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `vacation`
--
CREATE DATABASE IF NOT EXISTS `vacation` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `vacation`;

-- --------------------------------------------------------

--
-- Table structure for table `savedvacations`
--

CREATE TABLE `savedvacations` (
  `userID` int(11) NOT NULL,
  `vacationID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `savedvacations`
--

INSERT INTO `savedvacations` (`userID`, `vacationID`) VALUES
(46, 5),
(46, 4),
(47, 6),
(47, 3),
(48, 1),
(48, 2),
(47, 1),
(47, 2),
(47, 4),
(48, 3),
(38, 2);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `userID` int(11) NOT NULL,
  `firstName` varchar(30) NOT NULL,
  `lastName` varchar(30) NOT NULL,
  `userName` varchar(30) NOT NULL,
  `password` varchar(30) NOT NULL,
  `isAdmin` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userID`, `firstName`, `lastName`, `userName`, `password`, `isAdmin`) VALUES
(37, 'Admin', 'Admin', 'Admin', 'admin', 1),
(38, 'test', 'test', 'test', 'test', 0),
(46, 'user', 'user', 'user', 'user', 0),
(47, 'user1', 'user1', 'user1', 'user1', 0),
(48, 'user2', 'user2', 'user2', 'user2', 0);

-- --------------------------------------------------------

--
-- Table structure for table `vacations`
--

CREATE TABLE `vacations` (
  `vacationID` int(11) NOT NULL,
  `description` varchar(300) NOT NULL,
  `destination` varchar(50) NOT NULL,
  `image` varchar(500) NOT NULL,
  `fromDate` date NOT NULL,
  `toDate` date NOT NULL,
  `price` decimal(10,0) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `vacations`
--

INSERT INTO `vacations` (`vacationID`, `description`, `destination`, `image`, `fromDate`, `toDate`, `price`) VALUES
(1, 'Set in the heart of Miami Beach in the popular Mid-Beach area, this resort offers a tropical escape amidst all the hustle and bustle. Inspired by nature, this oceanfront sanctuary emphasizes health and total wellness through natural gourmet dining and Aveda spa rituals while green practices and envi', 'Miami: The Palms Hotel', '1.jpg', '2020-04-23', '2020-04-30', '450'),
(2, 'Located just a few miles from the fishing village of Kailua-Kona, this intimate oceanfront one- and two-bedroom condominium resort offers the simplicity and comfort of \"home away from home\".\r\n\r\n', 'Hawaii Island - Aston Kona', '2.jpg', '2020-05-13', '2020-05-16', '800'),
(3, 'Inspired by the vibrant culture of Guanacaste, this eclectic resort boasts a bold design and exemplifies the best of Tico culture. Guests can start the day at Zona Azul Beach Club enjoying the white sands of Playa Conchal and end it experiencing the amazing sunsets in the Living Room imbibing craft ', 'Costa Rica', '3.jpg', '2020-06-10', '2020-06-15', '899'),
(4, 'Set beachfront in the lively hotel zone, this all-inclusive resort features three pools, including one for kids, a selection of restaurants, a kids’ club, and a small, relaxing spa.\r\n\r\n', 'Mexico -Omni Cancun', '4.jpg', '2020-05-06', '2020-05-12', '1300'),
(5, 'If you enjoy eating like royalty, gambling in style and taking in world-class entertainment, this all-suite hotel might be an excellent bet for your next Las Vegas holiday.', 'Las Vegas - The Venetian', '5.jpg', '2020-04-26', '2020-04-30', '1800'),
(6, 'Le Taha’a Island Resort & Spa is accessible by a 35-minute boat ride from the Raiatea airport, and is a five-minute shuttle ride from the main island of Taha’a. Le Taha’a is a member of the exclusive Relais & Châteaux hotel collection. The St. Regis Bora Bora Resort sets a new standard for luxury in', 'Tahiti - Bora Bora ', '6.jpg', '2020-07-02', '2020-07-15', '2499');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `savedvacations`
--
ALTER TABLE `savedvacations`
  ADD KEY `userID` (`userID`),
  ADD KEY `vacationID` (`vacationID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userID`);

--
-- Indexes for table `vacations`
--
ALTER TABLE `vacations`
  ADD PRIMARY KEY (`vacationID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT for table `vacations`
--
ALTER TABLE `vacations`
  MODIFY `vacationID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `savedvacations`
--
ALTER TABLE `savedvacations`
  ADD CONSTRAINT `savedvacations_ibfk_1` FOREIGN KEY (`vacationID`) REFERENCES `vacations` (`vacationID`) ON DELETE CASCADE,
  ADD CONSTRAINT `savedvacations_ibfk_2` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

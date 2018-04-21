-- phpMyAdmin SQL Dump
-- version 5.0.0-dev
-- https://www.phpmyadmin.net/
--
-- Host: 192.168.30.23
-- Generation Time: Apr 21, 2018 at 04:36 PM
-- Server version: 8.0.3-rc-log
-- PHP Version: 7.2.4-1+0~20180405085422.20+stretch~1.gbpbff9f0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `CompanyStatistics`
--

-- --------------------------------------------------------

--
-- Table structure for table `Finances`
--

CREATE TABLE `Finances` (
  `Year` year(4) NOT NULL,
  `Income` int(11) NOT NULL COMMENT 'In £',
  `Expenses` int(11) NOT NULL COMMENT 'In £'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `Finances`
--

INSERT INTO `Finances` (`Year`, `Income`, `Expenses`) VALUES
(2017, 1795567, 1694264),
(2016, 1249493, 1164932);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

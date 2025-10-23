CREATE DATABASE  IF NOT EXISTS `cmsdb` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `cmsdb`;
-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: cmsdb
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `acceptanceletters`
--

DROP TABLE IF EXISTS `acceptanceletters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `acceptanceletters` (
  `LetterID` int NOT NULL AUTO_INCREMENT,
  `PaperID` int NOT NULL,
  `Decision` enum('Accepted','Rejected') NOT NULL,
  `SentDate` date DEFAULT NULL,
  `Message` text,
  PRIMARY KEY (`LetterID`),
  KEY `PaperID` (`PaperID`),
  CONSTRAINT `acceptanceletters_ibfk_1` FOREIGN KEY (`PaperID`) REFERENCES `papers` (`PaperID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `acceptanceletters`
--

LOCK TABLES `acceptanceletters` WRITE;
/*!40000 ALTER TABLE `acceptanceletters` DISABLE KEYS */;
INSERT INTO `acceptanceletters` VALUES (1,3,'Accepted','2025-10-18','Congratulations! Your paper has been accepted for presentation.'),(2,1,'Rejected','2025-10-19','We appreciate your submission, but your paper was not selected for this conference.'),(3,2,'Accepted','2025-10-20','Your paper has been accepted after a successful peer review process.'),(4,3,'Accepted','2025-10-18','Congratulations! Your paper has been accepted for presentation.'),(5,1,'Rejected','2025-10-19','We appreciate your submission, but your paper was not selected for this conference.'),(6,2,'Accepted','2025-10-20','Your paper has been accepted after a successful peer review process.'),(7,3,'Accepted','2025-10-18','Congratulations! Your paper has been accepted for presentation.'),(8,1,'Rejected','2025-10-19','We appreciate your submission, but your paper was not selected for this conference.'),(9,2,'Accepted','2025-10-20','Your paper has been accepted after a successful peer review process.');
/*!40000 ALTER TABLE `acceptanceletters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `registration_payments`
--

DROP TABLE IF EXISTS `registration_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `registration_payments` (
  `PaymentID` int NOT NULL AUTO_INCREMENT,
  `RegistrationID` int NOT NULL,
  `Amount` decimal(10,2) NOT NULL,
  `PaymentDate` date NOT NULL,
  `PaymentMethod` enum('CreditCard','BankTransfer','E-Wallet') NOT NULL,
  `Status` enum('Paid','Pending','Failed') DEFAULT 'Pending',
  PRIMARY KEY (`PaymentID`),
  KEY `RegistrationID` (`RegistrationID`),
  CONSTRAINT `registration_payments_ibfk_1` FOREIGN KEY (`RegistrationID`) REFERENCES `registrations` (`RegistrationID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `registration_payments`
--

LOCK TABLES `registration_payments` WRITE;
/*!40000 ALTER TABLE `registration_payments` DISABLE KEYS */;
INSERT INTO `registration_payments` VALUES (1,1,300.00,'2025-10-10','CreditCard','Paid'),(2,2,500.00,'2025-10-11','BankTransfer','Pending'),(3,3,150.00,'2025-10-12','E-Wallet','Paid'),(4,4,400.00,'2025-10-13','CreditCard','Paid'),(5,5,150.00,'2025-10-14','BankTransfer','Pending'),(6,1,300.00,'2025-10-10','CreditCard','Paid'),(7,2,500.00,'2025-10-11','BankTransfer','Pending'),(8,3,150.00,'2025-10-12','E-Wallet','Paid'),(9,4,400.00,'2025-10-13','CreditCard','Paid'),(10,5,150.00,'2025-10-14','BankTransfer','Pending'),(11,1,300.00,'2025-10-10','CreditCard','Paid'),(12,2,500.00,'2025-10-11','BankTransfer','Pending'),(13,3,150.00,'2025-10-12','E-Wallet','Paid'),(14,4,400.00,'2025-10-13','CreditCard','Paid'),(15,5,150.00,'2025-10-14','BankTransfer','Pending');
/*!40000 ALTER TABLE `registration_payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schedules`
--

DROP TABLE IF EXISTS `schedules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schedules` (
  `ScheduleID` int NOT NULL AUTO_INCREMENT,
  `SessionName` varchar(100) DEFAULT NULL,
  `Date` date DEFAULT NULL,
  `Time` time DEFAULT NULL,
  `Venue` varchar(100) DEFAULT NULL,
  `PaperID` int DEFAULT NULL,
  `PresenterID` int DEFAULT NULL,
  PRIMARY KEY (`ScheduleID`),
  KEY `PaperID` (`PaperID`),
  KEY `PresenterID` (`PresenterID`),
  CONSTRAINT `schedules_ibfk_1` FOREIGN KEY (`PaperID`) REFERENCES `papers` (`PaperID`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `schedules_ibfk_2` FOREIGN KEY (`PresenterID`) REFERENCES `users` (`UserID`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schedules`
--

LOCK TABLES `schedules` WRITE;
/*!40000 ALTER TABLE `schedules` DISABLE KEYS */;
INSERT INTO `schedules` VALUES (1,'AI in Education','2025-11-01','09:00:00','Hall A',1,2),(2,'Green Energy Solutions','2025-11-01','11:00:00','Hall B',2,5),(3,'Cybersecurity Awareness','2025-11-02','10:00:00','Hall C',3,2),(4,'AI in Education','2025-11-01','09:00:00','Hall A',1,2),(5,'Green Energy Solutions','2025-11-01','11:00:00','Hall B',2,5),(6,'Cybersecurity Awareness','2025-11-02','10:00:00','Hall C',3,2),(7,'AI in Education','2025-11-01','09:00:00','Hall A',1,2),(8,'Green Energy Solutions','2025-11-01','11:00:00','Hall B',2,5),(9,'Cybersecurity Awareness','2025-11-02','10:00:00','Hall C',3,2);
/*!40000 ALTER TABLE `schedules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `submission_payments`
--

DROP TABLE IF EXISTS `submission_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `submission_payments` (
  `SubmissionPaymentID` int NOT NULL AUTO_INCREMENT,
  `PaperID` int DEFAULT NULL,
  `Amount` decimal(10,2) NOT NULL,
  `PaymentDate` date NOT NULL,
  `PaymentMethod` enum('CreditCard','BankTransfer','E-Wallet') NOT NULL,
  `Status` enum('Paid','Pending','Failed') DEFAULT 'Pending',
  PRIMARY KEY (`SubmissionPaymentID`),
  KEY `PaperID` (`PaperID`),
  CONSTRAINT `submission_payments_ibfk_1` FOREIGN KEY (`PaperID`) REFERENCES `papers` (`PaperID`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `submission_payments`
--

LOCK TABLES `submission_payments` WRITE;
/*!40000 ALTER TABLE `submission_payments` DISABLE KEYS */;
INSERT INTO `submission_payments` VALUES (1,1,100.00,'2025-10-09','CreditCard','Paid'),(2,2,100.00,'2025-10-10','BankTransfer','Paid'),(3,3,100.00,'2025-10-11','E-Wallet','Paid'),(4,1,100.00,'2025-10-09','CreditCard','Paid'),(5,2,100.00,'2025-10-10','BankTransfer','Paid'),(6,3,100.00,'2025-10-11','E-Wallet','Paid'),(7,1,100.00,'2025-10-09','CreditCard','Paid'),(8,2,100.00,'2025-10-10','BankTransfer','Paid'),(9,3,100.00,'2025-10-11','E-Wallet','Paid');
/*!40000 ALTER TABLE `submission_payments` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-23 21:51:18

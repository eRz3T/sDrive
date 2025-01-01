-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: sdrive_logins
-- ------------------------------------------------------
-- Server version	8.0.40

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
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id_users` int NOT NULL AUTO_INCREMENT,
  `email_users` varchar(100) NOT NULL,
  `password_users` varchar(100) NOT NULL,
  `firstname_users` varchar(100) NOT NULL,
  `lastname_users` varchar(100) NOT NULL,
  `dateofbirth_users` date NOT NULL,
  `safeid_users` varchar(100) NOT NULL,
  `type_users` varchar(45) NOT NULL,
  `google_auth_secret` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id_users`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (3,'tet@tet','$2a$08$auFK/b1M.zIxq0dYjsWDBOgRESfGYZxc1j/BsrZi0Z8pV28C9p0BC','tet','tet','1998-07-27','$2a$10$Itt9nmjTNY3qXsLbNkpFc.my5GAWBeWoGw.C5IRLCAJV2T.hqu.hm','Normal',NULL),(5,'bartek.c12@gmail.com','$2a$08$1Vwrx9MZZhdZwKGvFRRVJOGv4/Z0m003zDmvYwz8Hmi0Qw73MTLd6','Bartłonmiej','Cetera','1998-07-27','7pGVI2sUuJvXPW9d','Normal','GIYE2OCULY5F2ULYONJDKQTUO5EWGRDCMNNXCZDQIVDVOXKLNZGA'),(6,'cetera@op.pl','$2a$08$qzpqtcZMsm1y5BJlwWl.qO4h6SIwOtH60u2RelQtAQ1dsLCtyPe7.','Piotrek','Cetera','1988-07-27','BV@URNRYAR@Gp@zr','Normal',NULL),(14,'cetera.b27@gmail.com','$2a$08$ftcq0HZNDBGipglsKCAmiuOyCAS9nrfRhdcqcauU760R4XNUP2oSq','1111','111','2003-12-31','VDmaMovb#vrNWeQR','Normal','MVZHGQJBNN4EGTTHLA6HGOSTHZGESXRGHN4D4VDMGVFSI6Z4KR6Q');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-01-01 21:36:14

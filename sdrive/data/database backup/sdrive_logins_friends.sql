-- MySQL dump 10.13  Distrib 8.0.36, for Linux (x86_64)
--
-- Host: localhost    Database: sdrive_logins
-- ------------------------------------------------------
-- Server version	8.0.40-0ubuntu0.24.04.1

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
-- Table structure for table `friends`
--

DROP TABLE IF EXISTS `friends`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `friends` (
  `id_friends` int NOT NULL AUTO_INCREMENT,
  `id_user_1_friends` int NOT NULL,
  `id_user_2_friends` int NOT NULL,
  `status_friends` varchar(45) NOT NULL,
  `noteid_notifications_friends` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`id_friends`),
  KEY `fk_friends_1_idx` (`id_user_1_friends`),
  KEY `fk_friends_2_idx` (`id_user_2_friends`),
  CONSTRAINT `fk_friends_1` FOREIGN KEY (`id_user_1_friends`) REFERENCES `users` (`id_users`),
  CONSTRAINT `fk_friends_2` FOREIGN KEY (`id_user_2_friends`) REFERENCES `users` (`id_users`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `friends`
--

LOCK TABLES `friends` WRITE;
/*!40000 ALTER TABLE `friends` DISABLE KEYS */;
INSERT INTO `friends` VALUES (10,6,5,'Removed','$2a$10$BxzyGRTOlNj6yR9BpdWYDuPgrkUtcoEDXr/eCWPyCXrPWkUq29h5K'),(11,5,3,'NotActive','$2a$10$ZrW9LK5k/IR22E0o9h/g7O5CO5iYz8SbBjqKev0WHNAveplXIaztK'),(12,5,6,'Removed','$2a$10$hYGn.hnAS7vckDTokqtyquMMIzOSyMnFf.tzr7TxGX.gJ4wi2K8LK'),(13,6,5,'Removed','$2a$10$3xhmzOEklKn1dRc9lh/ik.PP27ljl6TflQFQJS/dCVlz2mXVUut2q'),(14,5,6,'Active','$2a$10$h84rEQ.wYCuDQET/uriTbOWJjc7ta/ZIOjctg4J0WSopZwev7TDp2');
/*!40000 ALTER TABLE `friends` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-30 21:05:59

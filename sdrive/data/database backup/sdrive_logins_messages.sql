-- MySQL dump 10.13  Distrib 8.0.36, for Linux (x86_64)
--
-- Host: localhost    Database: sdrive_logins
-- ------------------------------------------------------
-- Server version	8.0.39-0ubuntu0.24.04.2

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
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `id_messages` int NOT NULL AUTO_INCREMENT,
  `reciver_messages` varchar(100) NOT NULL,
  `sender_messages` varchar(100) NOT NULL,
  `content_messages` varchar(9999) NOT NULL,
  `date_messages` datetime NOT NULL,
  `codemsg_messages` varchar(100) NOT NULL,
  PRIMARY KEY (`id_messages`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (1,'BV@URNRYAR@Gp@zr','7pGVI2sUuJvXPW9d','Test hejka','2024-11-03 17:52:56','$2a$10$JYBGYCi4IpqKi6fJtRiFsOxfjh3rs4igdayQye3JpoM7cBlunY6r6'),(2,'7pGVI2sUuJvXPW9d','BV@URNRYAR@Gp@zr','No cześć','2024-11-03 18:32:27','$2a$10$JYBGYCi4IpqKi6fJtRiFsOxfjh3rs4igdayQye3JpoM7cBlunY6r6'),(3,'7pGVI2sUuJvXPW9d','BV@URNRYAR@Gp@zr','Co tam?','2024-11-03 18:32:38','$2a$10$JYBGYCi4IpqKi6fJtRiFsOxfjh3rs4igdayQye3JpoM7cBlunY6r6'),(4,'BV@URNRYAR@Gp@zr','7pGVI2sUuJvXPW9d','To jest test systemu wiadomości!!','2024-11-03 18:33:33','$2a$10$JYBGYCi4IpqKi6fJtRiFsOxfjh3rs4igdayQye3JpoM7cBlunY6r6'),(5,'BV@URNRYAR@Gp@zr','7pGVI2sUuJvXPW9d','Widać że działa :D','2024-11-03 18:33:55','$2a$10$JYBGYCi4IpqKi6fJtRiFsOxfjh3rs4igdayQye3JpoM7cBlunY6r6'),(6,'BV@URNRYAR@Gp@zr','7pGVI2sUuJvXPW9d','Bardzo się cieszę','2024-11-03 18:36:38','$2a$10$JYBGYCi4IpqKi6fJtRiFsOxfjh3rs4igdayQye3JpoM7cBlunY6r6');
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-03 18:42:01

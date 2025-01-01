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
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id_notifications` int NOT NULL AUTO_INCREMENT,
  `user_notifications` varchar(100) NOT NULL,
  `head_notifications` varchar(100) NOT NULL,
  `msg_notifications` varchar(10000) NOT NULL,
  `type_notifications` varchar(100) NOT NULL,
  `status_notifications` varchar(45) NOT NULL,
  `date_notifications` date NOT NULL,
  `dispatcher_notifications` varchar(100) NOT NULL,
  `noteid_notifications` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`id_notifications`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (3,'7pGVI2sUuJvXPW9d','Zaproszenie do znajomych','Użytkownik Piotrek Cetera (cetera@op.pl) wysłał ci zaproszenie do znajomych.','friend_request','read','2024-10-19','cetera@op.pl','$2a$10$BxzyGRTOlNj6yR9BpdWYDuPgrkUtcoEDXr/eCWPyCXrPWkUq29h5K'),(4,'$2a$10$Itt9nmjTNY3qXsLbNkpFc.my5GAWBeWoGw.C5IRLCAJV2T.hqu.hm','Zaproszenie do znajomych','Użytkownik Bartek Cetera (bartek.c12@gmail.com) wysłał ci zaproszenie do znajomych.','friend_request','unread','2024-10-19','bartek.c12@gmail.com','$2a$10$ZrW9LK5k/IR22E0o9h/g7O5CO5iYz8SbBjqKev0WHNAveplXIaztK'),(5,'BV@URNRYAR@Gp@zr','Zaproszenie do znajomych','Użytkownik Bartek Cetera (bartek.c12@gmail.com) wysłał ci zaproszenie do znajomych.','friend_request','read','2024-10-19','bartek.c12@gmail.com','$2a$10$hYGn.hnAS7vckDTokqtyquMMIzOSyMnFf.tzr7TxGX.gJ4wi2K8LK'),(6,'7pGVI2sUuJvXPW9d','Zaproszenie do znajomych','Użytkownik Piotrek Cetera (cetera@op.pl) wysłał ci zaproszenie do znajomych.','friend_request','read','2024-11-02','cetera@op.pl','$2a$10$3xhmzOEklKn1dRc9lh/ik.PP27ljl6TflQFQJS/dCVlz2mXVUut2q'),(7,'BV@URNRYAR@Gp@zr','Zaproszenie do znajomych','Użytkownik Bartek Cetera (bartek.c12@gmail.com) wysłał ci zaproszenie do znajomych.','friend_request','read','2024-11-02','bartek.c12@gmail.com','$2a$10$h84rEQ.wYCuDQET/uriTbOWJjc7ta/ZIOjctg4J0WSopZwev7TDp2'),(8,'7pGVI2sUuJvXPW9d','Nowy znajomy','Użytkownik o mailu cetera@op.pl zaakceptował twoje zaproszenie do znajomych.','friend_response','read','2024-11-02','cetera@op.pl',NULL);
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-01-01 21:36:15

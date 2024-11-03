-- MySQL dump 10.13  Distrib 8.0.36, for Linux (x86_64)
--
-- Host: localhost    Database: sdrive_files
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
-- Table structure for table `files`
--

DROP TABLE IF EXISTS `files`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `files` (
  `id_files` int NOT NULL AUTO_INCREMENT,
  `originalname_files` varchar(100) NOT NULL,
  `cryptedname_files` varchar(100) NOT NULL,
  `cryptedowner_files` varchar(100) NOT NULL,
  `filetype_files` varchar(45) NOT NULL,
  `delete_files` int NOT NULL,
  `dateofdelete_files` datetime DEFAULT NULL,
  `dateofupload_files` datetime NOT NULL,
  PRIMARY KEY (`id_files`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `files`
--

LOCK TABLES `files` WRITE;
/*!40000 ALTER TABLE `files` DISABLE KEYS */;
INSERT INTO `files` VALUES (22,'Struktura projektu sdrive.txt','0549c6a3995c3a76cd2685d27a44a29d.txt','7pGVI2sUuJvXPW9d','txt',1,'2024-11-02 13:30:03','2024-11-02 13:29:37'),(23,'Struktura projektu sdrive.txt','f058ccd2c71a3507abd0caef69e156b1.txt','7pGVI2sUuJvXPW9d','txt',0,NULL,'2024-11-02 13:31:43'),(24,'Struktura projektu sdrive.txt','4466199a4fdd8253819b43c6c6b32d50.txt','BV@URNRYAR@Gp@zr','txt',0,NULL,'2024-11-02 14:08:16'),(25,'views home ejs DOCTYPE.txt','d943abb7e89db2fa6657e25f2f501770.txt','BV@URNRYAR@Gp@zr','txt',0,NULL,'2024-11-02 14:08:21'),(26,'polecenia.txt','fcdf77dc415d01f3d5883e319bc05aa8.txt','BV@URNRYAR@Gp@zr','txt',0,NULL,'2024-11-02 14:08:30'),(27,'readme.md','aa1e5e198d790c565c149589a383ec2e.md','7pGVI2sUuJvXPW9d','md',0,NULL,'2024-11-02 15:15:41'),(28,'polecenia.txt','5e0d8c9c97bfa6f62aa1a408e16b5cd9.txt','7pGVI2sUuJvXPW9d','txt',0,NULL,'2024-11-02 15:15:55'),(29,'auth.js','99cccdf3c65c2e19b36d9650405f96da.js','7pGVI2sUuJvXPW9d','js',0,NULL,'2024-11-02 15:16:03'),(30,'Struktura projektu sdrive.txt','3250d7e9ce989af2bd3db566335fb6a8.txt','7pGVI2sUuJvXPW9d','txt',0,NULL,'2024-11-02 15:18:08'),(31,'Projekt sici lokalnych.docx','1ed361167cc32324b664fb51766f422c.docx','7pGVI2sUuJvXPW9d','docx',0,NULL,'2024-11-02 16:06:29');
/*!40000 ALTER TABLE `files` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fshare`
--

DROP TABLE IF EXISTS `fshare`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fshare` (
  `id_fshare` int NOT NULL AUTO_INCREMENT,
  `originalowner_fshare` varchar(100) NOT NULL,
  `sharedowner_fshare` varchar(100) NOT NULL,
  `file_fshare` varchar(100) NOT NULL,
  `date_fshare` datetime NOT NULL,
  `id_files_fshare` int NOT NULL,
  `filetype_fshare` varchar(45) NOT NULL,
  `truename_fshare` varchar(45) NOT NULL,
  `deleted_fshare` int NOT NULL,
  `dateofdelete_fshare` datetime DEFAULT NULL,
  PRIMARY KEY (`id_fshare`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fshare`
--

LOCK TABLES `fshare` WRITE;
/*!40000 ALTER TABLE `fshare` DISABLE KEYS */;
INSERT INTO `fshare` VALUES (4,'BV@URNRYAR@Gp@zr','7pGVI2sUuJvXPW9d','4466199a4fdd8253819b43c6c6b32d50.txt','2024-11-02 14:08:33',24,'txt','Struktura projektu sdrive.txt',0,'2024-11-02 16:03:56'),(5,'BV@URNRYAR@Gp@zr','7pGVI2sUuJvXPW9d','d943abb7e89db2fa6657e25f2f501770.txt','2024-11-02 14:08:36',25,'txt','views home ejs DOCTYPE.txt',1,'2024-11-02 16:42:17'),(6,'BV@URNRYAR@Gp@zr','7pGVI2sUuJvXPW9d','fcdf77dc415d01f3d5883e319bc05aa8.txt','2024-11-02 14:08:40',26,'txt','polecenia.txt',1,'2024-11-02 16:42:15'),(7,'BV@URNRYAR@Gp@zr','7pGVI2sUuJvXPW9d','fcdf77dc415d01f3d5883e319bc05aa8.txt','2024-11-02 15:26:59',26,'txt','polecenia.txt',1,'2024-11-02 16:42:15'),(8,'7pGVI2sUuJvXPW9d','BV@URNRYAR@Gp@zr','3250d7e9ce989af2bd3db566335fb6a8.txt','2024-11-02 16:50:16',30,'txt','Struktura projektu sdrive.txt',1,'2024-11-02 17:52:47'),(9,'7pGVI2sUuJvXPW9d','BV@URNRYAR@Gp@zr','1ed361167cc32324b664fb51766f422c.docx','2024-11-02 17:35:11',31,'docx','Projekt sici lokalnych.docx',1,'2024-11-02 17:52:46'),(10,'7pGVI2sUuJvXPW9d','BV@URNRYAR@Gp@zr','1ed361167cc32324b664fb51766f422c.docx','2024-11-02 17:48:51',31,'docx','Projekt sici lokalnych.docx',1,'2024-11-02 17:52:46'),(11,'7pGVI2sUuJvXPW9d','BV@URNRYAR@Gp@zr','4466199a4fdd8253819b43c6c6b32d50.txt_20241102165214329','2024-11-02 17:52:14',24,'txt','Struktura projektu sdrive.txt',1,'2024-11-02 17:52:44'),(12,'7pGVI2sUuJvXPW9d','BV@URNRYAR@Gp@zr','4466199a4fdd8253819b43c6c6b32d50.txt_20241102165310693','2024-11-02 17:53:11',24,'txt','Struktura projektu sdrive.txt',0,NULL);
/*!40000 ALTER TABLE `fshare` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-03 18:41:36
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
-- Table structure for table `conversations`
--

DROP TABLE IF EXISTS `conversations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `conversations` (
  `id_conversations` int NOT NULL AUTO_INCREMENT,
  `ppl1_conversations` varchar(100) NOT NULL,
  `ppl2_conversations` varchar(100) NOT NULL,
  `codemsg_conversations` varchar(100) NOT NULL,
  PRIMARY KEY (`id_conversations`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `conversations`
--

LOCK TABLES `conversations` WRITE;
/*!40000 ALTER TABLE `conversations` DISABLE KEYS */;
INSERT INTO `conversations` VALUES (1,'7pGVI2sUuJvXPW9d','BV@URNRYAR@Gp@zr','$2a$10$JYBGYCi4IpqKi6fJtRiFsOxfjh3rs4igdayQye3JpoM7cBlunY6r6');
/*!40000 ALTER TABLE `conversations` ENABLE KEYS */;
UNLOCK TABLES;

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
  PRIMARY KEY (`id_users`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (3,'tet@tet','$2a$08$auFK/b1M.zIxq0dYjsWDBOgRESfGYZxc1j/BsrZi0Z8pV28C9p0BC','tet','tet','1998-07-27','$2a$10$Itt9nmjTNY3qXsLbNkpFc.my5GAWBeWoGw.C5IRLCAJV2T.hqu.hm','Normal'),(5,'bartek.c12@gmail.com','$2a$08$T3yWQON6bWPvKcxPGoJlcekukThnYRmZKlm5Oi9/LB0eZgl0kwr5S','Bartek','Cetera','1998-07-27','7pGVI2sUuJvXPW9d','Normal'),(6,'cetera@op.pl','$2a$08$qzpqtcZMsm1y5BJlwWl.qO4h6SIwOtH60u2RelQtAQ1dsLCtyPe7.','Piotrek','Cetera','1988-07-27','BV@URNRYAR@Gp@zr','Normal');
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

-- Dump completed on 2024-11-03 18:41:36

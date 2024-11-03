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
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-03 18:42:01

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

-- Dump completed on 2024-11-03 18:42:01

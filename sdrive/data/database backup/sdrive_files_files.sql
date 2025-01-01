-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: sdrive_files
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
  `origin_file` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id_files`)
) ENGINE=InnoDB AUTO_INCREMENT=93 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `files`
--

LOCK TABLES `files` WRITE;
/*!40000 ALTER TABLE `files` DISABLE KEYS */;
INSERT INTO `files` VALUES (48,'polecenia.txt','179659226048f69ddf3c8c93da5f1fb7.txt','7pGVI2sUuJvXPW9d','txt',0,NULL,'2024-11-30 19:26:50',NULL),(49,'magazyny.txt','8a029fe86f82cb86965a8c1b7e7f12d1.txt','7pGVI2sUuJvXPW9d','txt',0,NULL,'2024-11-30 19:26:56',NULL),(74,'polecenia.txt','1211cb9b0767e9b42998821398796f02.txt','7pGVI2sUuJvXPW9d','txt',0,NULL,'2024-11-30 20:23:52','storage'),(75,'magazyny.txt','4b83b3c9d946fe22b3f3b182653a96df.txt','7pGVI2sUuJvXPW9d','txt',0,NULL,'2024-11-30 20:23:52','storage'),(76,'polecenia(1).txt','504d48c1f1f90c945907860ae815ff1d.txt','7pGVI2sUuJvXPW9d','txt',0,NULL,'2024-11-30 20:23:56','storage'),(77,'magazyny(1).txt','afdbee2283479c10ba202f7611c49b8f.txt','7pGVI2sUuJvXPW9d','txt',0,NULL,'2024-11-30 20:23:56','storage'),(78,'polecenia(2).txt','509cbd15f6236229d29b42d3a2c57a35.txt','7pGVI2sUuJvXPW9d','txt',0,NULL,'2024-11-30 20:24:00','storage'),(79,'magazyny(2).txt','30b223d0e27c74d100004d4d15f57c69.txt','7pGVI2sUuJvXPW9d','txt',0,NULL,'2024-11-30 20:24:00','storage'),(80,'poleceni2424324.txt','f34c3b7798928a77712471ec9a19e48f.txt','7pGVI2sUuJvXPW9d','txt',0,NULL,'2024-11-30 20:24:04','storage'),(81,'magazyny3423423423.txt','c02bca9a66d2d4bae874f7992e51e27d.txt','7pGVI2sUuJvXPW9d','txt',0,NULL,'2024-11-30 20:24:04','storage'),(82,'polecenia(3).txt','be50aeffca2bc2bbea5d0c552c4bf348.txt','7pGVI2sUuJvXPW9d','txt',0,NULL,'2024-11-30 20:24:37','storage'),(83,'magazyny(3).txt','8a580f08adf64a3d14e847cff64a74d5.txt','7pGVI2sUuJvXPW9d','txt',0,NULL,'2024-11-30 20:24:37','storage'),(84,'polecenia(4).txt','2d8bb2ca55486385b6f6aefc9bfaa33f.txt','7pGVI2sUuJvXPW9d','txt',0,NULL,'2024-11-30 20:24:41','storage'),(85,'magazyny(4).txt','96fe0c761df0ba48e724deeabed50cc9.txt','7pGVI2sUuJvXPW9d','txt',0,NULL,'2024-11-30 20:24:41','storage'),(86,'polecenia(4).txt','6465951ae622de91e182748b6eb1b39d.txt','7pGVI2sUuJvXPW9d','txt',0,NULL,'2024-11-30 20:25:23','storage'),(87,'magazyny(4).txt','fde3a75f7d02e7e11042c1bad4e33e17.txt','7pGVI2sUuJvXPW9d','txt',0,NULL,'2024-11-30 20:25:23','storage'),(88,'polecenia(5).txt(deleted)0795','5f8710b7b3329bb8f7e0d33fc444bd68.txt','7pGVI2sUuJvXPW9d','txt',0,NULL,'2024-11-30 20:25:28','storage'),(89,'magazyny(5).txt(deleted)0365','00bbe0cf310c0d39a123ed56097a6ed2.txt','7pGVI2sUuJvXPW9d','txt',0,NULL,'2024-11-30 20:25:28','storage'),(90,'magazynowiec.txt','6c40dff98bb9d71524c3642467f18d0f.txt','7pGVI2sUuJvXPW9d','txt',0,NULL,'2024-11-30 20:30:26',NULL),(91,'polecenia(5).txt','f1858efc13d86ed16f354c7756cacb3f.txt','7pGVI2sUuJvXPW9d','txt',0,NULL,'2024-11-30 21:04:01','storage'),(92,'magazyny(5).txt','c2cc915cba59bf869c1db7c3a542ae0d.txt','7pGVI2sUuJvXPW9d','txt',0,NULL,'2024-11-30 21:04:01','storage');
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

-- Dump completed on 2025-01-01 21:36:14

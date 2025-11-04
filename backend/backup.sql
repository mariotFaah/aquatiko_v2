/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-11.8.3-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: gestion_entreprise
-- ------------------------------------------------------
-- Server version	11.8.3-MariaDB-0+deb13u1 from Debian

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `activites`
--

DROP TABLE IF EXISTS `activites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `activites` (
  `id_activite` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `tiers_id` int(10) unsigned NOT NULL,
  `type_activite` varchar(50) NOT NULL,
  `sujet` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `date_activite` datetime NOT NULL,
  `date_rappel` datetime DEFAULT NULL,
  `statut` enum('planifie','realise','annule') DEFAULT 'planifie',
  `priorite` enum('bas','normal','haut','urgent') DEFAULT 'normal',
  `utilisateur_id` int(10) unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id_activite`),
  KEY `tiers_id` (`tiers_id`),
  CONSTRAINT `activites_ibfk_1` FOREIGN KEY (`tiers_id`) REFERENCES `tiers` (`id_tiers`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activites`
--

LOCK TABLES `activites` WRITE;
/*!40000 ALTER TABLE `activites` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `activites` VALUES
(1,1,'appel','Suivi devis maintenance','Appel pour discuter des détails du devis de maintenance','2024-01-25 10:00:00',NULL,'realise','normal',NULL,'2025-10-23 15:25:08','2025-10-23 15:25:08'),
(2,1,'reunion','Présentation solution','Réunion de présentation de notre nouvelle solution','2024-02-05 14:30:00',NULL,'planifie','haut',NULL,'2025-10-23 15:25:08','2025-10-23 15:25:08');
/*!40000 ALTER TABLE `activites` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `articles`
--

DROP TABLE IF EXISTS `articles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `articles` (
  `code_article` varchar(50) NOT NULL,
  `description` varchar(255) NOT NULL,
  `prix_unitaire` decimal(15,2) NOT NULL,
  `taux_tva` decimal(5,2) DEFAULT 20.00,
  `unite` varchar(20) DEFAULT 'unite',
  `actif` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `devise` varchar(3) DEFAULT 'MGA',
  PRIMARY KEY (`code_article`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `articles`
--

LOCK TABLES `articles` WRITE;
/*!40000 ALTER TABLE `articles` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `articles` VALUES
('ART001','Ordinateur Portable hp',2500000.00,20.00,'unite',1,'2025-10-20 06:44:04','2025-10-22 06:34:09','MGA'),
('ART002','Souris USB',15000.00,20.00,'unite',1,'2025-10-20 06:44:04','2025-10-20 06:44:04','MGA'),
('ART003','Clavier Mécanique',80000.00,20.00,'unite',1,'2025-10-20 06:44:04','2025-10-20 06:44:04','MGA'),
('ART004','Service Maintenance',150000.00,20.00,'heure',1,'2025-10-20 06:44:04','2025-10-20 06:44:04','MGA'),
('ART005','Formation Logiciel',500000.00,0.00,'jour',1,'2025-10-20 06:44:04','2025-10-20 06:44:04','MGA');
/*!40000 ALTER TABLE `articles` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `commandes`
--

DROP TABLE IF EXISTS `commandes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `commandes` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `numero_commande` varchar(255) NOT NULL,
  `type` enum('import','export') NOT NULL,
  `client_id` int(10) unsigned NOT NULL,
  `fournisseur_id` int(10) unsigned NOT NULL,
  `date_commande` date NOT NULL,
  `date_livraison_prevue` date DEFAULT NULL,
  `statut` enum('brouillon','confirmée','expédiée','livrée','annulée') DEFAULT 'brouillon',
  `notes` text DEFAULT NULL,
  `montant_total` decimal(15,2) DEFAULT 0.00,
  `devise` varchar(3) DEFAULT 'EUR',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `commandes_numero_commande_unique` (`numero_commande`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `commandes`
--

LOCK TABLES `commandes` WRITE;
/*!40000 ALTER TABLE `commandes` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `commandes` VALUES
(1,'CMD-000001','import',1,2,'2024-01-15',NULL,'brouillon',NULL,1200.00,'EUR','2025-10-21 08:43:31','2025-10-21 08:43:31'),
(2,'CMD-000002','import',1,2,'2024-01-15',NULL,'brouillon',NULL,1200.00,'EUR','2025-10-21 08:47:14','2025-10-21 08:47:14'),
(4,'CMD-000003','import',1,2,'2024-01-15',NULL,'expédiée',NULL,6000000.00,'EUR','2025-10-21 08:54:03','2025-10-21 12:01:01'),
(5,'CMD-000004','import',1,2,'2024-01-15',NULL,'brouillon',NULL,1800000.00,'EUR','2025-10-21 12:00:47','2025-10-21 12:00:47'),
(6,'CMD-000005','export',3,2,'2025-10-22',NULL,'brouillon',NULL,36000.00,'USD','2025-10-22 05:36:12','2025-10-22 05:36:12'),
(7,'CMD-000006','export',3,2,'2025-10-21',NULL,'brouillon',NULL,108000.00,'USD','2025-10-22 05:43:06','2025-10-22 05:43:06'),
(8,'CMD-000007','export',3,4,'2025-10-22',NULL,'brouillon',NULL,6018000.00,'EUR','2025-10-22 06:35:59','2025-10-22 06:35:59'),
(9,'CMD-000008','export',1,4,'2025-10-22',NULL,'confirmée',NULL,3000000.00,'MGA','2025-10-22 06:44:39','2025-10-22 06:44:39'),
(10,'CMD-000009','import',1,2,'2024-01-15',NULL,'brouillon',NULL,12000.00,'EUR','2025-10-22 06:58:29','2025-10-22 06:58:29'),
(11,'CMD-000010','export',1,2,'2025-10-22',NULL,'expédiée',NULL,18000.00,'EUR','2025-10-22 07:43:53','2025-10-22 07:43:53'),
(12,'CMD-000011','import',1,2,'2024-01-14',NULL,'brouillon',NULL,4800000.00,'EUR','2025-10-22 08:00:18','2025-10-22 08:00:18'),
(13,'CMD-000012','import',1,2,'2024-01-13',NULL,'brouillon',NULL,1800000.00,'EUR','2025-10-22 08:12:57','2025-10-22 08:12:57'),
(14,'CMD-000013','import',1,2,'2024-01-12',NULL,'brouillon',NULL,1818000.00,'EUR','2025-10-23 06:59:05','2025-10-23 06:59:05'),
(15,'CMD-000014','export',1,2,'2025-10-23',NULL,'confirmée',NULL,3018000.00,'MGA','2025-10-23 08:07:39','2025-10-23 08:07:39'),
(16,'CMD-000015','export',1,2,'2025-10-22',NULL,'brouillon',NULL,3035460.00,'MGA','2025-10-25 09:01:34','2025-10-25 09:01:34'),
(17,'CMD-000016','import',3,4,'2025-10-25',NULL,'confirmée',NULL,96000.00,'EUR','2025-10-25 10:17:25','2025-10-25 10:17:25'),
(18,'CMD-000017','export',1,4,'2025-10-25',NULL,'confirmée',NULL,18000.00,'EUR','2025-10-25 10:34:45','2025-10-25 10:34:45');
/*!40000 ALTER TABLE `commandes` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `contacts`
--

DROP TABLE IF EXISTS `contacts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `contacts` (
  `id_contact` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `tiers_id` int(10) unsigned NOT NULL,
  `nom` varchar(255) NOT NULL,
  `prenom` varchar(255) DEFAULT NULL,
  `fonction` varchar(100) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `principal` tinyint(1) DEFAULT 0,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id_contact`),
  KEY `tiers_id` (`tiers_id`),
  CONSTRAINT `contacts_ibfk_1` FOREIGN KEY (`tiers_id`) REFERENCES `tiers` (`id_tiers`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contacts`
--

LOCK TABLES `contacts` WRITE;
/*!40000 ALTER TABLE `contacts` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `contacts` VALUES
(1,1,'Rakoto','Jean','Directeur','jean.rakoto@clientsarl.mg','+261 34 12 345 67',1,NULL,'2025-10-23 15:25:06','2025-10-23 15:25:06'),
(2,1,'Rasoa','Marie','Responsable Achats','marie.rasoa@clientsarl.mg','+261 33 12 345 68',0,NULL,'2025-10-23 15:25:06','2025-10-23 15:25:06'),
(3,2,'Andria','Luc','Directeur Commercial','luc.andria@importfournisseur.mg','+261 32 12 345 69',1,NULL,'2025-10-23 15:25:06','2025-10-23 15:25:06'),
(4,1,'Test','API','Responsable Test','api.test@client.mg','+261 34 00 000 00',0,NULL,'2025-10-25 06:11:12','2025-10-25 06:11:12'),
(5,1,'Validation','Test','Responsable Validation','validation@test.mg','+261 34 00 000 01',0,NULL,'2025-10-25 06:26:01','2025-10-25 06:26:01');
/*!40000 ALTER TABLE `contacts` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `contrats`
--

DROP TABLE IF EXISTS `contrats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `contrats` (
  `id_contrat` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `numero_contrat` varchar(50) NOT NULL,
  `tiers_id` int(10) unsigned NOT NULL,
  `devis_id` int(10) unsigned DEFAULT NULL,
  `type_contrat` varchar(100) NOT NULL,
  `date_debut` date NOT NULL,
  `date_fin` date DEFAULT NULL,
  `statut` enum('actif','inactif','resilie','termine') DEFAULT 'actif',
  `montant_ht` decimal(15,2) DEFAULT 0.00,
  `periodicite` varchar(50) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `conditions` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id_contrat`),
  UNIQUE KEY `numero_contrat` (`numero_contrat`),
  KEY `tiers_id` (`tiers_id`),
  KEY `devis_id` (`devis_id`),
  CONSTRAINT `contrats_ibfk_1` FOREIGN KEY (`tiers_id`) REFERENCES `tiers` (`id_tiers`),
  CONSTRAINT `contrats_ibfk_2` FOREIGN KEY (`devis_id`) REFERENCES `devis` (`id_devis`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contrats`
--

LOCK TABLES `contrats` WRITE;
/*!40000 ALTER TABLE `contrats` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `contrats` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `couts_logistiques`
--

DROP TABLE IF EXISTS `couts_logistiques`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `couts_logistiques` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `commande_id` int(10) unsigned NOT NULL,
  `fret_maritime` decimal(15,2) DEFAULT 0.00,
  `fret_aerien` decimal(15,2) DEFAULT 0.00,
  `assurance` decimal(15,2) DEFAULT 0.00,
  `droits_douane` decimal(15,2) DEFAULT 0.00,
  `frais_transit` decimal(15,2) DEFAULT 0.00,
  `transport_local` decimal(15,2) DEFAULT 0.00,
  `autres_frais` decimal(15,2) DEFAULT 0.00,
  `description_autres_frais` text DEFAULT NULL,
  `devise_couts` varchar(3) DEFAULT 'EUR',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `couts_logistiques`
--

LOCK TABLES `couts_logistiques` WRITE;
/*!40000 ALTER TABLE `couts_logistiques` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `couts_logistiques` VALUES
(1,4,500000.00,0.00,100000.00,300000.00,0.00,200000.00,0.00,NULL,'EUR','2025-10-21 08:55:53','2025-10-21 12:01:23'),
(2,5,500.00,0.00,100.00,200.00,0.00,150.00,50.00,NULL,'EUR','2025-10-22 06:58:39','2025-10-22 06:58:39'),
(3,1,500000.00,0.00,100000.00,300000.00,0.00,200000.00,0.00,NULL,'MGA','2025-10-23 07:33:15','2025-10-23 07:51:54');
/*!40000 ALTER TABLE `couts_logistiques` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `devis`
--

DROP TABLE IF EXISTS `devis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `devis` (
  `id_devis` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `numero_devis` varchar(50) NOT NULL,
  `tiers_id` int(10) unsigned NOT NULL,
  `date_devis` date NOT NULL,
  `date_validite` date DEFAULT NULL,
  `statut` enum('brouillon','envoye','accepte','refuse','expire') DEFAULT 'brouillon',
  `montant_ht` decimal(15,2) DEFAULT 0.00,
  `montant_ttc` decimal(15,2) DEFAULT 0.00,
  `objet` text DEFAULT NULL,
  `conditions` text DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id_devis`),
  UNIQUE KEY `numero_devis` (`numero_devis`),
  KEY `tiers_id` (`tiers_id`),
  CONSTRAINT `devis_ibfk_1` FOREIGN KEY (`tiers_id`) REFERENCES `tiers` (`id_tiers`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `devis`
--

LOCK TABLES `devis` WRITE;
/*!40000 ALTER TABLE `devis` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `devis` VALUES
(1,'DEV-000001',1,'2024-01-15','2024-02-15','accepte',2500000.00,3000000.00,'Prestation de consulting digital',NULL,NULL,'2025-10-23 15:25:06','2025-10-23 15:25:06'),
(2,'DEV-000002',1,'2024-02-01','2024-03-01','envoye',1500000.00,1800000.00,'Maintenance système',NULL,NULL,'2025-10-23 15:25:06','2025-10-23 15:25:06'),
(3,'DEV-000003',3,'2024-01-20','2024-02-20','brouillon',3500000.00,4200000.00,'Développement application',NULL,NULL,'2025-10-23 15:25:06','2025-10-23 15:25:06'),
(4,'DEV-000004',1,'2024-01-20','2024-02-20','brouillon',1500000.00,0.00,'Test création devis via API','Paiement à réception',NULL,'2025-10-25 06:11:03','2025-10-25 06:11:03');
/*!40000 ALTER TABLE `devis` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `ecritures_comptables`
--

DROP TABLE IF EXISTS `ecritures_comptables`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `ecritures_comptables` (
  `id_ecriture` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `numero_ecriture` varchar(50) NOT NULL,
  `date` date NOT NULL,
  `journal` enum('ventes','achats','banque','caisse') NOT NULL,
  `compte` varchar(10) NOT NULL,
  `libelle` varchar(255) NOT NULL,
  `debit` decimal(15,2) DEFAULT 0.00,
  `credit` decimal(15,2) DEFAULT 0.00,
  `devise` varchar(3) DEFAULT 'MGA',
  `taux_change` decimal(10,4) DEFAULT 1.0000,
  `reference` varchar(255) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_ecriture`),
  UNIQUE KEY `ecritures_comptables_numero_ecriture_unique` (`numero_ecriture`)
) ENGINE=InnoDB AUTO_INCREMENT=115 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ecritures_comptables`
--

LOCK TABLES `ecritures_comptables` WRITE;
/*!40000 ALTER TABLE `ecritures_comptables` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `ecritures_comptables` VALUES
(74,'202412-1-1','2024-12-01','ventes','411000','Facture 1 - ',3096000.00,0.00,'MGA',1.0000,'1',NULL,'2025-10-21 06:09:39','2025-10-21 06:09:39'),
(75,'202412-1-2','2024-12-01','ventes','445620','TVA Facture 1',0.00,516000.00,'MGA',1.0000,'1',NULL,'2025-10-21 06:09:39','2025-10-21 06:09:39'),
(76,'202412-1-3','2024-12-01','ventes','701000','Facture 1',0.00,2580000.00,'MGA',1.0000,'1',NULL,'2025-10-21 06:09:39','2025-10-21 06:09:39'),
(77,'202410-3-1','2024-10-19','ventes','411000','Facture 3 - ',270000.00,0.00,'MGA',1.0000,'3',NULL,'2025-10-21 06:09:39','2025-10-21 06:09:39'),
(78,'202410-3-2','2024-10-19','ventes','445620','TVA Facture 3',0.00,45000.00,'MGA',1.0000,'3',NULL,'2025-10-21 06:09:39','2025-10-21 06:09:39'),
(79,'202410-3-3','2024-10-19','ventes','701000','Facture 3',0.00,225000.00,'MGA',1.0000,'3',NULL,'2025-10-21 06:09:39','2025-10-21 06:09:39'),
(80,'202510-5-1','2025-10-20','ventes','411000','Facture 5 - ',614000.00,0.00,'MGA',1.0000,'5',NULL,'2025-10-21 06:09:39','2025-10-21 06:09:39'),
(81,'202510-5-2','2025-10-20','ventes','445620','TVA Facture 5',0.00,19000.00,'MGA',1.0000,'5',NULL,'2025-10-21 06:09:39','2025-10-21 06:09:39'),
(82,'202510-5-3','2025-10-20','ventes','701000','Facture 5',0.00,595000.00,'MGA',1.0000,'5',NULL,'2025-10-21 06:09:39','2025-10-21 06:09:39'),
(83,'202510-6-1','2025-10-20','achats','401000','Facture 6 - ',0.00,18000.00,'MGA',1.0000,'6',NULL,'2025-10-21 06:09:39','2025-10-21 06:09:39'),
(84,'202510-6-2','2025-10-20','achats','445620','TVA Facture 6',3000.00,0.00,'MGA',1.0000,'6',NULL,'2025-10-21 06:09:39','2025-10-21 06:09:39'),
(85,'202510-6-3','2025-10-20','achats','607000','Facture 6',15000.00,0.00,'MGA',1.0000,'6',NULL,'2025-10-21 06:09:39','2025-10-21 06:09:39'),
(86,'202410-7-1','2024-10-21','ventes','411000','Facture 7 - ',120000.00,0.00,'MGA',1.0000,'7',NULL,'2025-10-21 06:09:39','2025-10-21 06:09:39'),
(87,'202410-7-2','2024-10-21','ventes','445620','TVA Facture 7',0.00,20000.00,'MGA',1.0000,'7',NULL,'2025-10-21 06:09:39','2025-10-21 06:09:39'),
(88,'202410-7-3','2024-10-21','ventes','701000','Facture 7',0.00,100000.00,'MGA',1.0000,'7',NULL,'2025-10-21 06:09:39','2025-10-21 06:09:39'),
(89,'202510-0004','2024-01-01','banque','101000','Apport en capital',0.00,3500000.00,'MGA',1.0000,'CAPITAL',NULL,'2025-10-21 06:17:03','2025-10-21 06:17:03'),
(94,'202510-8-1','2025-10-21','ventes','411000','Facture 8 - Client SARL',4495039.50,0.00,'USD',4200.0000,'8',NULL,'2025-10-21 07:11:38','2025-10-21 07:11:38'),
(95,'202510-8-2','2025-10-21','ventes','445620','TVA Facture 8',0.00,500001.60,'USD',4200.0000,'8',NULL,'2025-10-21 07:11:38','2025-10-21 07:11:38'),
(96,'202510-8-3','2025-10-21','ventes','701000','Facture 8',0.00,3995037.90,'USD',4200.0000,'8',NULL,'2025-10-21 07:11:38','2025-10-21 07:11:38'),
(97,'202510-10-1','2025-10-21','achats','401000','Facture 10 - Fournisseur Import',0.00,114000.00,'MGA',1.0000,'10',NULL,'2025-10-21 12:42:44','2025-10-21 12:42:44'),
(98,'202510-10-2','2025-10-21','achats','445600','TVA Facture 10',19000.00,0.00,'MGA',1.0000,'10',NULL,'2025-10-21 12:42:44','2025-10-21 12:42:44'),
(99,'202510-10-3','2025-10-21','achats','607000','Facture 10',95000.00,0.00,'MGA',1.0000,'10',NULL,'2025-10-21 12:42:44','2025-10-21 12:42:44'),
(100,'202510-12-1','2025-10-22','achats','401000','Facture 12 - ddaa',0.00,3018000.00,'MGA',1.0000,'12',NULL,'2025-10-22 08:02:58','2025-10-22 08:02:58'),
(101,'202510-12-2','2025-10-22','achats','445600','TVA Facture 12',503000.00,0.00,'MGA',1.0000,'12',NULL,'2025-10-22 08:02:58','2025-10-22 08:02:58'),
(102,'202510-12-3','2025-10-22','achats','607000','Facture 12',2515000.00,0.00,'MGA',1.0000,'12',NULL,'2025-10-22 08:02:58','2025-10-22 08:02:58'),
(103,'202510-13-1','2025-10-25','achats','401000','Facture 13 - ddaa',0.00,126000.00,'MGA',1.0000,'13',NULL,'2025-10-25 07:25:25','2025-10-25 07:25:25'),
(104,'202510-13-2','2025-10-25','achats','445600','TVA Facture 13',21000.00,0.00,'MGA',1.0000,'13',NULL,'2025-10-25 07:25:25','2025-10-25 07:25:25'),
(105,'202510-13-3','2025-10-25','achats','607000','Facture 13',105000.00,0.00,'MGA',1.0000,'13',NULL,'2025-10-25 07:25:25','2025-10-25 07:25:25'),
(106,'202510-14-1','2025-10-26','achats','401000','Facture 14 - ddaa',0.00,662482.80,'EUR',4500.0000,'14',NULL,'2025-10-26 12:45:05','2025-10-26 12:45:05'),
(107,'202510-14-2','2025-10-26','achats','445600','TVA Facture 14',110413.80,0.00,'EUR',4500.0000,'14',NULL,'2025-10-26 12:45:05','2025-10-26 12:45:05'),
(108,'202510-14-3','2025-10-26','achats','607000','Facture 14',552069.00,0.00,'EUR',4500.0000,'14',NULL,'2025-10-26 12:45:05','2025-10-26 12:45:05'),
(109,'202510-15-1','2025-10-26','ventes','411000','Facture 15 - Client SARL',16343985.60,0.00,'EUR',4500.0000,'15',NULL,'2025-10-26 13:27:54','2025-10-26 13:27:54'),
(110,'202510-15-2','2025-10-26','ventes','445600','TVA Facture 15',0.00,2723997.60,'EUR',4500.0000,'15',NULL,'2025-10-26 13:27:54','2025-10-26 13:27:54'),
(111,'202510-15-3','2025-10-26','ventes','701000','Facture 15',0.00,13619988.00,'EUR',4500.0000,'15',NULL,'2025-10-26 13:27:54','2025-10-26 13:27:54'),
(112,'202510-16-1','2025-10-26','ventes','411000','Facture 16 - Client SARL',7218039.60,0.00,'EUR',4500.0000,'16',NULL,'2025-10-26 16:27:01','2025-10-26 16:27:01'),
(113,'202510-16-2','2025-10-26','ventes','445600','TVA Facture 16',0.00,1203006.60,'EUR',4500.0000,'16',NULL,'2025-10-26 16:27:01','2025-10-26 16:27:01'),
(114,'202510-16-3','2025-10-26','ventes','701000','Facture 16',0.00,6015033.00,'EUR',4500.0000,'16',NULL,'2025-10-26 16:27:01','2025-10-26 16:27:01');
/*!40000 ALTER TABLE `ecritures_comptables` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `expeditions`
--

DROP TABLE IF EXISTS `expeditions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `expeditions` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `commande_id` int(10) unsigned NOT NULL,
  `numero_bl` varchar(255) DEFAULT NULL,
  `numero_connaissement` varchar(255) DEFAULT NULL,
  `numero_packing_list` varchar(255) DEFAULT NULL,
  `date_expedition` date DEFAULT NULL,
  `date_arrivee_prevue` date DEFAULT NULL,
  `date_arrivee_reelle` date DEFAULT NULL,
  `transporteur` varchar(255) DEFAULT NULL,
  `mode_transport` varchar(50) DEFAULT NULL,
  `instructions_speciales` text DEFAULT NULL,
  `statut` enum('preparation','expédiée','transit','arrivée','livrée') DEFAULT 'preparation',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `expeditions`
--

LOCK TABLES `expeditions` WRITE;
/*!40000 ALTER TABLE `expeditions` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `expeditions` VALUES
(1,4,'BL-2024-001','CN-2024-001',NULL,'2024-01-20','2024-02-05',NULL,'CMA CGM','maritime',NULL,'expédiée','2025-10-21 12:02:05','2025-10-21 12:02:05'),
(2,5,'BL-2024-001','CON-2024-001','','2024-01-19','2024-02-14',NULL,'Maersk Line','maritime','','expédiée','2025-10-22 07:32:07','2025-10-23 06:43:24'),
(3,13,'BL-2024-013','CM-2024-013','PL-2024-013','2024-01-25','2024-02-10',NULL,'Maersk Line','maritime',NULL,'expédiée','2025-10-23 05:47:18','2025-10-23 05:47:18'),
(4,1,'BL-0001','CON-0001','PL-0001','2025-10-23','2025-11-04',NULL,'Maersk','Maritime','','livrée','2025-10-23 07:51:44','2025-10-23 08:25:54'),
(5,15,'BL-123','CON-123','PL-123','2025-10-22','2025-10-23',NULL,'','maritime','test','livrée','2025-10-23 08:09:04','2025-10-23 08:10:32'),
(6,2,'BL- 123','CON-123','PL-123','2025-10-23','2025-10-26',NULL,'test','aerien','test','preparation','2025-10-23 13:06:06','2025-10-23 13:06:06');
/*!40000 ALTER TABLE `expeditions` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `factures`
--

DROP TABLE IF EXISTS `factures`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `factures` (
  `numero_facture` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `type_facture` enum('proforma','facture','avoir') NOT NULL,
  `id_tiers` int(10) unsigned NOT NULL,
  `echeance` date DEFAULT NULL,
  `reglement` varchar(50) DEFAULT NULL,
  `total_ht` decimal(15,2) DEFAULT 0.00,
  `total_tva` decimal(15,2) DEFAULT 0.00,
  `total_ttc` decimal(15,2) DEFAULT 0.00,
  `statut` enum('brouillon','validee','annulee') DEFAULT 'brouillon',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `devise` varchar(3) DEFAULT 'MGA',
  `taux_change` decimal(10,4) DEFAULT 1.0000,
  `notes` text DEFAULT NULL,
  PRIMARY KEY (`numero_facture`),
  KEY `factures_id_tiers_foreign` (`id_tiers`),
  CONSTRAINT `factures_id_tiers_foreign` FOREIGN KEY (`id_tiers`) REFERENCES `tiers` (`id_tiers`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `factures`
--

LOCK TABLES `factures` WRITE;
/*!40000 ALTER TABLE `factures` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `factures` VALUES
(1,'2024-11-30','proforma',1,'2024-12-30','virement',2827000.00,565400.00,3392400.00,'validee','2025-10-20 06:44:04','2025-10-25 10:34:01','MGA',1.0000,''),
(2,'2024-12-15','proforma',3,'2025-01-15','cheque',650000.00,0.00,650000.00,'brouillon','2025-10-20 06:44:04','2025-10-20 06:44:04','MGA',1.0000,NULL),
(3,'2024-10-19','facture',1,'2025-10-20','virement',225000.00,45000.00,270000.00,'validee','2025-10-20 06:55:51','2025-10-20 09:26:56','MGA',1.0000,''),
(4,'2024-10-20','facture',2,'2024-11-20','virement',150000.00,30000.00,180000.00,'annulee','2025-10-20 06:57:06','2025-10-20 07:55:25','MGA',1.0000,''),
(5,'2025-10-20','proforma',3,'2025-11-19','virement',595000.00,19000.00,614000.00,'validee','2025-10-20 07:54:45','2025-10-20 07:54:46','MGA',1.0000,NULL),
(6,'2025-10-20','facture',2,'2025-11-19','virement',15000.00,3000.00,18000.00,'validee','2025-10-20 09:31:44','2025-10-20 09:31:44','MGA',1.0000,NULL),
(7,'2024-10-21','facture',1,'2024-11-21','virement',100000.00,20000.00,120000.00,'validee','2025-10-21 05:36:55','2025-10-21 05:36:55','MGA',1.0000,NULL),
(8,'2025-10-21','avoir',1,'2025-11-20','cheque',3995037.90,500001.60,4495039.50,'validee','2025-10-21 07:11:38','2025-10-21 07:11:38','USD',4200.0000,NULL),
(9,'2025-10-21','facture',2,'2025-11-20','virement',95000.00,19000.00,114000.00,'validee','2025-10-21 12:32:18','2025-10-21 12:32:18','MGA',1.0000,NULL),
(10,'2025-10-21','facture',2,'2025-11-20','virement',95000.00,19000.00,114000.00,'validee','2025-10-21 12:42:43','2025-10-21 12:42:44','MGA',1.0000,NULL),
(11,'2025-10-22','proforma',2,'2025-11-21','cheque',80000.00,16000.00,96000.00,'brouillon','2025-10-22 06:33:22','2025-10-22 06:33:22','MGA',1.0000,NULL),
(12,'2025-10-22','proforma',4,'2025-11-21','cheque',2515000.00,503000.00,3018000.00,'validee','2025-10-22 08:02:57','2025-10-22 08:02:58','MGA',1.0000,NULL),
(13,'2025-10-23','facture',4,'2025-11-22','espece',105000.00,21000.00,126000.00,'annulee','2025-10-25 07:25:24','2025-10-25 09:19:47','MGA',1.0000,''),
(14,'2025-10-24','facture',4,'2025-11-23','espece',567069.00,113413.80,680482.80,'validee','2025-10-26 12:45:04','2025-10-26 12:46:54','EUR',4500.0000,''),
(15,'2025-10-26','facture',1,'2025-11-25','cheque',13619988.00,2723997.60,16343985.60,'validee','2025-10-26 13:27:53','2025-10-26 13:27:54','EUR',4500.0000,NULL),
(16,'2025-10-23','proforma',3,'2025-11-22','cheque',8515033.00,1703006.60,10218039.60,'validee','2025-10-26 16:27:01','2025-10-27 08:07:20','EUR',4500.0000,'');
/*!40000 ALTER TABLE `factures` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `knex_migrations`
--

DROP TABLE IF EXISTS `knex_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `knex_migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `batch` int(11) DEFAULT NULL,
  `migration_time` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `knex_migrations`
--

LOCK TABLES `knex_migrations` WRITE;
/*!40000 ALTER TABLE `knex_migrations` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `knex_migrations` VALUES
(2,'20251003054404_create_comptabilite_tables.js',1,'2025-10-09 13:54:32'),
(3,'20251009134811_add_comptabilite_tables.js',2,'2025-10-09 13:56:15'),
(5,'20251020070000_add_referentiel_tables.js',3,'2025-10-21 08:26:13'),
(6,'20251021000006_create_import_export_final.js',4,'2025-10-21 08:32:08'),
(8,'20251023000001_create_crm_tables.js',5,'2025-10-23 15:24:52');
/*!40000 ALTER TABLE `knex_migrations` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `knex_migrations_lock`
--

DROP TABLE IF EXISTS `knex_migrations_lock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `knex_migrations_lock` (
  `index` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `is_locked` int(11) DEFAULT NULL,
  PRIMARY KEY (`index`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `knex_migrations_lock`
--

LOCK TABLES `knex_migrations_lock` WRITE;
/*!40000 ALTER TABLE `knex_migrations_lock` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `knex_migrations_lock` VALUES
(1,0);
/*!40000 ALTER TABLE `knex_migrations_lock` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `ligne_facture`
--

DROP TABLE IF EXISTS `ligne_facture`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `ligne_facture` (
  `id_ligne` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `numero_facture` int(10) unsigned NOT NULL,
  `code_article` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `quantite` decimal(10,2) NOT NULL,
  `prix_unitaire` decimal(15,2) NOT NULL,
  `taux_tva` decimal(5,2) NOT NULL,
  `remise` decimal(5,2) DEFAULT 0.00,
  `montant_ht` decimal(15,2) NOT NULL,
  `montant_tva` decimal(15,2) NOT NULL,
  `montant_ttc` decimal(15,2) NOT NULL,
  PRIMARY KEY (`id_ligne`),
  KEY `ligne_facture_numero_facture_foreign` (`numero_facture`),
  KEY `ligne_facture_code_article_foreign` (`code_article`),
  CONSTRAINT `ligne_facture_code_article_foreign` FOREIGN KEY (`code_article`) REFERENCES `articles` (`code_article`),
  CONSTRAINT `ligne_facture_numero_facture_foreign` FOREIGN KEY (`numero_facture`) REFERENCES `factures` (`numero_facture`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ligne_facture`
--

LOCK TABLES `ligne_facture` WRITE;
/*!40000 ALTER TABLE `ligne_facture` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `ligne_facture` VALUES
(4,2,'ART005','Formation avancée',1.00,500000.00,0.00,0.00,500000.00,0.00,500000.00),
(5,2,'ART004','Support technique',1.00,150000.00,0.00,0.00,150000.00,0.00,150000.00),
(8,5,'ART002','Souris USB',1.00,15000.00,20.00,0.00,15000.00,3000.00,18000.00),
(9,5,'ART003','Clavier Mécanique',1.00,80000.00,20.00,0.00,80000.00,16000.00,96000.00),
(10,5,'ART005','Formation Logiciel',1.00,500000.00,0.00,0.00,500000.00,0.00,500000.00),
(11,4,'ART002','Souris USB',1.00,150000.00,20.00,0.00,150000.00,30000.00,180000.00),
(12,3,'ART001','Ordinateur Portable',3.00,75000.00,20.00,0.00,225000.00,45000.00,270000.00),
(13,6,'ART002','Souris USB',1.00,15000.00,20.00,0.00,15000.00,3000.00,18000.00),
(14,7,'ART001','Ordinateur Portable',2.00,50000.00,20.00,0.00,100000.00,20000.00,120000.00),
(15,8,'ART001','Ordinateur Portable',1.00,2500008.00,20.00,0.00,2500008.00,500001.60,3000009.60),
(16,8,'ART005','Formation Logiciel',2.99,500010.00,0.00,0.00,1495029.90,0.00,1495029.90),
(17,9,'ART003','Clavier Mécanique',1.00,80000.00,20.00,0.00,80000.00,16000.00,96000.00),
(18,9,'ART002','Souris USB',1.00,15000.00,20.00,0.00,15000.00,3000.00,18000.00),
(19,10,'ART003','Clavier Mécanique',1.00,80000.00,20.00,0.00,80000.00,16000.00,96000.00),
(20,10,'ART002','Souris USB',1.00,15000.00,20.00,0.00,15000.00,3000.00,18000.00),
(21,11,'ART003','Clavier Mécanique',1.00,80000.00,20.00,0.00,80000.00,16000.00,96000.00),
(22,12,'ART002','Souris USB',1.00,15000.00,20.00,0.00,15000.00,3000.00,18000.00),
(23,12,'ART001','Ordinateur Portable hp',1.00,2500000.00,20.00,0.00,2500000.00,500000.00,3000000.00),
(28,13,'ART002','Souris USB',6.00,15000.00,20.00,0.00,90000.00,18000.00,108000.00),
(29,13,'ART002','Souris USB',1.00,15000.00,20.00,0.00,15000.00,3000.00,18000.00),
(30,1,'ART001','Ordinateur Portable Dell',1.00,2500000.00,20.00,0.00,2500000.00,500000.00,3000000.00),
(31,1,'ART002','Souris USB Logitech',2.00,15000.00,20.00,10.00,27000.00,5400.00,32400.00),
(32,1,'ART004','Maintenance installation',2.00,150000.00,20.00,0.00,300000.00,60000.00,360000.00),
(37,14,'ART003','Clavier Mécanique',5.00,80010.00,20.00,0.00,400050.00,80010.00,480060.00),
(38,14,'ART003','Clavier Mécanique',2.00,80010.00,20.00,5.00,152019.00,30403.80,182422.80),
(39,14,'ART002','Souris USB',1.00,15000.00,20.00,0.00,15000.00,3000.00,18000.00),
(40,15,'ART002','Souris USB',8.00,14985.00,20.00,0.00,119880.00,23976.00,143856.00),
(41,15,'ART001','Ordinateur Portable hp',6.00,2500020.00,20.00,10.00,13500108.00,2700021.60,16200129.60),
(50,16,'ART001','Ordinateur Portable hp',3.00,2500020.00,20.00,20.00,6000048.00,1200009.60,7200057.60),
(51,16,'ART002','Souris USB',1.00,14985.00,20.00,0.00,14985.00,2997.00,17982.00),
(52,16,'ART001','Ordinateur Portable hp',1.00,2500000.00,20.00,0.00,2500000.00,500000.00,3000000.00);
/*!40000 ALTER TABLE `ligne_facture` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `lignes_commande`
--

DROP TABLE IF EXISTS `lignes_commande`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `lignes_commande` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `commande_id` int(10) unsigned NOT NULL,
  `article_id` varchar(50) DEFAULT NULL,
  `description` varchar(255) NOT NULL,
  `quantite` decimal(10,2) NOT NULL,
  `prix_unitaire` decimal(15,2) NOT NULL,
  `taux_tva` decimal(5,2) DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lignes_commande`
--

LOCK TABLES `lignes_commande` WRITE;
/*!40000 ALTER TABLE `lignes_commande` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `lignes_commande` VALUES
(1,1,'1','Produit A',10.00,100.00,20.00,'2025-10-21 08:43:31','2025-10-21 08:43:31'),
(2,2,'1','Produit A',10.00,100.00,20.00,'2025-10-21 08:47:14','2025-10-21 08:47:14'),
(3,4,'ART001','Ordinateur Portable',2.00,2500000.00,20.00,'2025-10-21 08:54:03','2025-10-21 08:54:03'),
(4,5,'ART001','Poisson Surgelé',100.00,15000.00,20.00,'2025-10-21 12:00:47','2025-10-21 12:00:47'),
(5,6,'ART002','Souris USB',1.00,15000.00,20.00,'2025-10-22 05:36:12','2025-10-22 05:36:12'),
(6,6,'ART002','Souris USB',1.00,15000.00,20.00,'2025-10-22 05:36:12','2025-10-22 05:36:12'),
(7,7,'ART002','Souris USB',1.00,15000.00,20.00,'2025-10-22 05:43:06','2025-10-22 05:43:06'),
(8,7,'ART002','Souris USB',5.00,15000.00,20.00,'2025-10-22 05:43:06','2025-10-22 05:43:06'),
(9,8,'ART002','Souris USB',1.00,15000.00,20.00,'2025-10-22 06:35:59','2025-10-22 06:35:59'),
(10,8,'ART001','Ordinateur Portable hp',2.00,2500000.00,20.00,'2025-10-22 06:35:59','2025-10-22 06:35:59'),
(11,9,'ART001','Ordinateur Portable hp',1.00,2500000.00,20.00,'2025-10-22 06:44:40','2025-10-22 06:44:40'),
(12,10,'ART001','Produit test',10.00,1000.00,20.00,'2025-10-22 06:58:29','2025-10-22 06:58:29'),
(13,11,'ART002','Souris USB',1.00,15000.00,20.00,'2025-10-22 07:43:53','2025-10-22 07:43:53'),
(14,12,'ART001','Poisson Surgelé',100.00,15000.00,20.00,'2025-10-22 08:00:18','2025-10-22 08:00:18'),
(15,12,'ART001','Ordinateur Portable hp',1.00,2500000.00,20.00,'2025-10-22 08:00:18','2025-10-22 08:00:18'),
(16,13,'ART001','Poisson Surgelé',100.00,15000.00,20.00,'2025-10-22 08:12:57','2025-10-22 08:12:57'),
(17,14,'ART001','Poisson Surgelé',100.00,15000.00,20.00,'2025-10-23 06:59:05','2025-10-23 06:59:05'),
(18,14,'ART002','Souris USB',1.00,15000.00,20.00,'2025-10-23 06:59:05','2025-10-23 06:59:05'),
(19,15,'ART001','Ordinateur Portable hp',1.00,2500000.00,20.00,'2025-10-23 08:07:39','2025-10-23 08:07:39'),
(20,15,'ART002','Souris USB',1.00,15000.00,20.00,'2025-10-23 08:07:39','2025-10-23 08:07:39'),
(21,16,'ART001','Ordinateur Portable hp',1.00,2500000.00,20.00,'2025-10-25 09:01:35','2025-10-25 09:01:35'),
(22,16,'ART002','Souris USB',1.97,15000.00,20.00,'2025-10-25 09:01:35','2025-10-25 09:01:35'),
(23,17,'ART003','Clavier Mécanique',1.00,80000.00,20.00,'2025-10-25 10:17:25','2025-10-25 10:17:25'),
(24,18,'ART002','Souris USB',1.00,15000.00,20.00,'2025-10-25 10:34:45','2025-10-25 10:34:45');
/*!40000 ALTER TABLE `lignes_commande` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `paiements`
--

DROP TABLE IF EXISTS `paiements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `paiements` (
  `id_paiement` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `numero_facture` int(10) unsigned NOT NULL,
  `date_paiement` date NOT NULL,
  `montant` decimal(15,2) NOT NULL,
  `mode_paiement` enum('espèce','virement','chèque','carte') NOT NULL,
  `reference` varchar(255) DEFAULT NULL,
  `statut` enum('validé','en_attente','annulé') DEFAULT 'validé',
  `devise` varchar(3) DEFAULT 'MGA',
  `taux_change` decimal(10,4) DEFAULT 1.0000,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_paiement`),
  KEY `paiements_numero_facture_foreign` (`numero_facture`),
  CONSTRAINT `paiements_numero_facture_foreign` FOREIGN KEY (`numero_facture`) REFERENCES `factures` (`numero_facture`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `paiements`
--

LOCK TABLES `paiements` WRITE;
/*!40000 ALTER TABLE `paiements` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `paiements` VALUES
(1,1,'2024-01-20',474000.00,'virement','VIR001','validé','MGA',1.0000,NULL,'2025-10-10 12:17:37','2025-10-10 12:17:37'),
(2,1,'2024-01-20',474000.00,'virement','VIR001','validé','MGA',1.0000,NULL,'2025-10-10 12:22:52','2025-10-10 12:22:52'),
(3,1,'2024-01-20',200000.00,'virement','VIR002','validé','MGA',1.0000,NULL,'2025-10-10 12:23:26','2025-10-10 12:23:26'),
(4,1,'2024-01-20',200000.00,'virement','VIR002','validé','MGA',1.0000,NULL,'2025-10-10 14:53:21','2025-10-10 14:53:21'),
(5,1,'2024-10-11',100000.00,'espèce',NULL,'validé','MGA',1.0000,NULL,'2025-10-11 05:40:00','2025-10-11 05:40:00'),
(6,1,'2024-01-20',474000.00,'virement','VIR001','validé','MGA',1.0000,NULL,'2025-10-14 08:58:46','2025-10-14 08:58:46'),
(7,1,'2024-01-20',474000.00,'virement','VIR001','validé','MGA',1.0000,NULL,'2025-10-14 09:00:05','2025-10-14 09:00:05'),
(8,4,'2024-10-15',60000.00,'virement','TEST001','validé','MGA',1.0000,NULL,'2025-10-14 09:13:07','2025-10-14 09:13:07'),
(9,1,'2024-10-20',50000.00,'virement','VIR-TEST','validé','MGA',1.0000,NULL,'2025-10-20 06:08:20','2025-10-20 06:08:20');
/*!40000 ALTER TABLE `paiements` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `plan_comptable`
--

DROP TABLE IF EXISTS `plan_comptable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `plan_comptable` (
  `numero_compte` varchar(6) NOT NULL,
  `libelle` varchar(100) NOT NULL,
  `type_compte` enum('actif','passif','charge','produit') NOT NULL,
  `categorie` varchar(50) DEFAULT NULL,
  `actif` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `type` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`numero_compte`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plan_comptable`
--

LOCK TABLES `plan_comptable` WRITE;
/*!40000 ALTER TABLE `plan_comptable` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `plan_comptable` VALUES
('401000','Fournisseurs','actif','fournisseur',1,'2025-10-21 12:42:11','2025-10-21 12:42:11','classe4'),
('411000','Clients','actif','client',1,'2025-10-21 12:42:11','2025-10-21 12:42:11','classe4'),
('445600','TVA déductible','actif','tva',1,'2025-10-21 12:42:11','2025-10-21 12:42:11','classe4'),
('445700','TVA à payer','actif','tva',1,'2025-10-21 12:42:11','2025-10-21 12:42:11','classe4'),
('512000','Banque','actif','banque',1,'2025-10-21 12:42:11','2025-10-21 12:42:11','classe5'),
('531000','Caisse','actif','caisse',1,'2025-10-21 12:42:11','2025-10-21 12:42:11','classe5'),
('607000','Achats de marchandises','actif','achat',1,'2025-10-21 12:42:11','2025-10-21 12:42:11','classe6'),
('701000','Ventes de marchandises','actif','vente',1,'2025-10-21 12:42:11','2025-10-21 12:42:11','classe7');
/*!40000 ALTER TABLE `plan_comptable` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `referentiel_modes_paiement`
--

DROP TABLE IF EXISTS `referentiel_modes_paiement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `referentiel_modes_paiement` (
  `code` varchar(20) NOT NULL,
  `libelle` varchar(50) NOT NULL,
  `actif` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `referentiel_modes_paiement`
--

LOCK TABLES `referentiel_modes_paiement` WRITE;
/*!40000 ALTER TABLE `referentiel_modes_paiement` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `referentiel_modes_paiement` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `referentiel_taux_tva`
--

DROP TABLE IF EXISTS `referentiel_taux_tva`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `referentiel_taux_tva` (
  `taux` decimal(5,2) NOT NULL,
  `libelle` varchar(50) NOT NULL,
  `actif` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`taux`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `referentiel_taux_tva`
--

LOCK TABLES `referentiel_taux_tva` WRITE;
/*!40000 ALTER TABLE `referentiel_taux_tva` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `referentiel_taux_tva` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `referentiel_types_facture`
--

DROP TABLE IF EXISTS `referentiel_types_facture`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `referentiel_types_facture` (
  `code` varchar(20) NOT NULL,
  `libelle` varchar(50) NOT NULL,
  `actif` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `referentiel_types_facture`
--

LOCK TABLES `referentiel_types_facture` WRITE;
/*!40000 ALTER TABLE `referentiel_types_facture` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `referentiel_types_facture` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `relances`
--

DROP TABLE IF EXISTS `relances`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `relances` (
  `id_relance` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `tiers_id` int(10) unsigned NOT NULL,
  `type_relance` varchar(50) NOT NULL,
  `objet` varchar(255) NOT NULL,
  `message` text DEFAULT NULL,
  `date_relance` date NOT NULL,
  `echeance` date DEFAULT NULL,
  `statut` enum('en_attente','envoyee','traitee','annulee') DEFAULT 'en_attente',
  `canal` enum('email','telephone','courrier','sms') DEFAULT 'email',
  `facture_id` int(10) unsigned DEFAULT NULL,
  `contrat_id` int(10) unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id_relance`),
  KEY `tiers_id` (`tiers_id`),
  KEY `facture_id` (`facture_id`),
  KEY `contrat_id` (`contrat_id`),
  CONSTRAINT `relances_ibfk_1` FOREIGN KEY (`tiers_id`) REFERENCES `tiers` (`id_tiers`) ON DELETE CASCADE,
  CONSTRAINT `relances_ibfk_2` FOREIGN KEY (`facture_id`) REFERENCES `factures` (`numero_facture`),
  CONSTRAINT `relances_ibfk_3` FOREIGN KEY (`contrat_id`) REFERENCES `contrats` (`id_contrat`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `relances`
--

LOCK TABLES `relances` WRITE;
/*!40000 ALTER TABLE `relances` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `relances` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `taux_change`
--

DROP TABLE IF EXISTS `taux_change`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `taux_change` (
  `id_taux` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `devise_source` varchar(3) NOT NULL,
  `devise_cible` varchar(3) NOT NULL,
  `taux` decimal(10,4) NOT NULL,
  `date_effet` date NOT NULL,
  `actif` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_taux`),
  UNIQUE KEY `taux_change_devise_source_devise_cible_date_effet_unique` (`devise_source`,`devise_cible`,`date_effet`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `taux_change`
--

LOCK TABLES `taux_change` WRITE;
/*!40000 ALTER TABLE `taux_change` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `taux_change` VALUES
(9,'EUR','MGA',4500.0000,'2025-10-20',1,'2025-10-20 06:44:05','2025-10-20 06:44:05'),
(10,'USD','MGA',4200.0000,'2025-10-20',1,'2025-10-20 06:44:05','2025-10-20 06:44:05'),
(11,'MGA','EUR',0.0002,'2025-10-20',1,'2025-10-20 06:44:05','2025-10-20 06:44:05'),
(12,'MGA','USD',0.0002,'2025-10-20',1,'2025-10-20 06:44:05','2025-10-20 06:44:05'),
(13,'EUR','USD',1.0700,'2025-10-20',1,'2025-10-20 06:44:05','2025-10-20 06:44:05'),
(14,'USD','EUR',0.9300,'2025-10-20',1,'2025-10-20 06:44:05','2025-10-20 06:44:05');
/*!40000 ALTER TABLE `taux_change` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `tiers`
--

DROP TABLE IF EXISTS `tiers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `tiers` (
  `id_tiers` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `type_tiers` enum('client','fournisseur') NOT NULL,
  `nom` varchar(255) NOT NULL,
  `numero` varchar(50) DEFAULT NULL,
  `adresse` text DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `devise_preferee` varchar(3) DEFAULT 'MGA',
  `siret` varchar(14) DEFAULT NULL,
  `forme_juridique` varchar(100) DEFAULT NULL,
  `secteur_activite` varchar(100) DEFAULT NULL,
  `categorie` enum('prospect','client','fournisseur','partenaire') DEFAULT NULL,
  `chiffre_affaires_annuel` int(11) DEFAULT NULL,
  `effectif` int(11) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `site_web` varchar(255) DEFAULT NULL,
  `responsable_commercial` varchar(255) DEFAULT NULL,
  `date_premier_contact` date DEFAULT NULL,
  `date_derniere_activite` date DEFAULT NULL,
  PRIMARY KEY (`id_tiers`),
  UNIQUE KEY `tiers_numero_unique` (`numero`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tiers`
--

LOCK TABLES `tiers` WRITE;
/*!40000 ALTER TABLE `tiers` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `tiers` VALUES
(1,'client','client test','CLI001','123 Avenue de l\'Indépendance, Antananarivo','client@sarl.mg','+261 34 12 345 67','2025-10-20 06:44:04','2025-10-28 05:03:22','MGA','12345678901234','SARL','Commerce','client',80000000,25,'Client mis à jour via API curl','www.clientsarl.mg','Test API','2020-01-15',NULL),
(2,'fournisseur','Fournisseur Import','FRN001','456 Rue du Commerce, Tamatave','contact@import.mg','+261 33 12 345 68','2025-10-20 06:44:04','2025-10-20 06:44:04','MGA','98765432109876','SA','Import-Export','fournisseur',200000000,25,'Fournisseur principal pour les imports Chine','www.importfournisseur.mg','Marie Martin','2019-05-20',NULL),
(3,'client','Entreprise Service','CLI002','789 Boulevard de France, Antsirabe','info@service.mg','+261 32 12 345 69','2025-10-20 06:44:04','2025-10-20 06:44:04','MGA','55555555555555','SARL','Services','client',75000000,15,'Client pour services informatiques','www.entrepriseservice.mg','Paul Randria','2021-03-10',NULL),
(4,'fournisseur','ddaa','dd','aaa','ee@kddk.dl','1265','2025-10-22 06:33:49','2025-10-22 06:33:56','MGA',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `tiers` ENABLE KEYS */;
UNLOCK TABLES;
commit;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2025-10-28 10:30:50

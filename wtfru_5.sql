-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Client :  127.0.0.1
-- Généré le :  Jeu 05 Mars 2015 à 20:45
-- Version du serveur :  5.6.17
-- Version de PHP :  5.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de données :  `WTFRU`
--

-- --------------------------------------------------------

--
-- Structure de la table `favorite`
--

CREATE TABLE IF NOT EXISTS `favorite` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `favorite_id` varchar(50) NOT NULL,
  `user_id` varchar(50) NOT NULL,
  `nom` varchar(50) NOT NULL,
  `prenom` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Structure de la table `notification`
--

CREATE TABLE IF NOT EXISTS `notification` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `content` varchar(255) NOT NULL,
  `type` varchar(50) NOT NULL,
  `date` bigint(15) NOT NULL,
  `sender_id` varchar(50) NOT NULL,
  `sender_nom` varchar(255) NOT NULL,
  `sender_prenom` varchar(50) NOT NULL,
  `sender_wifidevice` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Doublure de structure pour la vue `notification_combined`
--
CREATE TABLE IF NOT EXISTS `notification_combined` (
`id` int(11)
,`content` varchar(255)
,`type` varchar(50)
,`date` bigint(15)
,`sender_id` varchar(50)
,`sender_nom` varchar(255)
,`sender_prenom` varchar(50)
,`sender_wifidevice` varchar(50)
,`notification_id` int(11)
,`receiver_id` varchar(50)
,`isViewed` tinyint(1)
);
-- --------------------------------------------------------

--
-- Structure de la table `notification_receiver`
--

CREATE TABLE IF NOT EXISTS `notification_receiver` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `notification_id` int(11) NOT NULL,
  `receiver_id` varchar(50) NOT NULL,
  `isViewed` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `ID_notification` (`notification_id`),
  KEY `ID_notification_2` (`notification_id`),
  KEY `ID_receiver` (`receiver_id`),
  KEY `receiver_id_2` (`receiver_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `id` varchar(50) NOT NULL,
  `slack_id` int(11) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `prenom` varchar(50) NOT NULL,
  `citation` varchar(255) NOT NULL DEFAULT '',
  `mail` varchar(255) NOT NULL,
  `website` varchar(255) DEFAULT NULL,
  `github` varchar(255) DEFAULT NULL,
  `dribbble` varchar(255) DEFAULT NULL,
  `behance` varchar(255) DEFAULT NULL,
  `twitter` varchar(255) DEFAULT NULL,
  `ghost_at` bigint(14) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la vue `notification_combined`
--
DROP TABLE IF EXISTS `notification_combined`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `notification_combined` AS select `notification`.`id` AS `id`,`notification`.`content` AS `content`,`notification`.`type` AS `type`,`notification`.`date` AS `date`,`notification`.`sender_id` AS `sender_id`,`notification`.`sender_nom` AS `sender_nom`,`notification`.`sender_prenom` AS `sender_prenom`,`notification`.`sender_wifidevice` AS `sender_wifidevice`,`notification_receiver`.`notification_id` AS `notification_id`,`notification_receiver`.`receiver_id` AS `receiver_id`,`notification_receiver`.`isViewed` AS `isViewed` from (`notification` left join `notification_receiver` on((`notification`.`id` = `notification_receiver`.`notification_id`)));

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

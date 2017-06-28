/*
Navicat MySQL Data Transfer

Source Server         : MySQL(localhost)
Source Server Version : 50713
Source Host           : localhost:3306
Source Database       : tns_adsurvey_2017

Target Server Type    : MYSQL
Target Server Version : 50713
File Encoding         : 65001

Date: 2017-06-28 10:54:11
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for agency
-- ----------------------------
DROP TABLE IF EXISTS `agency`;
CREATE TABLE `agency` (
  `id` varchar(4) NOT NULL,
  `name` varchar(100) NOT NULL,
  `seq` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for answer
-- ----------------------------
DROP TABLE IF EXISTS `answer`;
CREATE TABLE `answer` (
  `datetime` datetime DEFAULT NULL,
  `qno` varchar(10) NOT NULL,
  `answer` varchar(100) DEFAULT NULL,
  `agency_id` varchar(4) NOT NULL,
  `optional` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`qno`,`agency_id`),
  KEY `fk_answer` (`agency_id`),
  CONSTRAINT `fk_answer` FOREIGN KEY (`agency_id`) REFERENCES `agency` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for category
-- ----------------------------
DROP TABLE IF EXISTS `category`;
CREATE TABLE `category` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for category_config
-- ----------------------------
DROP TABLE IF EXISTS `category_config`;
CREATE TABLE `category_config` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `seq` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for discipline
-- ----------------------------
DROP TABLE IF EXISTS `discipline`;
CREATE TABLE `discipline` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `category_name` varchar(100) NOT NULL,
  `value` double DEFAULT NULL,
  `sheet` int(11) DEFAULT NULL,
  `agency_id` varchar(4) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_discipline` (`agency_id`),
  CONSTRAINT `fk_discipline` FOREIGN KEY (`agency_id`) REFERENCES `agency` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=106800 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for discipline_config
-- ----------------------------
DROP TABLE IF EXISTS `discipline_config`;
CREATE TABLE `discipline_config` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `seq` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for log
-- ----------------------------
DROP TABLE IF EXISTS `log`;
CREATE TABLE `log` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `datetime` datetime DEFAULT NULL,
  `filename` varchar(100) DEFAULT NULL,
  `status` varchar(100) DEFAULT NULL,
  `agency_id` varchar(4) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_log` (`agency_id`),
  CONSTRAINT `fk_log` FOREIGN KEY (`agency_id`) REFERENCES `agency` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=112 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for sub_discipline
-- ----------------------------
DROP TABLE IF EXISTS `sub_discipline`;
CREATE TABLE `sub_discipline` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `percent` double DEFAULT NULL,
  `discipline_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_sub_discipline` (`discipline_id`),
  CONSTRAINT `fk_sub_discipline` FOREIGN KEY (`discipline_id`) REFERENCES `discipline` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13250 DEFAULT CHARSET=utf8;

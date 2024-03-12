create database Voting;
use Voting;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    uniqueId VARCHAR(255) UNIQUE NOT NULL,
    emailOrPhone VARCHAR(255) NOT NULL,
    publicKey VARCHAR(255) NOT NULL,
    privateKey VARCHAR(255) NOT NULL
);

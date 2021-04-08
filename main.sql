drop database CigQuitDB;
create database CigQuitDB;
use CigQuitDB;

create table users (
	 id int not null auto_increment,
     email varchar(100) unique not null,
     firstName varchar(30) not null,
     lastName varchar(30) not null,
     quitDate date,
	 cigCount int,
     cigPerPack int,
     moneyPerPack decimal(19,4),
     password varchar(100) not null,
     primary key (id)
);

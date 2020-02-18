create database if not exists movieland_db;
use movieland_db;

create table if not exists movie(
  movie_id bigint auto_increment primary key,
  name varchar(255) not null,
  release_date date,
  description mediumtext,
  poster_url mediumtext,
  tmdb_id bigint
);

create table if not exists user(
  id bigint(20) auto_increment primary key,
  created_at datetime not null,
  updated_at datetime not null,
  email varchar(40),
  name varchar(40) not null,
  username varchar(15) not null,
  password varchar(100) not null
);


create table if not exists movie_show(
  show_id bigint(20) auto_increment primary key,
  movie_id bigint(20) not null,
  release_date datetime not null,
  constraint fk_movie foreign key (movie_id) references movie(movie_id) on delete cascade
);

create table if not exists reservation(
  reservation_id bigint(20) auto_increment primary key,
  show_id bigint(20) not null,
  user_id bigint(20) not null,
  constraint fk_res_show foreign key (show_id) references movie_show(show_id) on delete cascade,
  constraint fk_res_user foreign key (user_id) references user(id) on delete cascade

);


create table if not exists role
(
    id   bigint auto_increment primary key,
    name enum ('ROLE_USER','ROLE_ADMIN')
);

create table if not exists user_roles
(
    user_id bigint not null ,
    role_id bigint not null ,
    primary key(user_id,role_id),
    constraint fk_roles_user foreign key (user_id) references user (id) on delete cascade,
    constraint fk_roles_role foreign key (role_id) references role (id) on delete cascade
);


insert ignore into movie (movie_id,name, release_date,description) values (1,'Star Wars', '2019-12-16', 'a long time ago');
insert ignore into movie (movie_id,name, release_date,description) values (2,'Star Wars 2', '2021-12-16', 'absdfv dsfg');
insert ignore into movie (movie_id,name, release_date,description) values (3,'Indiana Jones', '1982-10-12', 'harrison ford out in the jungle');
insert ignore into movie (movie_id,name, release_date,description) values (4,'Whiplash', '2014-10-05', 'a young drummer trying');
insert ignore into movie (movie_id,name, release_date,description) values (5,'Harry Potter', '2001-10-10', 'the boy who lived');


insert ignore into role(id,name)
values (1,'ROLE_USER');
insert ignore into role(id,name)
values (2,'ROLE_ADMIN');

insert ignore into user(id,name, username, email, password,created_at,updated_at)
values (1,'Phil Key', 'admin', 'admin@mail.com', '$2y$12$Acf9PQ6h1DWx32zMHm21fuNgBlJtWQX2Jy5mOpNKuzJ/8RZ36NCYm',curdate(),curdate());
insert ignore into user(id,name, username, email, password,created_at,updated_at)
values (2,'User1', 'user', 'user@mail.com', 'user12$2y$12$AfVLbRmeothlAwQUrcAPFOAPavqN5BRt8gSn5SecB1koT42eh3Gd63',curdate(),curdate());

insert ignore into user_roles (user_id, role_id)
values ((select id from user where username = 'admin'), (select id from role where name = 'ROLE_ADMIN'));
insert ignore into user_roles (user_id, role_id)
values ((select id from user where username = 'admin'), (select id from role where name = 'ROLE_USER'));

insert ignore into user_roles (user_id, role_id)
values ((select id from user where username = 'user'), (select id from role where name = 'ROLE_USER'));




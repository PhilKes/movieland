
Set @dateToday= MAKEDATE(year(now()),dayofyear(now()));
Set @dateToday = DATE_ADD(@dateToday, INTERVAL 16 HOUR);

SET @dateYesterday = DATE_ADD(@dateToday, INTERVAL -1 DAY);
SET @dateTomorrow = DATE_ADD(@dateToday, INTERVAL 1 DAY);

--Insert dummy 'admin' pw: 'admin123' + 'user' pw: 'user123' Users
insert ignore into user(id,name, username, email, password,created_at,updated_at)
values (1,'phil key', 'admin', 'admin@mail.com', '$2a$10$Lw5/489i7k8V/Qek2OgqEO9GCz2J3tnNHzNcvZX1A2v55wg8WuK12',curdate(),curdate());
insert ignore into user(id,name, username, email, password,created_at,updated_at)
values (2,'user1', 'user', 'user@mail.com', '$2a$10$MQGBtAf9B.5ZM8Snk/NyhutjjOszgyaJ/5FcqWD8b2d3egKitJHmm',curdate(),curdate());

insert ignore into role(id,name)
values (1,'ROLE_USER');
insert ignore into role(id,name)
values (2,'ROLE_ADMIN');

-- Set roles of dummy 'admin' + 'user' Users
insert ignore into user_roles (user_id, role_id)
values ((select id from user where username = 'admin'), (select id from role where name = 'ROLE_ADMIN'));
insert ignore into user_roles (user_id, role_id)
values ((select id from user where username = 'admin'), (select id from role where name = 'ROLE_USER'));
insert ignore into user_roles (user_id, role_id)
values ((select id from user where username = 'user'), (select id from role where name = 'ROLE_USER'));

--Insert dummy Movies
insert ignore into movie (movie_id,name, release_date,description) values (1,'Star Wars', '2019-12-16', 'A long time ago');
insert ignore into movie (movie_id,name, release_date,description) values (2,'Star Wars Return of the Jedi', '2021-12-16', 'absdfv dsfg');
insert ignore into movie (movie_id,name, release_date,description) values (3,'Indiana Jones', '1982-10-12', 'Harrison Ford out in the jungle');
insert ignore into movie (movie_id,name, release_date,description) values (4,'Whiplash', '2014-10-05', 'A young drummer trying');
insert ignore into movie (movie_id,name, release_date,description) values (5,'Harry Potter', '2001-10-10', 'The boy who lived');


set @maxSeatType= 4;
--Shows for yesterday
insert ignore INTO movie_show (movie_id, release_date) select  movie_id, @dateYesterday FROM movie;
INSERT ignore INTO reservation ( show_id, user_id,validated, method,total_sum) select  s.show_id, u.id, true, 0, 7  from movie_show s, user u where s.release_date = @dateYesterday and u.username ='user';
insert ignore INTO seat ( seat_nr, reservation_id,type) select 1,r.reservation_id, floor((RAND() * @maxSeatType))  from reservation r, movie_show s where r.show_id = s.show_id and s.release_date = @dateYesterday;

--Shows for today
insert ignore INTO movie_show (movie_id, release_date) select movie_id, @dateToday FROM movie;
INSERT ignore INTO reservation (show_id, user_id,validated, method,total_sum) select s.show_id, u.id, true, 0, 7  from movie_show s, user u where s.release_date = @dateToday and u.username ='user';
insert ignore INTO seat (seat_nr, reservation_id,type) select 1,r.reservation_id, floor((RAND() * @maxSeatType))  from reservation r, movie_show s where r.show_id = s.show_id and s.release_date = @dateToday;

--Shows for tomorrow
insert ignore INTO movie_show (movie_id, release_date) select movie_id, @dateTomorrow FROM movie;
INSERT ignore INTO reservation (show_id, user_id,validated, method,total_sum) select s.show_id, u.id, true, 0, 7  from movie_show s, user u where s.release_date = @dateTomorrow and u.username ='user';
insert ignore INTO seat (seat_nr, reservation_id,type) select  1,r.reservation_id, floor((RAND() * @maxSeatType))  from reservation r, movie_show s where r.show_id = s.show_id and s.release_date = @dateTomorrow;





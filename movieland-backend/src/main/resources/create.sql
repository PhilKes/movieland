create table movie (movie_id bigint not null auto_increment, release_date datetime, description varchar(255), length bigint, name varchar(255), poster_url varchar(255), tmdb_id bigint, primary key (movie_id)) ;
create table movie_show (show_id bigint not null auto_increment, release_date datetime, movie_id bigint not null, primary key (show_id)) ;
create table reservation (reservation_id bigint not null auto_increment, cashier_id bigint, method integer, show_id bigint, total_sum double precision, user_id bigint, validated bit, primary key (reservation_id)) ;
create table role (id bigint not null auto_increment, name varchar(60), primary key (id)) ;
create table seat (seat_id bigint not null auto_increment, seat_nr integer, reservation_id bigint, type integer, primary key (seat_id)) ;
create table user (id bigint not null auto_increment, created_at datetime not null, updated_at datetime not null, email varchar(40), name varchar(40), password varchar(100), username varchar(15), primary key (id)) ;
create table user_roles (user_id bigint not null, role_id bigint not null, primary key (user_id, role_id)) ;
alter table role add constraint UK_epk9im9l9q67xmwi4hbed25do unique (name);
alter table user add constraint UKsb8bbouer5wak8vyiiy4pf2bx unique (username);
alter table user_roles add constraint FKrhfovtciq1l558cw6udg0h0d3 foreign key (role_id) references role (id);
alter table user_roles add constraint FK55itppkw3i07do3h7qoclqd4k foreign key (user_id) references user (id);

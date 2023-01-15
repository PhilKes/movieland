insert into role (id,name) VALUES (1,'ROLE_USER');
insert into role (id,name) VALUES (2,'ROLE_ADMIN');
insert into role (id,name) VALUES (3,'ROLE_CASHIER');

INSERT INTO public."user"(id, "name", username, email, "password") values (2, 'admin', 'admin', 'admin@admin.de', 'pbkdf2:sha256:260000$W6TtXaVsA3DtBEjV$9e398a7ec1e663c0fca28fea13edfda389ddbe86976eb58533903736cb584d69');
INSERT INTO public."user"(id, "name", username, email, "password") values (3, 'user', 'user', 'user@user.com', 'pbkdf2:sha256:260000$wTPv43YFTnS9MaVS$630765c1c15e84b68ab3a6f1de5cf4d858dacf4173334c9922922f4018399c8b');

INSERT INTO public."UserRole"(user_id, role_id) values (2, 1);
INSERT INTO public."UserRole"(user_id, role_id) values (2, 2);
INSERT INTO public."UserRole" (user_id, role_id) values (3, 1);

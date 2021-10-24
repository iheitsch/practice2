drop table dosanas;
create table dosanas( id int unsigned not null auto_increment, xval int not null, yval int not null, primary key(id) );
grant select on dosanas to irene@localhost;
insert into dosanas (xval, yval) values (2, -1), (3, 0), (5, 1), (7, 1), (8, 0), (9, -2), (9, -4), (8, -5), (6, -6), (3, -6), (2, -5);
insert into dosanas (xval, yval) values (2, -3), (1, -1), (0, 1), (1, 2), (-1, 3), (1, 2), (2, 3), (3, 3), (4, 2), (6, 1), (7, 1), (8, 0);
insert into dosanas (xval, yval) values (10, 1), (10, 2), (8, 3), (7, 3), (5, 2), (4, 2), (5, 2), (7, 3), (7, 4), (4, 5), (-2, 5), (-7, 3);
insert into dosanas (xval, yval) values (-9, -1), (-9, -5), (-8, -6), (-8, -9), (-7, -8), (-7, -6), (-6, -5), (-5, -3), (-5, -2), (-3, 0);
insert into dosanas (xval, yval) values (-1, 0), (-1, -2), (0, -2), (-1, -2), (-2, -1), (-1, -2), ( -1, 0), (1, -1), (2, -3), (2, -5);
insert into dosanas (xval, yval) values (1, -6), (-1, -7), (-2, -7), (-4, -6), (-5, -5), (-5, -3), (-6, -5), (-7, -6), (-6, -4), (-5, -1);
insert into dosanas (xval, yval) values (-4, 0), (-2, 1), (0, 1);

drop table pont;
create table pont( id int unsigned not null auto_increment, xval int not null, yval int not null, primary key(id) );
grant select on pont to irene@localhost;
insert into pont (xval, yval) values (10, -7), (9, -8), (9, 2), (9, 0), (7, -5), (7, 2), (5, -2), (5, 2), (3, -1), (3, 2), (1, 0), (1, 2), (-1, 0);
insert into pont (xval, yval) values (-1, 2), (-1, 0), (-3, 2), (-3, 0), (-5, 2), (-5, -1), (-7, 2), (-7, -2), (-9, 2), (-9, -5), (-10, -2);
insert into pont (xval, yval) values (-10, -7), (-7, -2), (-3, 0), (1, 0), (5, -2), (9, -8), (9, -9), (10, -9), (10, 2), (-10, 2), (-10, 4);
insert into pont (xval, yval) values (-7, 4), (-7, 2), (-6, 2), (-6, 4), (-2, 4), (-2, 2), (-1, 2), (-1, 4), (3, 4), (4, 2);

drop table banandose;
create table banandose( id int unsigned not null auto_increment, xval int not null, yval int not null, primary key(id) );
grant select on banandose to irene@localhost;
insert into banandose (xval, yval) values (-2, 2), (-3, -1), (-2, -2), (3, -2), (3, -3), (4, -3), (5, -2), (5, -1), (4, 0), (0, 0), (0, 1);
insert into banandose (xval, yval) values (0, 0), (3, 0), (3, 1), (2, 2), (4, 0), (6, 0), (6, 1), (7, 2), (7,5), (6, 4), (7, 3), (5, 5), (5, 4);
insert into banandose (xval, yval) values (5, 5), (4, 4), (5, 5), (2, 6), (0, 5), (-2, 5), (-4, 4), (-6, 2), (-7, -1), (-7, -3), (-6, -5), (-7, -6);
insert into banandose (xval, yval) values (-8, -5), (-8, -4), (-7, -3), (-6, -5), (-7, -6), (-7, -7), (-6, -7), (-2, -8), (-1, -8), (0, -7); 
insert into banandose (xval, yval) values (-1, -6), (-5, -6), (-2, -5), (-1, -3), (-2, -5), (-5, -6), (-2, -6), (0, -5), (2, -2), (0, -5);
insert into banandose (xval, yval) values (-2, -6), (1, -6), (1, -4), (1, -6), (2, -8), (4, -8), (4, -7), (3, -6), (3, -2), (3,-4), (4, -5);
insert into banandose (xval, yval) values (4, -6), (3, -6), (5, -6), (6, -5), (6, -4), (5, -3), (4, -4), (3, -4);

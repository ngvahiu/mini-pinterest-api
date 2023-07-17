create DATABASE pinterest;
use pinterest;

create table `user`(
	user_id int auto_increment,
	email varchar(255),
	password varchar(255),
	fullname varchar(255),
	age int,
	avatar	varchar(255),
	primary key (user_id)
);


create table image(
	image_id int auto_increment,
	title varchar(255),
	url varchar(255),
	description varchar(255),
	user_id int,
	primary key (image_id)
);

alter table image
add constraint FK_image_user foreign key(user_id) references `user`(user_id);

create table save_image(
	user_id int auto_increment,
	image_id int,
	save_date date,
	primary key (user_id,image_id)
);

alter table save_image
add constraint FK_saveimage_image foreign key(image_id) references image(image_id) on delete cascade;
alter table save_image
add constraint FK_saveimage_user foreign key(user_id) references `user`(user_id) on delete cascade;

create table `comment`(
	comment_id int auto_increment,
	user_id int NOT NULL,
	image_id int NOT NULL,
	content varchar(255),
	comment_date datetime,
	primary key(comment_id)
);

alter table `comment`
add constraint FK_comment_user foreign key(user_id) references `user`(user_id) on delete cascade;
alter table `comment`
add constraint FK_comment_image foreign key(image_id) references `image`(image_id) on delete cascade;
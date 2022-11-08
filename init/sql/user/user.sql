create table if not exists userinfo(
    user_id char(64) not null primary key comment '用户唯一键',
    username char(14) not null unique comment '用户名',
    password char(255) comment '密码的sha-256加密后的结果',
    token_id char(255) unique comment 'token值'
) charset=utf8mb4 collate=utf8mb4_general_ci;

create table if not exists user_info_detail(
    user_id char(64) not null primary key comment '用户唯一ID',
    user_describe text comment '用户的自我介绍',
    avator text comment '用户的头像地址',
    birthday date comment '出生日期',
    sex char(2) comment '性别',
    unionid char(64) comment '微信的用户唯一标识'
) charset=utf8mb4 collate=utf8mb4_general_ci;

create view v_user_info as select userinfo.user_id, username, user_describe, avator, birthday, sex, token_id
 from userinfo left join user_info_detail on userinfo.user_id = user_info_detail.user_id;

create trigger token_update after insert on idiom_token
for each row
update userinfo set token_id = new.token_id where user_id = new.user_id;

create table if not exists userinfo(
    user_id char(64) not null primary key comment '用户唯一键',
    username char(14) not null unique comment '用户名',
    password char(255) unique comment '密码的sha-256加密后的结果',
    token_id char(255) not null unique comment 'token值'
);
create table if not exists user_info_detail(
    user_id char(64) not null primary key comment '用户唯一ID',
    user_describe text comment '用户的自我介绍',
    avator text comment '用户的头像地址',
    birthdate date comment '出生日期',
    sex char(1) comment '性别',
    unionid char(64) comment '微信的用户唯一标识'
);



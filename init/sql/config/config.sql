create table if not exists idiom_admin(
    admin_user char(64) not null primary key comment '管理员唯一键',
    password char(255) not null comment '密码'
);




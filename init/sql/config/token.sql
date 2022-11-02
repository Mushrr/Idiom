create table if not exists idiom_token(
    token_id char(64) not null primary key comment 'token',
    user_id char(64) not null comment '用户id' unique,
    expired datetime not null comment '过期时间',
    ip char(32) comment 'ip地址',
    is_expired char(1) not null comment '是否已经过期'
);
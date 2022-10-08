create table if not exists idiom_token(
    token_id char(64) not null primary key comment 'token',
    expired datetime not null comment '过期时间',
    ip char(32) comment 'ip地址',
    is_exipred char(1) not null comment '是否已经过期'
);
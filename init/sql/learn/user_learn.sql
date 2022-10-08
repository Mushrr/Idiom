
create table if not exists user_learn(
    user_id char(64) not null primary key comment '用户id',
    last_learning_id char(255) comment '用户上次学习ID，可以通过检索快速回到上次学习进度'
);


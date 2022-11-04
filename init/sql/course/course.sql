create table if not exists course(
    course_id char(64) not null primary key comment '课程id',
    developer char(64) not null comment '开发者id',
    course_name varchar(32) not null comment '课程标题',
    course_out_img text comment '课程外部图片',   
    course_times int comment '课程访问次数',
    course_score decimal(3,2) comment '课程分数'
) charset=utf8mb4 collate=utf8mb4_general_ci;




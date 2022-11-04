-- 游戏表
create table if not exists game(
    game_id char(64) not null  comment '游戏ID',
    game_name char(64) not null comment '游戏名称',
    developer char(64) not null  comment '游戏开发者ID',
    route char(64) not null  comment '前端游戏路由',
    times int comment '游玩次数',
    score decimal(3,2) comment '游戏分数',
    primary key(game_id, developer, route)
) charset=utf8mb4 collate=utf8mb4_general_ci;
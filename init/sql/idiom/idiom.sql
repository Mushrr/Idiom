create table if not exists idiom(
    idiom_code char(32) not null unique primary key comment '成语的唯一编码，成语一共大概5万多条',
    story_code char(32) unique comment '成语的来源编码，用于索引成语的故事来源，可以为空，待找到来源之后再设置索引',
    usage_code char(32) not null unique comment '成语的用法，比方说如何造句',
    recommend_code char(32) not null unique comment '成语的属性编码one-hot?，主要用于内容推荐'
) charset=utf8mb4 collate=utf8mb4_general_ci;

create table if not exists idiom_detail(
    idiom_code char(32) not null unique primary key comment '成语的唯一编码，成语一共大概5万多条',
    text char(32) not null comment '成语的内容',
    pronounce text comment '暂不确定，有可能是URL编码表示图片，有可能直接用字符表示',
    times int comment '搜索的总数'
)charset=utf8mb4 collate=utf8mb4_general_ci;

create table if not exists idiom_story(
    story_code char(32) not null comment '成语的来源编码，用于索引成语的故事来源，可以为空，待找到来源之后再设置索引',
    story_pattern varchar(32) not null comment '成语故事的类型是方便记忆的，还是史书上记载的，亦或者是应用的小故事',
    story_id char(32) not null unique comment '成语的故事ID',
    primary key(story_code, story_id)
) charset=utf8mb4 collate=utf8mb4_general_ci;


create table if not exists usage_detail(
    usage_code char(32) not null comment ' 成语的释义id',
    usage_id char(32) not null comment '释义ID，为了应对一词多义',
    idiom_text text not null comment '释义',
    last_change datetime not null comment '上次修改的时间',
    primary key (usage_code, usage_id)  
) charset=utf8mb4 collate=utf8mb4_general_ci;





create index idiom_text_ind on idiom_detail(idiom_text);

create index idiom_usage_text_ind on usage_detail(idiom_text(32));
create table events (
    id integer primary key autoincrement,
    action text,
    browserType text not null,
    fbcCookie text,
    timestamp datetime not null,
    url text not null
);

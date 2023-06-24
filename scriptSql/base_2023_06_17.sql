drop table if exists relations;
drop table if exists entities;

create table entities (
    entity_id serial not null,
    entity_type smallint not null,
    entity_name text not null,
    contact_details jsonb,
    address_details jsonb,
    address_postcode text,
    address_city text,
    address_state smallint,
    constraint pk_entities primary key (entity_id) 
);

create table relations (
    parent_id int not null,
    child_id int not null,
    relation_name text,
    note text,
    constraint pk_relations primary key (parent_id, child_id),
    constraint fk_parent_id foreign key (parent_id) references entities(entity_id), 
    constraint fk_child_id foreign key (child_id) references entities(entity_id)
);



-- dummy data
insert into entities (entity_type, entity_name) values 
(1, 'Mr. Bean'),
(1, 'Mr. yyy'),
(1, 'Mr. xxx'),
(1, 'Mr. Ben')

select * from entities
select 
                 entity_id,entity_type,entity_name,contact_details,address_details,address_postcode,address_city,address_state 
             from entities 
             where entity_id = 1 
             and entity_type = 1;


SELECT * FROM pg_stat_activity where application_name = 'deno_postgres';

select * from entities;
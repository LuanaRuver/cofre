
create database cofrinho;

create table usuarios (
	id serial primary key,
	nome varchar(60),
	email varchar(60) unique,
	senha varchar(250)
);

create table transacoes (
	id serial primary key,
    valor integer,
    data timestamptz DEFAULT now(),
    usuario_id integer references usuarios(id),
    tipo varchar(100)
);


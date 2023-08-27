# Cofrinho

Esta API permite ao usuário guardar informações sobre transações de entrada e saida de valores monetários.

Dentre suas funcionalidades estão:

-   Cadastrar usuário;
-   Fazer login;
-   Cadastrar transações;
-   Obter extrato de transações;
-   Obter saldo.


**Exemplo:**

**Cadastrar usuário:** 

#### `POST` `/usuario`

```json
{
	"nome": "teste",
	"email": "teste@teste.com",
	"senha" : "1234"
}

// Preview:

{
	"id": 1,
	"nome": "teste",
	"email": "teste@teste.com"
}
```

**Fazer login:**
#### `POST` `/login`

```json
{
    "email": "teste@teste.com",
	"senha" : "1234"
}

// Preview:

{
	"usuario": {
		"id": 1,
		"email": "teste@teste.com",
	    "senha" : "1234"
	},
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjkzMTY5OTg5fQ.REICqxbXKPpD9uLSzN4sAMJWbk9VhwtsFyZSq9mOgN4"
}
```
**Cadastrar transação:**
#### `POST` `/transacao`

```json
{
	"valor":"1000",
	"tipo":"entrada"
}

//ou

{
	"valor":"1000",
	"tipo":"saida"
}
```
Inserir token gerado em login conforme imagem: 

![](image.png)

```json
//Preview:

{
	"id": 1,
	"valor": 1000,
	"data": "2023-08-27T20:49:18.005Z",
	"usuario_id": 1,
	"tipo": "entrada"
}
```
**Obter saldo:**
#### `GET` `/transacao`

Inserir token gerado em login conforme imagem: 

![](image.png)

```json
//Preview:

{
	"Entrada": "1000",
	"Saida": "0",
	"Saldo": 1000
}
```

**Obter extrato de transações:**
#### `GET` `/transacao/extrato`

Inserir token gerado em login conforme imagem: 

![](image.png)

```json

//Preview:

{
	"extrato": {
		"saldo": 1000,
		"entrada": "1000",
		"saida": 0
	},
	"movimentacoes": [
		{
			"id": 1,
			"valor": 1000,
			"data": "2023-08-27T19:50:03.371Z",
			"usuario_id": 1,
			"tipo": "entrada"
		}
    ]
}
```
**Lembre-se:**
-   Faça a instalação dos pacotes npm;
-   Execute o arquivo "dump.sql" em um aplicativo de gerenciamento de banco de dados para criar o banco de dados;
-   Crie o arquivo ".env" para armazenar as credenciais de acesso necessárias conforme arquivo ".env exemple";
-   Execute a API no terminal através do comando "npm run dev".

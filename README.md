# 🎮 Forge Games

Sistema de gerenciamento para loja de jogos e consoles, desenvolvido como projeto
avaliativo da disciplina **Testes de Software** (Prof. Reinaldo Jr.) — SENAI FATESG.

> Projeto N2 — Desenvolvimento de Sistema com Testes Automatizados

---

## Sumário

1. [Integrantes do grupo](#1-integrantes-do-grupo)
2. [A ideia por trás do projeto](#2-a-ideia-por-trás-do-projeto)
3. [Problema resolvido](#3-problema-resolvido)
4. [Público-alvo](#4-público-alvo)
5. [Funcionalidades](#5-funcionalidades)
6. [Tecnologias utilizadas](#6-tecnologias-utilizadas)
7. [Arquitetura](#7-arquitetura)
8. [Modelagem de dados](#8-modelagem-de-dados)
9. [Segurança e autenticação](#9-segurança-e-autenticação)
10. [Estrutura de pastas](#10-estrutura-de-pastas)
11. [Como executar — back-end](#11-como-executar--back-end)
12. [Como executar — front-end](#12-como-executar--front-end)
13. [Banco de dados](#13-banco-de-dados)
14. [Dados de demonstração (seed)](#14-dados-de-demonstração-seed)
15. [Endpoints da API](#15-endpoints-da-api)
16. [Testes automatizados](#16-testes-automatizados)
17. [Resultados dos testes](#17-resultados-dos-testes)
18. [Identidade visual](#18-identidade-visual)
19. [Vídeo demonstrativo](#19-vídeo-demonstrativo)
20. [Possíveis evoluções futuras](#20-possíveis-evoluções-futuras)

---

## 1. Integrantes do Grupo

- Lucca Lopes Araújo
- Christian Amsberg Janner
- Lucas Valadares

## 2. A ideia por trás do projeto

O trabalho pedia um sistema com duas entidades de negócio (CRUDs completos, com pelo
menos 5 atributos cada) mais um CRUD de usuários com login real, testado por três
camadas diferentes de teste automatizado (unitário, API e end-to-end). Em vez de montar
um domínio genérico só para cumprir a especificação, escolhemos um tema que o grupo
curte de verdade: uma loja de jogos e consoles.

O nome **Forge Games** é uma referência ao modo **Forge** do Halo — o editor que deixa o
jogador criar seus próprios mapas e modos a partir do zero — e também carrega o sentido
literal de "forjar", que combina com a ideia de construir algo do início ao fim, peça por
peça, assim como o próprio projeto foi construído.

## 3. Problema Resolvido

Lojas de jogos e consoles (físicas ou pequenos e-commerces) costumam controlar vendas e
estoque de forma manual — cadernos, planilhas soltas, anotações separadas — o que causa
erros de contagem de estoque e falta de um histórico organizado de pedidos. O Forge
Games centraliza:

- o cadastro de produtos (consoles, jogos físicos, jogos digitais e acessórios);
- o registro de pedidos, com cálculo automático do valor e baixa automática de estoque;
- o controle de usuários com login autenticado de verdade (JWT), não apenas uma tela de
  login decorativa.

## 4. Público-Alvo

Pequenos lojistas e e-commerces de jogos, consoles e acessórios que precisam de uma
ferramenta simples para controlar produtos, estoque e pedidos sem depender de planilhas
manuais, e sem a complexidade de um ERP completo.

## 5. Funcionalidades

- **Autenticação real** via login (JWT), com senha armazenada em hash (BCrypt)
- **CRUD completo de Produtos** (nome, descrição, preço, categoria, quantidade em
  estoque)
- **CRUD completo de Pedidos** (produto, quantidade, data, valor total calculado,
  status)
  - Baixa automática de estoque ao criar um pedido
  - Rejeição do pedido quando a quantidade solicitada excede o estoque disponível
  - Transição de status `PENDENTE` → `CONCLUIDO` (botão "Concluir")
  - Devolução do estoque ao excluir um pedido
- **CRUD completo de Usuários** (nome, email, senha com hash, papel)
- **Dashboard** com indicadores em tempo real:
  - produtos cadastrados, pedidos realizados
  - **vendas confirmadas** (soma dos pedidos `CONCLUIDO`) separada de **pendente de
    confirmação** (soma dos pedidos `PENDENTE`) — para nunca contar uma venda que ainda
    não foi fechada como dinheiro em caixa
- **Tema claro/escuro**, persistido no navegador
- **Conversão de moeda** (BRL/USD/EUR/GBP) com cotação do dia, calculada automaticamente
  sobre o valor em reais
- **Layout responsivo** com menu lateral (sidebar no desktop, menu compacto em telas
  pequenas)
- **Feedback visual** (toasts) para todas as operações de cadastro, edição e exclusão,
  com mensagens de erro específicas (ex.: impedir a exclusão de um produto que já tem
  pedidos associados, em vez de uma mensagem genérica de erro)
- **Identidade visual própria**, com paleta inspirada no universo Xbox/Halo/Gears of War

## 6. Tecnologias Utilizadas

**Back-end**
- Java 21
- Spring Boot 4.1.1 (Spring Web, Spring Data JPA, Spring Security, Bean Validation)
- Banco de dados H2 (arquivo local, sem necessidade de instalação de SGBD externo)
- JWT (`io.jsonwebtoken` / jjwt) para autenticação
- BCrypt para hash de senhas
- Maven

**Front-end**
- Angular 18 (standalone components, sem NgModules)
- TypeScript
- RxJS
- Componentes próprios (ícones SVG inline, sistema de toasts) — sem dependências
  externas de UI, para manter o projeto leve e sem riscos de instalação de última hora

**Testes**
- JUnit 5 + Mockito (testes unitários)
- REST-assured (testes de API)
- Selenium WebDriver (testes end-to-end, via Microsoft Edge)

## 7. Arquitetura

Arquitetura cliente-servidor em camadas, com front-end e back-end como processos
independentes que se comunicam via HTTP/JSON:

```
┌─────────────────────────┐        HTTP/JSON + Bearer Token (JWT)        ┌──────────────────────────┐
│   Front-end (Angular)   │ ───────────────────────────────────────────▶ │   Back-end (Spring Boot)  │
│      localhost:4200     │ ◀─────────────────────────────────────────── │      localhost:8080       │
└─────────────────────────┘                                              └──────────────────────────┘
                                                                                       │
                                                                                       ▼
                                                                   ┌──────────────────────────────────┐
                                                                   │  Controlador → Serviço → Repositório  │
                                                                   │  Segurança: SecurityConfig +          │
                                                                   │  JwtAuthenticationFilter              │
                                                                   └──────────────────────────────────┘
                                                                                       │
                                                                                       ▼
                                                                          Banco H2 (arquivo local)
```

Camadas do back-end: `entidade`, `repositorio`, `servico`, `controlador`, `dto`,
`security`, `config`. Erros são tratados de forma centralizada por um
`@RestControllerAdvice` (`TratadorDeExcecoes`), que padroniza todas as respostas de erro
em `{"erro": "mensagem"}`, garantindo que o front-end sempre receba uma mensagem clara e
específica — nunca um erro genérico de servidor.

## 8. Modelagem de Dados

**Produto** (entidade de negócio 1) — 6 atributos:
| Atributo | Tipo | Observação |
|---|---|---|
| id | Long | gerado automaticamente |
| nome | String | obrigatório |
| descricao | String | opcional |
| preco | BigDecimal | obrigatório, > 0 |
| categoria | String | ex.: Console, Jogo Físico, Jogo Digital, Acessório |
| quantidadeEmEstoque | Integer | obrigatório, ≥ 0 |

**Pedido** (entidade de negócio 2) — 6 atributos, com relacionamento:
| Atributo | Tipo | Observação |
|---|---|---|
| id | Long | gerado automaticamente |
| produto | Produto (`@ManyToOne`) | chave estrangeira `produto_id` |
| quantidade | Integer | obrigatório, > 0 |
| dataPedido | LocalDate | obrigatório |
| valorTotal | BigDecimal | calculado automaticamente = preço × quantidade |
| status | String | `PENDENTE` ou `CONCLUIDO` |

**Usuario** (entidade de autenticação) — 5 atributos:
| Atributo | Tipo | Observação |
|---|---|---|
| id | Long | gerado automaticamente |
| nome | String | obrigatório |
| email | String | obrigatório, único, validado |
| senha | String | obrigatório, armazenado como hash BCrypt |
| papel | String | ex.: ADMIN, FUNCIONARIO |

## 9. Segurança e Autenticação

- Login via `POST /auth/login`, retornando um token JWT
- O front-end envia o token em todas as requisições protegidas via interceptor HTTP
  (`Authorization: Bearer <token>`)
- Senhas nunca são armazenadas em texto plano — sempre em hash BCrypt
- Endpoints protegidos exigem token válido (`SecurityConfig` + `JwtAuthenticationFilter`)
- Sessão stateless (sem sessão de servidor — cada requisição é autenticada
  individualmente pelo token)

## 10. Estrutura de Pastas

```
forge-games/
├── backend/
│   ├── src/main/java/com/forgegames/sistema/
│   │   ├── entidade/        # Produto, Pedido, Usuario
│   │   ├── repositorio/     # Spring Data JPA repositories
│   │   ├── servico/         # regras de negócio
│   │   ├── controlador/     # endpoints REST
│   │   ├── dto/             # objetos de transferência/validação
│   │   ├── security/        # JWT, UserDetailsService
│   │   └── config/          # SecurityConfig, DadosIniciais, TratadorDeExcecoes
│   └── src/test/java/com/forgegames/sistema/
│       ├── servico/         # testes JUnit (unitários)
│       ├── api/             # testes REST-assured
│       └── integracao/      # testes Selenium (E2E)
└── frontend/
    └── src/app/
        ├── auth/            # tela de login
        ├── dashboard/        # indicadores
        ├── produtos/         # CRUD de produtos
        ├── pedidos/          # CRUD de pedidos
        ├── usuarios/         # CRUD de usuários
        ├── core/             # services, guards, interceptors, models, pipes
        └── shared/           # navbar (sidebar), ícones, toasts
```

## 11. Como Executar — Back-end

1. Abrir a pasta `backend/` no IntelliJ IDEA (ou outra IDE com suporte a Maven)
2. Aguardar o download das dependências Maven
3. Executar a classe `SistemaApplication.java` (botão Run)
4. A API estará disponível em `http://localhost:8080`
5. Usuários criados automaticamente no primeiro start (veja a [seção 14](#14-dados-de-demonstração-seed)):
   - `admin@forgegames.com` / `admin123`
   - `lucca@forgegames.com` / `lucca123`
   - `lucas@forgegames.com` / `lucas123`

Alternativa via terminal (dentro da pasta `backend/`):
```
mvn spring-boot:run
```

## 12. Como Executar — Front-end

1. Ter Node.js instalado (versão 18 ou superior)
2. Abrir um terminal na pasta `frontend/`
3. Instalar as dependências:
```
npm install
```
4. Iniciar o servidor de desenvolvimento:
```
npm start
```
5. Acessar `http://localhost:4200` no navegador
6. Fazer login com qualquer um dos usuários listados acima

**Importante:** o back-end precisa estar rodando em `http://localhost:8080` antes de usar
o front-end, pois ele consome a API diretamente.

## 13. Banco de Dados

Não é necessário instalar nenhum banco de dados externo. O projeto usa **H2 em modo
arquivo**, configurado em `backend/src/main/resources/application.properties`. O arquivo
do banco é criado automaticamente na pasta `backend/data/` na primeira execução
(`spring.jpa.hibernate.ddl-auto=update`).

Tabelas: `produto`, `pedido` (com chave estrangeira `produto_id`), `usuario`.

Console web do H2 disponível em `http://localhost:8080/h2-console`
(JDBC URL: `jdbc:h2:file:./data/forgegamesdb`, usuário `sa`, senha em branco).

## 14. Dados de Demonstração (Seed)

Na primeira execução do back-end (tabelas vazias), a classe `DadosIniciais.java` popula o
banco automaticamente com:

- **3 usuários** (admin + 2 funcionários)
- **12 produtos**, cobrindo as 4 categorias (consoles, jogos físicos, jogo digital e
  acessórios): Xbox Series X, Xbox Series S, PlayStation 5, Nintendo Switch 2, Halo
  Infinite, Gears of War: E-Day, Call of Duty: Black Ops 7, Mortal Kombat 1, Forza
  Horizon 5, Controle Xbox Wireless, Headset HyperX Cloud II, Volante Logitech G29
- **17 pedidos**, com status variados (concluídos e pendentes), já com o estoque de cada
  produto coerente com as vendas simuladas

Esse carregamento só roda se a tabela correspondente estiver vazia — ele não duplica
registros em execuções seguintes.

## 15. Endpoints da API

| Método | Rota | Descrição | Autenticado |
|---|---|---|---|
| POST | `/auth/login` | Autentica e retorna o token JWT | Não |
| POST | `/auth/registrar` | Cadastra um novo usuário | Não |
| GET | `/produtos` | Lista todos os produtos | Sim |
| GET | `/produtos/{id}` | Busca um produto por id | Sim |
| POST | `/produtos` | Cadastra um produto | Sim |
| PUT | `/produtos/{id}` | Atualiza um produto | Sim |
| DELETE | `/produtos/{id}` | Exclui um produto | Sim |
| GET | `/pedidos` | Lista todos os pedidos | Sim |
| GET | `/pedidos/{id}` | Busca um pedido por id | Sim |
| POST | `/pedidos` | Cria um pedido (calcula total e debita estoque) | Sim |
| PUT | `/pedidos/{id}/status` | Atualiza o status do pedido | Sim |
| DELETE | `/pedidos/{id}` | Exclui um pedido (devolve estoque) | Sim |
| GET | `/usuarios` | Lista todos os usuários | Sim |
| GET | `/usuarios/{id}` | Busca um usuário por id | Sim |
| POST | `/usuarios` | Cadastra um usuário | Sim |
| PUT | `/usuarios/{id}` | Atualiza um usuário | Sim |
| DELETE | `/usuarios/{id}` | Exclui um usuário | Sim |

## 16. Testes Automatizados

| Tipo | Classe | Quantidade | O que valida |
|---|---|---|---|
| JUnit (unitário) | `ProdutoServiceTest` | 1 | Rejeição de cadastro com preço ≤ 0 |
| JUnit (unitário) | `PedidoServiceTest` | 3 | Cálculo do valor total, rejeição por estoque insuficiente, débito de estoque |
| REST-assured (API) | `PedidoApiTest` | 3 | Criação de pedido com cálculo correto, rejeição de login inválido, bloqueio de acesso sem token |
| Selenium (E2E) | `ForgeGamesSeleniumTest` | 2 | Login + cadastro de produto, login + exclusão de produto |

**Executar os testes unitários (JUnit):**
```
mvn test -Dtest=ProdutoServiceTest,PedidoServiceTest
```
Não é necessário o back-end estar rodando — são testes isolados com Mockito.

**Executar os testes REST-assured:**
```
mvn test -Dtest=PedidoApiTest
```
Esses testes sobem a aplicação automaticamente em uma porta aleatória
(`@SpringBootTest(webEnvironment = RANDOM_PORT)`).

**Executar os testes Selenium (E2E):**

Pré-requisitos: Microsoft Edge instalado; back-end (`mvn spring-boot:run`) e front-end
(`npm start`) rodando.
```
mvn test -Dtest=ForgeGamesSeleniumTest
```
O Selenium abre o Edge automaticamente (via Selenium Manager, sem configuração manual de
driver) e executa o fluxo de login, cadastro e exclusão de produto, usando atributos
`data-testid` no HTML para não depender de texto visível na tela (o que tornaria os
testes frágeis a qualquer mudança visual).

## 17. Resultados dos Testes

*(Preencher após a execução real dos testes na máquina de desenvolvimento, com prints ou
saída do terminal — não inventar resultados, conforme exigido na avaliação.)*

| Tipo de teste | Quantidade | Status |
|---|---|---|
| JUnit (unitário) | 4 | A executar e preencher |
| REST-assured (API) | 3 | A executar e preencher |
| Selenium (E2E) | 2 | A executar e preencher |

## 18. Identidade Visual

O projeto adota uma identidade "gamer", inspirada no universo Xbox/Halo/Gears of War:

- Paleta verde escuro sobre fundo grafite/preto no modo escuro, e verde mais contido
  sobre branco/cinza no modo claro
- Números de indicadores no dashboard em fonte monoespaçada, remetendo a um HUD de jogo
- Sidebar com textura sutil e brilho na marca
- Botões e cards com leves efeitos de brilho/gradiente no hover
- Ícones em SVG próprio (sem dependência de bibliotecas externas de ícones)

## 19. Vídeo Demonstrativo

Link do vídeo (máximo 5 minutos) mostrando o sistema funcionando e a execução de todos os
testes automatizados: https://youtu.be/OnPWk-2x8Ag (não listado)

## 20. Possíveis Evoluções Futuras

- Paginação e busca na listagem de produtos e pedidos
- Perfis de acesso diferenciados por papel de usuário (hoje o campo `papel` é apenas
  informativo)
- Relatórios de vendas por período
- Migração do H2 para um banco relacional de produção (PostgreSQL/MySQL)

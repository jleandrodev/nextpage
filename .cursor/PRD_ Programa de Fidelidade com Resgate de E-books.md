# PRD Revisado: Plataforma Banca Online de Ebooks (MVP)

*Este documento foi revisado e substitui a versão anterior, com base no briefing detalhado da proposta de desenvolvimento.*

## 1\. Introdução/Overview

Este documento descreve os requisitos para a criação de uma plataforma web funcional em sua versão MVP (Produto Mínimo Viável) chamada "Banca Online de Ebooks". A plataforma terá dois perfis de acesso principais: um **Admin Master**, responsável por toda a gestão de e-books e pontos, e o **Cliente Final**, que resgata os e-books utilizando os pontos recebidos.

O objetivo é criar uma base sólida e funcional, focando nas operações essenciais, para futuras evoluções.

## 2\. User Roles (Perfis de Usuário)

1. **Admin Master:** O superusuário do sistema, responsável por toda a configuração e gerenciamento da plataforma.  
2. **Cliente Final:** O cliente da loja que recebe os pontos e os utiliza para resgatar e-books.

*(Nota: A figura do "Lojista" está fora do escopo deste MVP e se comunicará com o Admin Master externamente à plataforma.)*

## 3\. User Stories (Histórias de Usuário)

### Admin Master

* **Como Admin,** eu quero poder fazer login em uma área administrativa segura para gerenciar a plataforma.  
* **Como Admin,** eu quero poder cadastrar, editar e excluir e-books (incluindo título, autor, descrição, arquivo e capa) para manter o catálogo atualizado.  
* **Como Admin,** eu quero poder fazer o upload de uma planilha (`.csv`/`.xlsx`) com CPFs e pontos para distribuir créditos aos clientes de forma massiva.  
* **Como Admin,** eu quero que o sistema valide os CPFs da planilha, atualize os pontos de clientes existentes e crie um registro para novos clientes.  
* **Como Admin,** eu quero poder visualizar um relatório de todos os e-books resgatados, com filtros, para acompanhar a utilização da plataforma.

### Cliente Final

* **Como Cliente,** eu quero poder fazer login na plataforma usando meu CPF (ou e-mail) e uma senha.  
* **Como Cliente,** eu quero um processo simples para criar minha senha no meu primeiro acesso, após receber meus primeiros pontos.  
* **Como Cliente,** eu quero ver meu saldo de pontos e um histórico de quando recebi pontos assim que entro na minha conta.  
* **Como Cliente,** eu quero navegar por um catálogo de e-books e filtrá-los por nome ou categoria para encontrar o que desejo.  
* **Como Cliente,** eu quero resgatar um e-book com um clique e ter meus pontos atualizados automaticamente.  
* **Como Cliente,** eu quero acessar uma "Minha Biblioteca" para ver todos os e-books que já resgatei e poder baixá-los a qualquer momento.

## 4\. Functional Requirements (Requisitos Funcionais)

### RF-A: Autenticação

1. **RF-A1:** O sistema deve possuir uma tela de login única.  
2. **RF-A2:** O **Admin Master** deve conseguir fazer login com suas credenciais pré-definidas.  
3. **RF-A3:** O **Cliente Final** deve conseguir fazer login com CPF (ou e-mail) e senha.  
4. **RF-A4:** Deve existir um fluxo para o **primeiro acesso do Cliente**, permitindo que ele crie sua senha após seu CPF ser adicionado à base via planilha.

### RF-B: Painel Admin Master

#### Gerenciamento de E-books

5. **RF-B1:** O Admin deve ter uma área para **cadastrar** um novo e-book, com os seguintes campos: Título, Autor, Descrição, Upload do Arquivo do E-book (ex: PDF), e Upload da Imagem de Capa.  
6. **RF-B2:** O Admin deve conseguir **listar** todos os e-books cadastrados.  
7. **RF-B3:** O Admin deve conseguir **editar** ou **excluir** e-books existentes.

#### Gerenciamento de Pontos via Planilha

8. **RF-B4:** O Admin deve ter uma interface para fazer **upload de uma planilha** (`.csv` ou `.xlsx`) contendo as colunas `CPF` e `Pontos`.  
9. **RF-B5:** O sistema deve processar a planilha, validando os CPFs: se o CPF já existe, seus pontos são somados; se não existe, um novo registro de cliente é criado com os pontos informados.  
10. **RF-B6:** O Admin deve ver um **relatório simples** da última planilha processada (ex: data do upload, total de pontos carregados).

#### Relatório de Resgates

11. **RF-B7:** O Admin deve ter acesso a um relatório listando **todos os resgates** de e-books.  
12. **RF-B8:** Este relatório deve ser **filtrável por CPF do cliente, nome do e-book e data**.

### RF-C: Área do Cliente Final

#### Dashboard de Pontos

13. **RF-C1:** Ao logar, o cliente deve ver um **dashboard** com a quantidade total de **pontos atuais**.  
14. **RF-C2:** O dashboard também deve exibir um **histórico simples de recebimento** de pontos (data e quantidade recebida).

#### Catálogo de E-books

15. **RF-C3:** O cliente deve poder visualizar uma **listagem de e-books** disponíveis para resgate.  
16. **RF-C4:** A listagem deve possuir um **filtro** por nome e/ou categoria.  
17. **RF-C5:** O cliente deve poder clicar em um botão "Resgatar". O sistema deve exibir uma **confirmação** antes de concluir a ação.  
18. **RF-C6:** Ao confirmar, o sistema deve validar e subtrair o ponto do saldo do cliente e atualizar a tela.

#### Minha Biblioteca (Meus E-books)

19. **RF-C7:** O cliente deve ter uma área "Minha Biblioteca" que lista todos os e-books já resgatados.  
20. **RF-C8:** Para cada e-book na biblioteca, deve haver uma **opção clara para download** do arquivo.

## 5\. Non-Goals (Fora do Escopo para esta Versão)

* Painel para Lojistas.  
* Gateway de pagamento para compra de pontos.  
* Relatórios avançados para o Admin (gráficos, dashboards analíticos).  
* Envio automático de e-mails ou notificações transacionais (ex: "Você recebeu pontos\!").  
* Histórico detalhado de transações de pontos (apenas o recebimento simples).

## 6\. Technical Considerations (Considerações Técnicas)

* **Regra de Negócio Chave:** O resgate deve seguir a regra de **1 ponto \= 1 e-book**, conforme especificado.  
* **Interface:** Conforme solicitado anteriormente, o design deve ser **limpo, simples e funcional**, sem a necessidade de seguir uma identidade visual específica nesta fase.

## 7\. Success Metrics (Métricas de Sucesso)

* Entrega de todas as funcionalidades do MVP no prazo acordado.  
* Admin Master consegue gerenciar e-books e pontos de forma autônoma.  
* Taxa de login e resgate por parte dos clientes finais.  
* Zero erros críticos no processo de upload de planilhas e resgate de e-books.

## 8\. Open Questions (Questões em Aberto)

* Qual será o mecanismo exato para o **primeiro acesso do cliente**? O sistema enviará um link para criação de senha ao e-mail (se houver) ou o cliente deverá usar uma opção "Primeiro Acesso / Criar Senha" na tela de login informando seu CPF?

# Plano de Implementação Técnica: Banca Online de Ebooks

**Stack:**

* **Framework:** Next.js (com App Router)  
* **Backend & DB:** Supabase (Auth, Database, Storage, Edge Functions)  
* **UI:** shadcn/ui (componentes) & Tailwind CSS (estilização)

---

## Parte 1: Setup do Backend (Supabase)

### 1.1. Schema do Banco de Dados

Crie as seguintes tabelas no editor de tabelas do Supabase:

* **`profiles`**: Para armazenar dados dos usuários.  
    
  * `id` (uuid, Chave Primária, FK para `auth.users.id`)  
  * `cpf` (text, unique)  
  * `email` (text, unique)  
  * `full_name` (text, nullable)  
  * `points` (int4, default: 0\)  
  * `role` (text, default: 'cliente') \-\> Será 'cliente' ou 'admin'.  
  * `created_at` (timestamptz)


* **`ebooks`**: Para o catálogo.  
    
  * `id` (uuid, Chave Primária)  
  * `title` (text)  
  * `author` (text)  
  * `description` (text)  
  * `cover_image_url` (text) \-\> URL da imagem no Supabase Storage.  
  * `ebook_file_url` (text) \-\> URL do arquivo no Supabase Storage.  
  * `category` (text, nullable) \-\> Para o filtro simples.  
  * `created_at` (timestamptz)


* **`redemptions` (Resgates)**: Histórico de resgates.  
    
  * `id` (uuid, Chave Primária)  
  * `user_id` (uuid, FK para `profiles.id`)  
  * `ebook_id` (uuid, FK para `ebooks.id`)  
  * `redeemed_at` (timestamptz)


* **`points_history`**: Histórico de recebimento de pontos.  
    
  * `id` (uuid, Chave Primária)  
  * `user_id` (uuid, FK para `profiles.id`)  
  * `points_added` (int4)  
  * `source_description` (text) \-\> Ex: "Upload da planilha 2024-10-26"  
  * `created_at` (timestamptz)

### 1.2. Configuração de Autenticação

1. **Habilitar Autenticação:** Em `Supabase > Authentication`, habilite o provedor de Email/Senha.  
2. **Desabilitar Confirmação de Email:** Para o MVP, pode ser mais simples desabilitar a confirmação de e-mail em `Settings > Auth` para agilizar o primeiro acesso.  
3. **RLS (Row Level Security):** Ative a RLS em todas as tabelas e crie as políticas de segurança.  
   * **Exemplo de Política (profiles):** `(auth.uid() = id) OR (get_my_claim('user_role') = 'admin')` \-\> Permite que um usuário veja/edite seu próprio perfil ou que um admin veja/edite qualquer perfil.  
   * **Exemplo de Política (ebooks):** Usuários autenticados podem ler (`SELECT`). Apenas admins podem escrever (`INSERT`, `UPDATE`, `DELETE`).

### 1.3. Supabase Storage

1. Crie dois buckets públicos (ou com acesso via RLS):  
   * `ebook_covers`: para as imagens de capa dos e-books.  
   * `ebook_files`: para os arquivos PDF/EPUB dos e-books.

### 1.4. Supabase Edge Function (Para Upload de Pontos)

1. Crie uma Edge Function chamada `process-points-sheet`.  
2. **Lógica da Função:**  
   * Recebe o arquivo (`.csv`/`.xlsx`) enviado pelo painel do Admin.  
   * Usa uma biblioteca como `xlsx` ou `papaparse` para ler os dados.  
   * Para cada linha (`cpf`, `pontos`):  
     * Verifica se um perfil com aquele CPF já existe na tabela `profiles`.  
     * Se existir, atualiza os pontos (`UPDATE`).  
     * Se não existir, cria um novo perfil (`INSERT`).  
     * Registra a adição na tabela `points_history`.  
   * Retorna um status de sucesso com um resumo (ex: "X usuários atualizados, Y novos usuários criados").

---

## Parte 2: Implementação do Frontend (Next.js \+ shadcn/ui)

### 2.1. Setup Inicial

1. **Instalar Next.js e Supabase:**

```shell
npx create-next-app@latest
npm install @supabase/auth-helpers-nextjs @supabase/supabase-js
```

2. **Configurar shadcn/ui:**

```shell
npx shadcn-ui@latest init
```

3. **Configurar Variáveis de Ambiente:** Crie um arquivo `.env.local` com as chaves do seu projeto Supabase (`NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`).

### 2.2. Telas e Componentes

#### 🔐 Autenticação (Rotas: `/login`, `/primeiro-acesso`)

* **Tarefas:**  
  * Criar formulário de login que aceita CPF ou E-mail.  
  * Implementar a lógica de login usando `supabase.auth.signInWithPassword()`.  
  * Criar fluxo de primeiro acesso/redefinição de senha (`updateUser`).  
  * Proteger rotas usando o middleware do Next.js com os Auth Helpers do Supabase.  
* **Componentes shadcn/ui:** `Card`, `Input`, `Button`, `Label`, `Toast` (para feedback).

#### 📚 Área do Cliente Final

* **Dashboard (Rota: `/dashboard`)**  
  * **Tarefas:** Fetch e exibição dos pontos atuais (`profiles.points`) e do histórico de recebimento (`points_history`).  
  * **Componentes shadcn/ui:** `Card`, `Table`.  
* **Catálogo de Ebooks (Rota: `/catalogo`)**  
  * **Tarefas:** Fetch e exibição da lista de `ebooks`. Implementar filtro por nome/categoria. Criar o botão "Resgatar" que abre um diálogo de confirmação.  
  * **Componentes shadcn/ui:** `Input` (para filtro), `Card` (para cada ebook), `Button`, `Dialog` (para confirmação).  
* **Minha Biblioteca (Rota: `/biblioteca`)**  
  * **Tarefas:** Fetch da tabela `redemptions` com um `JOIN` na tabela `ebooks` para exibir os e-books resgatados pelo usuário logado. Botão de download direto para o `ebook_file_url`.  
  * **Componentes shadcn/ui:** `Card`, `Table`, `Button`.

#### 🛠️ Painel Admin Master (Rotas: `/admin/*`)

* **Gerenciar Ebooks (Rota: `/admin/ebooks`)**  
  * **Tarefas:** Criar uma tabela para listar os e-books. Formulário (em uma página `/admin/ebooks/novo` ou em um `Dialog`) para cadastrar/editar e-books, incluindo o upload da capa e do arquivo para o Supabase Storage.  
  * **Componentes shadcn/ui:** `Table`, `Button`, `Dialog`, `Input`, `Textarea`. Para o upload, use um componente customizado ou uma biblioteca como `react-dropzone`.  
* **Gerenciamento de Pontos (Rota: `/admin/pontos`)**  
  * **Tarefas:** Criar um formulário de upload de arquivo que envia a planilha para a Edge Function `process-points-sheet`. Exibir o resumo retornado pela função.  
  * **Componentes shadcn/ui:** `Card`, `Input` (type="file"), `Button`, `Toast`.  
* **Relatório de Resgates (Rota: `/admin/relatorios/resgates`)**  
  * **Tarefas:** Criar uma tabela que busca dados da tabela `redemptions` (com `JOIN` em `profiles` e `ebooks`). Implementar os inputs de filtro por CPF, e-book e data.  
  * **Componentes shadcn/ui:** `Table`, `Input`, `DatePicker` (do shadcn), `Button`.


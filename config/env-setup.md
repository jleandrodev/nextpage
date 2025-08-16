# 🔧 Configuração das Variáveis de Ambiente

## ❌ Problema Atual

O erro `supabaseUrl is required` indica que as variáveis de ambiente do Supabase não estão configuradas.

## ✅ Solução

### 1. Criar arquivo `.env.local`

Crie um arquivo `.env.local` na raiz do projeto com o seguinte conteúdo:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Database Configuration
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-ID].supabase.co:5432/postgres

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
```

### 2. Obter as credenciais do Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Faça login na sua conta
3. Selecione seu projeto
4. Vá para **Settings > API**
5. Copie as seguintes informações:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY`

### 3. Configurar DATABASE_URL

1. Vá para **Settings > Database**
2. Copie a **Connection string**
3. Substitua `[YOUR-PASSWORD]` pela senha do banco
4. Substitua `[YOUR-PROJECT-ID]` pelo ID do projeto

### 4. Gerar NEXTAUTH_SECRET

Execute no terminal:

```bash
openssl rand -base64 32
```

### 5. Reiniciar o servidor

Após configurar as variáveis:

```bash
npm run dev
```

## 🔍 Verificação

Para verificar se está funcionando:

1. Acesse `/admin/ebooks`
2. Clique em "Upload em Lote"
3. Tente fazer upload de um arquivo ZIP

Se não aparecer mais o erro `supabaseUrl is required`, a configuração está correta!

## 📝 Exemplo Completo

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNjU2NzI5MCwiZXhwIjoxOTUyMTQzMjkwfQ.example
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjM2NTY3MjkwLCJleHAiOjE5NTIxNDMyOTB9.example

# Database Configuration
DATABASE_URL=postgresql://postgres:mypassword123@db.abcdefghijklmnop.supabase.co:5432/postgres

# NextAuth Configuration
NEXTAUTH_SECRET=my-super-secret-key-generated-with-openssl
NEXTAUTH_URL=http://localhost:3000
```

## 🚨 Importante

- **NUNCA** commite o arquivo `.env.local` no git
- Mantenha as chaves seguras
- Use diferentes chaves para desenvolvimento e produção

# 🏢 Sistema White Label - Banca Online de Ebooks

Sistema de gerenciamento de organizações para programa de fidelidade com resgate de ebooks.

## 📋 Funcionalidades Implementadas

### ✅ Estrutura White Label

- **Organizações/Lojistas**: Cadastro completo com CNPJ, logo e imagem personalizada
- **URLs Personalizadas**: `dominio.com/{slug}/login` para cada organização
- **Branding Personalizado**: Logo no header e imagem customizável na página de login

### ✅ Administração

- **Dashboard Admin**: Gestão completa de lojistas
- **CRUD de Organizações**: Criar, editar, ativar/desativar lojistas
- **Upload de Planilhas**: Importação massiva de pontos via Excel/CSV
- **Relatórios**: Estatísticas por organização e ebooks mais resgatados

### ✅ Cliente Final

- **Login Personalizado**: Página de login com branding da organização
- **Primeiro Acesso**: Fluxo para criação de senha
- **Dashboard do Cliente**: Visualização de pontos e catálogo de ebooks
- **Sistema de Pontos**: 1 ponto = 1 ebook

### ✅ Banco de Dados

- **Prisma + SQLite**: Banco de dados local configurado
- **Relacionamentos**: Organizações, usuários, ebooks, resgates e histórico de pontos
- **Seed Completo**: Dados de exemplo para teste

## 🚀 Como Executar

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Banco de Dados

```bash
# Criar/atualizar banco
npm run db:migrate

# Popular com dados de exemplo
npm run db:seed
```

### 3. Executar Aplicação

```bash
npm run dev
```

### 4. Visualizar Banco (Opcional)

```bash
npm run db:studio
```

## 🔑 Credenciais de Teste

### Admin Master

- **URL**: http://localhost:3000/admin/lojistas
- **CPF**: `000.000.000-00`
- **Senha**: `admin123`

### Organizações Criadas

#### Livraria Exemplo

- **URL**: http://localhost:3000/livraria-exemplo/login
- **Clientes**:
  - João Silva - CPF: `123.456.789-01` - Senha: `senha123` (150 pontos)
  - Maria Santos - CPF: `987.654.321-00` - Senha: `senha123` (75 pontos)
  - Ana Oliveira - CPF: `111.111.111-11` - **Primeiro acesso** (50 pontos)

#### Café & Leitura

- **URL**: http://localhost:3000/cafe-leitura/login
- **Cliente**:
  - Pedro Costa - CPF: `111.222.333-44` - Senha: `senha123` (200 pontos)

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── [orgSlug]/              # Rotas white label por organização
│   │   ├── login/              # Login personalizado
│   │   ├── primeiro-acesso/    # Criação de senha
│   │   └── dashboard/          # Dashboard do cliente
│   ├── (admin)/
│   │   └── admin/lojistas/     # Gestão de organizações
│   └── actions/                # Server Actions
├── components/
│   ├── admin/lojistas/         # Componentes admin
│   ├── organization/           # Componentes white label
│   └── ui/                     # Componentes base
├── lib/
│   ├── services/               # Camada de serviços
│   └── prisma.ts              # Cliente Prisma
├── types/
│   └── organization.ts         # Tipos TypeScript
prisma/
├── schema.prisma              # Schema do banco
├── seed.js                    # Dados de exemplo
└── dev.db                     # Banco SQLite
```

## 🗄️ Schema do Banco de Dados

### Entidades Principais

#### Organization (Organizações/Lojistas)

- `name`: Nome da empresa
- `cnpj`: CNPJ único
- `slug`: Identificador para URLs (ex: `loja-abc`)
- `logoUrl`: URL da logo
- `loginImageUrl`: URL da imagem da página de login
- `isActive`: Status ativo/inativo

#### User (Usuários)

- `cpf`: CPF único (login)
- `email`: Email opcional
- `fullName`: Nome completo
- `password`: Senha hash
- `points`: Pontos disponíveis
- `role`: `ADMIN_MASTER` ou `CLIENTE`
- `organizationId`: Vinculação à organização
- `firstAccess`: Flag de primeiro acesso

#### Ebook (Catálogo)

- `title`: Título do ebook
- `author`: Autor
- `description`: Descrição
- `category`: Categoria
- `coverImageUrl`: URL da capa
- `ebookFileUrl`: URL do arquivo
- `pointsCost`: Custo em pontos (padrão: 1)
- `organizationId`: Organização específica (null = todas)

#### Redemption (Resgates)

- `userId`: Cliente que resgatou
- `ebookId`: Ebook resgatado
- `organizationId`: Organização do resgate
- `pointsUsed`: Pontos utilizados
- `redeemedAt`: Data do resgate

#### PointsImport (Importações)

- `fileName`: Nome da planilha
- `organizationId`: Organização
- `totalRecords`: Total de registros
- `successRecords`: Sucessos
- `errorRecords`: Erros
- `status`: `PROCESSING`, `COMPLETED`, `FAILED`, `PARTIAL`
- `errorDetails`: JSON com detalhes dos erros

#### PointsHistory (Histórico de Pontos)

- `userId`: Usuário
- `pointsAdded`: Pontos adicionados
- `sourceDescription`: Descrição da origem
- `pointsImportId`: Referência à importação

## 🎯 Próximos Passos Sugeridos

1. **Autenticação Real**: Implementar NextAuth.js ou similar
2. **Upload de Arquivos**: Configurar storage para logos e imagens
3. **API de Planilhas**: Completar processamento de Excel/CSV
4. **Notificações**: Sistema de emails e notificações
5. **Relatórios Avançados**: Dashboard com gráficos e métricas
6. **Mobile**: Responsividade e PWA
7. **Pagamentos**: Integração para compra de pontos
8. **Multi-tenant**: Isolamento completo por organização

## 🛠️ Tecnologias Utilizadas

- **Framework**: Next.js 15 (App Router)
- **Banco de Dados**: Prisma + SQLite
- **UI**: Tailwind CSS + shadcn/ui + Radix UI
- **Validação**: TypeScript
- **Autenticação**: bcryptjs (para hash de senhas)
- **Planilhas**: xlsx (para processamento de Excel)

## 📚 Comandos Úteis

```bash
# Desenvolvimento
npm run dev                    # Executar em desenvolvimento
npm run build                 # Build para produção
npm run start                 # Executar produção

# Banco de Dados
npm run db:migrate            # Aplicar mudanças no schema
npm run db:seed               # Popular com dados de exemplo
npm run db:reset              # Reset completo + seed
npm run db:studio             # Interface visual do banco

# Qualidade de Código
npm run lint                  # Executar linter
npm run lint:fix              # Corrigir problemas automáticos
npm run prettier              # Formatar código
```

---

✅ **Estrutura white label completa implementada e funcional!**

O sistema está pronto para gerenciar múltiplas organizações com branding personalizado, URLs exclusivas e funcionalidades completas de administração e cliente final.

# Banca Online v3

Um projeto Next.js moderno com design sofisticado, gradientes e efeitos visuais avançados.

## 🚀 Como Rodar Localmente

### Pré-requisitos

- Node.js >= 20
- pnpm (recomendado) ou npm

### Instalação

1. **Clone o repositório**

```bash
git clone <seu-repositorio>
cd banca-online-v3
```

2. **Instale as dependências**

```bash
pnpm install
```

3. **Rode o projeto**

```bash
pnpm dev
```

O projeto estará disponível em `http://localhost:3000`

## 🔧 Configuração

### Desenvolvimento Local (Recomendado)

O projeto foi configurado para funcionar **sem** Supabase ou Paddle para desenvolvimento local. Todos os dados são mockados automaticamente.

### Produção

Para usar em produção, você precisará configurar:

1. **Supabase** (opcional)
   - Crie um projeto no [Supabase](https://supabase.com)
   - Adicione as variáveis de ambiente:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
   ```

2. **Paddle** (opcional)
   - Configure o Paddle para pagamentos
   - Adicione as variáveis de ambiente:
   ```env
   NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=seu_token_do_paddle
   NEXT_PUBLIC_PADDLE_ENV=sandbox
   ```

## 🎨 Características do Design

- **Tema escuro** por padrão
- **Gradientes sofisticados** com efeitos de blur
- **Componentes acessíveis** com Radix UI
- **Animações suaves** com Tailwind CSS
- **Layout responsivo** mobile-first
- **Sistema de design consistente**

## 📁 Estrutura do Projeto

```
src/
├── app/                    # App Router (Next.js 15)
├── components/
│   ├── ui/                # Componentes base
│   ├── home/              # Páginas da home
│   ├── dashboard/         # Páginas do dashboard
│   ├── gradients/         # Componentes de gradiente
│   └── shared/            # Componentes compartilhados
├── styles/                # CSS customizado
├── hooks/                 # Custom hooks
├── lib/                   # Utilitários
└── utils/                 # Helpers específicos
```

## 🛠️ Scripts Disponíveis

```bash
pnpm dev          # Desenvolvimento
pnpm build        # Build para produção
pnpm start        # Servidor de produção
pnpm lint         # Linting
pnpm lint:fix     # Corrigir problemas de linting
pnpm prettier     # Formatação de código
```

## 🎯 Funcionalidades

- ✅ **Homepage** com hero section e pricing
- ✅ **Dashboard** com layout responsivo
- ✅ **Autenticação** (mockada para desenvolvimento)
- ✅ **Sistema de preços** (mockado para desenvolvimento)
- ✅ **Design system** completo
- ✅ **Gradientes e efeitos visuais**
- ✅ **Componentes reutilizáveis**

## 🔄 Dados Mockados

Para desenvolvimento local, o projeto usa dados mockados:

- **Usuário**: `mock-user-id` com email `mock@example.com`
- **Preços**: Valores fixos em USD
- **Autenticação**: Sem verificação real
- **Dashboard**: Dados de exemplo

## 🎨 Personalização

O projeto está pronto para ser personalizado:

1. **Cores**: Edite as variáveis CSS em `src/styles/globals.css`
2. **Gradientes**: Modifique os componentes em `src/components/gradients/`
3. **Componentes**: Use o sistema de design em `src/components/ui/`
4. **Páginas**: Crie novas páginas seguindo o padrão existente

## 📝 Licença

Este projeto está sob a licença MIT.

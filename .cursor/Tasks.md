## Relevant Files

- `app/(auth)/login/page.tsx` \- Página de login para todos os usuários.  
- `app/(auth)/primeiro-acesso/page.tsx` \- Página para o cliente definir a senha no primeiro acesso.  
- `app/(auth)/auth/confirm/route.ts` \- Route handler para confirmação de email.  
- `app/(cliente)/layout.tsx` \- Layout protegido para área do cliente.  
- `app/(cliente)/dashboard/page.tsx` \- Dashboard do cliente com saldo de pontos e histórico.  
- `app/(cliente)/catalogo/page.tsx` \- Catálogo de e-books para resgate.  
- `app/(cliente)/biblioteca/page.tsx` \- Biblioteca de e-books resgatados pelo cliente.  
- `app/(admin)/layout.tsx` \- Layout protegido para área administrativa.  
- `app/(admin)/admin/ebooks/page.tsx` \- Tabela de gerenciamento de e-books para o admin.  
- `app/(admin)/admin/pontos/page.tsx` \- Interface para upload de planilha de pontos.  
- `app/(admin)/admin/relatorios/resgates/page.tsx` \- Relatório de e-books resgatados.  
- `app/actions/auth.actions.ts` \- Server Actions para autenticação.  
- `app/actions/ebooks.actions.ts` \- Server Actions para gerenciamento de e-books.  
- `app/actions/users.actions.ts` \- Server Actions para gerenciamento de usuários e pontos.  
- `components/providers/auth-provider.tsx` \- Provider de autenticação para Client Components.  
- `lib/supabase/server.ts` \- Client Supabase para Server Components e Server Actions.  
- `lib/supabase/client.ts` \- Client Supabase para Client Components.  
- `lib/supabase/middleware.ts` \- Utilitário updateSession para o middleware.  
- `middleware.ts` \- Middleware para gerenciar sessões e proteger rotas.  
- `types/database.types.ts` \- Tipos TypeScript gerados do schema do Supabase.  
- `types/index.ts` \- Tipos e enums compartilhados da aplicação.  
- `supabase/functions/process-points-sheet/index.ts` \- Edge Function para processar planilhas.

### Notes

- Usar `@supabase/ssr` ao invés de `@supabase/auth-helpers-nextjs` (deprecated).  
- Sempre chamar `await cookies()` antes de criar o client Supabase em Server Actions.  
- Implementar RLS (Row Level Security) em todas as tabelas do Supabase.  
- Usar Suspense boundaries para loading states ao invés de useState loading.  
- Validar todos os inputs com Zod antes de processar.

## Tasks

- [ ] 1.0 Configuração Inicial e Estrutura do Projeto  
        
      - [x] 1.1 Instalar dependências necessárias: `@supabase/ssr`, `@supabase/supabase-js`, `zod`, `react-hook-form`, `@hookform/resolvers`, shadcn/ui.  
      - [ ] 1.2 Configurar shadcn/ui: `npx shadcn@latest init` com TypeScript, Tailwind CSS e App Router.  
      - [ ] 1.3 Criar variáveis de ambiente em `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

      - [ ] 1.4 Criar estrutura de clients Supabase seguindo o padrão SSR:  
            - [ ] 1.4.1 `/lib/supabase/server.ts` \- Para Server Components e Server Actions.  
            - [ ] 1.4.2 `/lib/supabase/client.ts` \- Para Client Components.  
            - [ ] 1.4.3 `/lib/supabase/middleware.ts` \- Função updateSession para o middleware.  
      - [ ] 1.5 Gerar tipos TypeScript do banco: `supabase gen types typescript --linked > types/database.types.ts`.  
      - [ ] 1.6 Criar tipos base e enums compartilhados em `types/index.ts`.  
      - [ ] 1.7 Definir a estrutura de pastas com route groups `(auth)`, `(admin)` e `(cliente)`.  
      - [ ] 1.8 Configurar RLS policies básicas no Supabase Dashboard para todas as tabelas.

      

- [ ] 2.0 Sistema de Autenticação e Middleware  
        
      - [ ] 2.1 Criar página de login em `app/(auth)/login/page.tsx` (RF-A1, RF-A3):  
            - [ ] 2.1.1 Implementar formulário com React Hook Form e validação Zod.  
            - [ ] 2.1.2 Suportar login com email/CPF e senha.  
            - [ ] 2.1.3 Adicionar loading state com Suspense.  
      - [ ] 2.2 Implementar Server Actions de autenticação em `app/actions/auth.actions.ts`:  
            - [ ] 2.2.1 `loginAction` \- Sempre chamar `cookies()` antes do Supabase.  
            - [ ] 2.2.2 `signupAction` \- Validar CPF e criar perfil.  
            - [ ] 2.2.3 `logoutAction` \- Limpar sessão corretamente.  
      - [ ] 2.3 Desenvolver fluxo de primeiro acesso em `app/(auth)/primeiro-acesso/page.tsx` (RF-A4):  
            - [ ] 2.3.1 Verificar se o usuário tem senha definida.  
            - [ ] 2.3.2 Formulário para criação de senha com validação.  
      - [ ] 2.4 Implementar middleware em `middleware.ts`:  
            - [ ] 2.4.1 Usar `updateSession` do `lib/supabase/middleware.ts`.  
            - [ ] 2.4.2 Proteger rotas `/admin/*` para role 'admin'.  
            - [ ] 2.4.3 Proteger rotas cliente (`/dashboard`, `/catalogo`, `/biblioteca`).  
            - [ ] 2.4.4 Configurar rate limiting para rotas de autenticação.  
      - [ ] 2.5 Criar route handler `app/(auth)/auth/confirm/route.ts` para confirmação de email.  
      - [ ] 2.6 Implementar `AuthProvider` em `components/providers/auth-provider.tsx` para Client Components.  
      - [ ] 2.7 Adicionar toast notifications para feedback de autenticação.

      

- [ ] 3.0 Área do Cliente Final  
        
      - [ ] 3.1 Criar layout protegido em `app/(cliente)/layout.tsx`:  
            - [ ] 3.1.1 Verificar autenticação com `supabase.auth.getUser()`.  
            - [ ] 3.1.2 Adicionar navegação com links para Dashboard, Catálogo e Biblioteca.  
            - [ ] 3.1.3 Incluir botão de logout e informações do usuário.  
      - [ ] 3.2 **Dashboard** \- `app/(cliente)/dashboard/page.tsx` (RF-C1, RF-C2):  
            - [ ] 3.2.1 Exibir saldo atual de pontos em Card destacado.  
            - [ ] 3.2.2 Mostrar histórico de recebimento de pontos em tabela.  
            - [ ] 3.2.3 Implementar skeleton loading com Suspense.  
      - [ ] 3.3 **Catálogo** \- `app/(cliente)/catalogo/page.tsx` (RF-C3, RF-C4):  
            - [ ] 3.3.1 Listar e-books disponíveis em grid responsivo.  
            - [ ] 3.3.2 Implementar filtros por nome e categoria com debounce.  
            - [ ] 3.3.3 Adicionar paginação server-side ou infinite scroll.  
            - [ ] 3.3.4 Mostrar badge "Já resgatado" nos e-books obtidos.  
      - [ ] 3.4 **Modal de Resgate** (RF-C5, RF-C6):  
            - [ ] 3.4.1 Criar diálogo de confirmação com shadcn/ui Dialog.  
            - [ ] 3.4.2 Mostrar preview do e-book e custo em pontos.  
            - [ ] 3.4.3 Adicionar loading skeleton durante o resgate.  
      - [ ] 3.5 Implementar Server Action `redeemEbook` em `app/actions/ebooks.actions.ts`:  
            - [ ] 3.5.1 Validar saldo de pontos do usuário.  
            - [ ] 3.5.2 Criar registro em `redemptions` e atualizar pontos.  
            - [ ] 3.5.3 Usar transação para garantir consistência.  
            - [ ] 3.5.4 Retornar erro tratado se falhar.  
      - [ ] 3.6 **Minha Biblioteca** \- `app/(cliente)/biblioteca/page.tsx` (RF-C7, RF-C8):  
            - [ ] 3.6.1 Listar e-books resgatados com capa e informações.  
            - [ ] 3.6.2 Implementar busca local na biblioteca.  
            - [ ] 3.6.3 Adicionar botão de download com signed URL.  
            - [ ] 3.6.4 Mostrar data de resgate em cada item.

      

- [ ] 4.0 Painel de Administração (Admin Master)  
        
      - [ ] 4.1 Criar layout admin em `app/(admin)/layout.tsx`:  
            - [ ] 4.1.1 Verificar role 'admin' com `supabase.auth.getUser()`.  
            - [ ] 4.1.2 Sidebar com navegação para todas as seções.  
            - [ ] 4.1.3 Breadcrumbs para melhor navegação.  
      - [ ] 4.2 Criar Edge Function `process-points-sheet` em `supabase/functions/`:  
            - [ ] 4.2.1 Aceitar upload de CSV/XLSX.  
            - [ ] 4.2.2 Validar CPFs e processar em lote.  
            - [ ] 4.2.3 Criar usuários novos ou atualizar pontos.  
            - [ ] 4.2.4 Registrar em `points_history`.  
            - [ ] 4.2.5 Retornar relatório de processamento.  
      - [ ] 4.3 **Gerenciar E-books** \- `app/(admin)/admin/ebooks/page.tsx` (RF-B1, RF-B2, RF-B3):  
            - [ ] 4.3.1 Tabela com DataTable do shadcn/ui.  
            - [ ] 4.3.2 Adicionar paginação, busca e ordenação.  
            - [ ] 4.3.3 Ações de editar e excluir em cada linha.  
      - [ ] 4.4 **Formulário de E-book** \- Modal ou página separada:  
            - [ ] 4.4.1 Campos: título, autor, descrição, categoria.  
            - [ ] 4.4.2 Upload de capa com preview antes do envio.  
            - [ ] 4.4.3 Upload de arquivo PDF/EPUB com validação de tipo.  
            - [ ] 4.4.4 Validação com Zod de todos os campos.  
      - [ ] 4.5 Server Actions para e-books em `app/actions/ebooks.actions.ts`:  
            - [ ] 4.5.1 `createEbook` \- Upload para Storage e criar registro.  
            - [ ] 4.5.2 `updateEbook` \- Atualizar dados e arquivos.  
            - [ ] 4.5.3 `deleteEbook` \- Soft delete ou exclusão completa.  
      - [ ] 4.6 **Gerenciar Pontos** \- `app/(admin)/admin/pontos/page.tsx` (RF-B4, RF-B5, RF-B6):  
            - [ ] 4.6.1 Interface de upload com drag-and-drop.  
            - [ ] 4.6.2 Preview da planilha antes de processar.  
            - [ ] 4.6.3 Chamar Edge Function `process-points-sheet`.  
            - [ ] 4.6.4 Exibir relatório detalhado pós-processamento.  
            - [ ] 4.6.5 Histórico de uploads anteriores.  
      - [ ] 4.7 **Relatório de Resgates** \- `app/(admin)/admin/relatorios/resgates/page.tsx` (RF-B7, RF-B8):  
            - [ ] 4.7.1 Tabela com todos os resgates (JOIN com profiles e ebooks).  
            - [ ] 4.7.2 Filtros por CPF, e-book e período.  
            - [ ] 4.7.3 Exportação em CSV.  
            - [ ] 4.7.4 Totalizadores e estatísticas.

      

- [ ] 5.0 Finalização, Otimização e Qualidade  
        
      - [ ] 5.1 Implementar Error Boundaries para cada seção principal:  
            - [ ] 5.1.1 Criar `error.tsx` em cada route group.  
            - [ ] 5.1.2 Adicionar logging de erros.  
      - [ ] 5.2 Adicionar loading.tsx com Suspense em todas as rotas:  
            - [ ] 5.2.1 Usar Skeleton components do shadcn/ui.  
            - [ ] 5.2.2 Implementar streaming para dados pesados.  
      - [ ] 5.3 Configurar not-found.tsx personalizado para 404s.  
      - [ ] 5.4 Implementar sistema de notificações com Toast:  
            - [ ] 5.4.1 Feedback para todas as ações do usuário.  
            - [ ] 5.4.2 Mensagens de erro tratadas e amigáveis.  
      - [ ] 5.5 Otimizar performance:  
            - [ ] 5.5.1 Implementar `unstable_cache` para dados estáticos.  
            - [ ] 5.5.2 Adicionar prefetch em links críticos.  
            - [ ] 5.5.3 Otimizar imagens com next/image.  
      - [ ] 5.6 Garantir responsividade:  
            - [ ] 5.6.1 Testar em dispositivos móveis.  
            - [ ] 5.6.2 Ajustar layouts para diferentes tamanhos.  
      - [ ] 5.7 Implementar acessibilidade:  
            - [ ] 5.7.1 ARIA labels em elementos interativos.  
            - [ ] 5.7.2 Navegação por teclado funcional.  
            - [ ] 5.7.3 Contraste adequado (WCAG AA).  
      - [ ] 5.8 Testes e validação:  
            - [ ] 5.8.1 Executar `npm run lint` e corrigir issues.  
            - [ ] 5.8.2 Executar `npm run type-check` para garantir type safety.  
            - [ ] 5.8.3 Criar testes E2E básicos com Playwright.  
            - [ ] 5.8.4 Testar fluxos críticos manualmente.  
      - [ ] 5.9 Documentação:  
            - [ ] 5.9.1 Documentar Server Actions principais.  
            - [ ] 5.9.2 Criar README com instruções de setup.  
            - [ ] 5.9.3 Documentar estrutura de pastas e convenções.


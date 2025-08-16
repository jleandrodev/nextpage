# Sistema de Gerenciamento de Imagens

Este documento descreve como usar o sistema de gerenciamento de imagens para as organizações (lojistas).

## Visão Geral

O sistema permite que administradores façam upload e gerenciem três tipos de imagens para cada organização:

1. **Logo** - Logo da organização (aparece no header e formulários)
2. **Imagem de Login** - Imagem de fundo da página de login
3. **Imagem de Capa (Hero)** - Imagem de fundo do hero section do catálogo

## Como Acessar

1. Acesse o painel administrativo: `/admin`
2. Vá para a seção "Lojistas"
3. Na tabela de organizações, clique no menu de ações (três pontos)
4. Selecione "Gerenciar Imagens"

Ou:

1. Acesse diretamente uma organização: `/admin/lojistas/[id]`
2. Clique no botão "Gerenciar Imagens"

## Funcionalidades

### Upload de Imagens

- **Seleção de arquivo**: Clique em "Selecionar Arquivo" para escolher uma imagem
- **Preview**: Visualize a imagem antes do upload
- **Validação**: O sistema valida tipo e tamanho do arquivo automaticamente
- **Upload**: Clique em "Fazer Upload" para enviar a imagem

### Visualização

- **Preview atual**: Veja a imagem atual da organização
- **Visualização ampliada**: Clique no ícone de olho para ver a imagem em tamanho maior
- **Preview em contexto**: Veja como as imagens aparecem nas páginas do cliente

### Remoção

- **Remover imagem**: Clique no ícone de lixeira para remover a imagem atual
- **Confirmação**: O sistema pede confirmação antes de remover

## Especificações Técnicas

### Formatos Suportados

| Tipo de Imagem | Formatos Aceitos |
|----------------|------------------|
| Logo | PNG, JPEG, SVG, WebP |
| Imagem de Login | PNG, JPEG, WebP |
| Imagem de Capa | PNG, JPEG, WebP |

### Tamanhos Máximos

| Tipo de Imagem | Tamanho Máximo |
|----------------|----------------|
| Logo | 2MB |
| Imagem de Login | 5MB |
| Imagem de Capa | 5MB |

### Tamanhos Recomendados

| Tipo de Imagem | Tamanho Recomendado |
|----------------|---------------------|
| Logo | 200x200px |
| Imagem de Login | 1200x800px |
| Imagem de Capa | 1920x600px |

## Buckets do Supabase Storage

O sistema utiliza três buckets no Supabase Storage:

- `logos` - Para logos das organizações
- `login-images` - Para imagens de fundo do login
- `cover-hero` - Para imagens de capa dos catálogos

## Configuração Inicial

### 1. Configurar Buckets

Execute o script para criar os buckets necessários:

```bash
node scripts/setup-image-buckets.js
```

### 2. Configurar Políticas de Acesso

As políticas de acesso são configuradas automaticamente pelo script, mas podem precisar de ajustes manuais no painel do Supabase:

1. Acesse o painel do Supabase
2. Vá para Storage > Policies
3. Configure as políticas para cada bucket:
   - **Public read access** - Para leitura pública das imagens
   - **Authenticated users can upload** - Para upload por usuários autenticados
   - **Users can update own files** - Para atualização de arquivos próprios
   - **Users can delete own files** - Para remoção de arquivos próprios

### 3. Variáveis de Ambiente

Certifique-se de que as seguintes variáveis estão configuradas:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key
```

## Estrutura de Arquivos

```
src/
├── app/
│   ├── (admin)/admin/lojistas/[id]/imagens/
│   │   └── page.tsx                    # Página de gerenciamento de imagens
│   └── api/admin/organizations/[id]/
│       ├── upload-image/
│       │   └── route.ts               # API para upload de imagens
│       └── remove-image/
│           └── route.ts               # API para remoção de imagens
├── components/admin/lojistas/
│   └── image-manager.tsx              # Componente de gerenciamento de imagens
└── scripts/
    └── setup-image-buckets.js         # Script de configuração dos buckets
```

## Fluxo de Funcionamento

1. **Upload**:
   - Usuário seleciona arquivo
   - Sistema valida tipo e tamanho
   - Arquivo é enviado para o Supabase Storage
   - URL da imagem é salva no banco de dados
   - Página é recarregada para mostrar a nova imagem

2. **Remoção**:
   - Usuário confirma remoção
   - Arquivo é removido do Supabase Storage
   - Campo no banco de dados é definido como null
   - Página é recarregada

3. **Fallback**:
   - Se não há imagem personalizada, o sistema usa imagens padrão
   - Imagens padrão estão em `/public/images/`

## Tratamento de Erros

O sistema inclui tratamento para:

- **Arquivos inválidos**: Tipo não suportado ou tamanho excessivo
- **Erros de upload**: Problemas de rede ou storage
- **Erros de remoção**: Arquivos não encontrados
- **Falhas de validação**: Organização não encontrada

## Segurança

- **Validação de tipos**: Apenas tipos de imagem permitidos
- **Limite de tamanho**: Prevenção de uploads excessivos
- **Autenticação**: Apenas usuários autenticados podem fazer upload
- **Isolamento**: Cada organização só pode gerenciar suas próprias imagens

## Performance

- **Otimização automática**: Imagens são otimizadas pelo Supabase
- **CDN**: Imagens são servidas via CDN para melhor performance
- **Lazy loading**: Imagens são carregadas conforme necessário
- **Cache**: URLs das imagens são cacheadas pelo navegador

## Troubleshooting

### Problemas Comuns

1. **Upload falha**:
   - Verifique se o arquivo está dentro dos limites de tamanho
   - Confirme se o formato é suportado
   - Verifique as políticas de acesso do Supabase

2. **Imagem não aparece**:
   - Verifique se a URL está correta no banco de dados
   - Confirme se o bucket está público
   - Verifique se a imagem existe no storage

3. **Erro de permissão**:
   - Verifique se as políticas de acesso estão configuradas
   - Confirme se o usuário está autenticado
   - Verifique se a service role key está correta

### Logs

Os logs de erro são exibidos no console do navegador e no terminal do servidor. Verifique:

- Console do navegador para erros de frontend
- Logs do servidor para erros de API
- Logs do Supabase para erros de storage

## Suporte

Para problemas ou dúvidas sobre o sistema de gerenciamento de imagens, consulte:

1. Este documento
2. Logs de erro
3. Documentação do Supabase Storage
4. Equipe de desenvolvimento

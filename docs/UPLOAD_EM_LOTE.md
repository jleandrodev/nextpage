# 📚 Upload em Lote de Ebooks

## 🎯 Visão Geral

A funcionalidade de **Upload em Lote** permite processar múltiplos ebooks de uma vez, extraindo automaticamente:

- **Título** do nome do arquivo
- **Capa** da primeira página do PDF
- **Metadados** com valores padrão configuráveis

## 🚀 Como Usar

### 1. Preparar os Arquivos

1. **Organize seus PDFs** com nomes descritivos
2. **Compacte em ZIP** todos os arquivos PDF
3. **Certifique-se** de que os nomes são claros e sem caracteres especiais

### 2. Estrutura Recomendada

```
ebooks.zip
├── O Poder do Hábito.pdf
├── Atomic Habits.pdf
├── Deep Work.pdf
├── A Única Coisa.pdf
└── ...
```

### 3. Fazer Upload

1. Acesse **Admin > Ebooks**
2. Clique em **"Upload em Lote"**
3. Arraste e solte o arquivo ZIP
4. Configure os valores padrão (pontos, categoria)
5. Clique em **"Iniciar Upload"**

## ⚙️ Configurações

### Valores Padrão

- **Pontos Padrão**: Quantos pontos cada ebook custará (padrão: 1)
- **Categoria Padrão**: Categoria para todos os ebooks (padrão: "Geral")

### Processamento Automático

- ✅ Extração de título do nome do arquivo
- ✅ Geração de capa da primeira página
- ✅ Criação de registros no banco
- ✅ Upload para Supabase Storage
- ✅ Relatório detalhado de resultados

## 📊 Resultados

Após o processamento, você receberá:

- **Contador** de sucessos e erros
- **Lista detalhada** de cada arquivo processado
- **Status** individual de cada ebook
- **Mensagens de erro** específicas (se houver)

## 🛠️ Tecnologias Utilizadas

- **JSZip**: Processamento de arquivos ZIP
- **PDF-lib**: Manipulação de PDFs
- **Sharp**: Processamento de imagens
- **React Dropzone**: Interface drag & drop
- **Supabase Storage**: Armazenamento de arquivos

## 📋 Limitações e Considerações

### Limitações Atuais

- **Tamanho máximo**: 100MB por ZIP
- **Formato**: Apenas arquivos PDF
- **Capa**: Primeira página do PDF (pode não ser ideal)
- **Autor**: "Autor Desconhecido" (pode ser editado depois)

### Recomendações

- **Processe em lotes** menores para melhor performance
- **Use nomes descritivos** para os arquivos
- **Evite caracteres especiais** nos nomes
- **Verifique a qualidade** das capas geradas

## 🔧 Desenvolvimento

### Estrutura de Arquivos

```
src/
├── app/api/upload-ebooks-batch/route.ts    # API de processamento
├── hooks/useBatchUpload.ts                 # Hook de upload
└── components/admin/ebooks/
    └── batch-upload-dialog.tsx             # Interface de upload
```

### Scripts Disponíveis

```bash
# Criar arquivos de teste
npm run test:create-ebooks

# Executar seed do banco
npm run db:seed-supabase
```

### Teste Local

1. Execute `npm run test:create-ebooks`
2. Compacte os arquivos gerados em `scripts/test-files/`
3. Use o upload em lote com o ZIP criado

## 🐛 Solução de Problemas

### Erro: "Arquivo deve ser um ZIP válido"

- Verifique se o arquivo é realmente um ZIP
- Tente recriar o arquivo ZIP

### Erro: "Não autorizado"

- Certifique-se de estar logado como ADMIN_MASTER
- Verifique as permissões de autenticação

### Erro: "Erro interno do servidor"

- Verifique os logs do servidor
- Confirme se o Supabase está configurado
- Verifique se os buckets de storage existem

### Processamento Lento

- Reduza o número de arquivos por lote
- Verifique a conexão com a internet
- Monitore o uso de recursos do servidor

## 🔮 Melhorias Futuras

- [ ] **Extração de metadados** dos PDFs
- [ ] **Upload de capas personalizadas**
- [ ] **Processamento em background** com filas
- [ ] **Validação avançada** de arquivos
- [ ] **Interface de edição em lote** pós-upload
- [ ] **Suporte a EPUB** além de PDF
- [ ] **OCR** para extração de texto
- [ ] **Categorização automática** por IA

## 📞 Suporte

Para dúvidas ou problemas:

1. Verifique esta documentação
2. Consulte os logs do servidor
3. Teste com arquivos menores
4. Entre em contato com a equipe de desenvolvimento

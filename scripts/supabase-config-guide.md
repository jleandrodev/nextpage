# 🔧 Configuração do Supabase para Vercel

## ❌ PROBLEMA IDENTIFICADO

A aplicação não consegue conectar ao banco Supabase na produção:

```
Can't reach database server at db.bwitysxhadrcibputahk.supabase.co:5432
```

## ✅ SOLUÇÕES

### Opção 1: Permitir todos os IPs (Mais Simples)

1. Acesse: `https://supabase.com/dashboard/project/[seu-project-id]/settings/database`
2. Em **"Connection pooling"** ou **"Network restrictions"**
3. Adicione: `0.0.0.0/0` (permite todos os IPs)
4. Salve as configurações

### Opção 2: IPs Específicos da Vercel (Mais Seguro)

1. Acesse: `https://api.vercel.com/v1/ips`
2. Copie os IPs listados
3. Adicione cada IP no Supabase

### Opção 3: Verificar Status do Banco

1. Acesse: `https://supabase.com/dashboard/project/[seu-project-id]/overview`
2. Verifique se o banco está **"Online"**
3. Se estiver offline, aguarde ou reinicie

## 🔍 VERIFICAÇÕES ADICIONAIS

### 1. Verificar DATABASE_URL

- Formato correto: `postgresql://postgres:[PASSWORD]@db.[PROJECT-ID].supabase.co:5432/postgres`
- Senha correta
- Project ID correto

### 2. Verificar Configurações de Rede

- Firewall do Supabase
- Configurações de SSL
- Timeout de conexão

### 3. Testar Conexão

Após configurar, teste:

```
https://nextpage-sable.vercel.app/api/test-db
```

## 📋 PRÓXIMOS PASSOS

1. Configure os IPs no Supabase
2. Aguarde 2-3 minutos
3. Teste o endpoint de diagnóstico
4. Verifique se as rotas das organizações aparecem

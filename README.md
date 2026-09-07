# Tamara Confeitaria Lab — Site + Painel Admin

Site institucional e loja da Tamara Confeitaria Lab, com painel administrativo para gerenciar produtos, categorias, feiras e configurações do site sem precisar mexer em código.

## Stack

- **React 19 + TypeScript + Vite** — frontend
- **Tailwind CSS v4** — estilos
- **React Router** — navegação
- **Supabase** — banco de dados (Postgres), autenticação do admin e upload de imagens

## Estrutura

- `/` `/sobre` `/catalogo` `/pronta-entrega` `/monte-sua-caixa` `/feiras` `/encomendas` `/presentes` — site público
- `/admin/login` — login do painel administrativo
- `/admin/produtos` `/admin/categorias` `/admin/feiras` `/admin/configuracoes` — painel (protegido por login)

## Rodando localmente

```bash
npm install
cp .env.example .env.local   # preencha com as credenciais do Supabase
npm run dev
```

## Variáveis de ambiente

| Variável | Descrição |
|---|---|
| `VITE_SUPABASE_URL` | URL do projeto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Chave pública (anon/publishable) do Supabase |

Essas informações **não são secretas** (são de uso público no navegador) mas identificam o seu projeto — não é necessário trocar depois de configurado.

## Deploy (recomendado: Vercel)

1. Acesse [vercel.com/new](https://vercel.com/new) e importe este repositório GitHub.
2. Framework preset: **Vite** (detectado automaticamente).
3. Em "Environment Variables", adicione `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` (valores no `.env.local` ou enviados junto com as credenciais de acesso).
4. Deploy. Pronto — o site já fica no ar com HTTPS automático.
5. Opcional: conecte um domínio próprio em "Settings → Domains".

Qualquer outra hospedagem de site estático (Netlify, Cloudflare Pages, etc.) funciona do mesmo jeito: `npm run build` gera a pasta `dist/`, que é o site pronto para publicar.

## Painel administrativo

Acesse `/admin/login` com o e-mail e senha enviados separadamente. No painel é possível:

- Cadastrar, editar, ativar/desativar e excluir **produtos** (com upload de foto, preço, categoria, estoque e marcações como "pronta entrega", "presente", "monte sua caixa" e "destaque na home")
- Gerenciar **categorias**
- Cadastrar **feiras/eventos** (data, horário, local, link do mapa)
- Editar **configurações gerais** do site: número do WhatsApp, Instagram, cidade, textos da página inicial e do "Sobre"

### Segurança

- O login usa autenticação da Supabase (e-mail + senha), com sessão criptografada.
- Só contas explicitamente marcadas como administrador (tabela `admins` no banco) conseguem criar, editar ou excluir dados — todo o resto do banco é somente leitura para visitantes, reforçado por Row Level Security (RLS) no Postgres.
- Troque a senha em **Configurações da conta** (ou peça para redefinir) sempre que desejar; recomendamos trocar a senha inicial após o primeiro acesso.
- Nenhuma credencial fica salva no código-fonte ou no repositório.

## Banco de dados (Supabase)

Tabelas: `categories`, `products`, `fairs`, `site_settings`, `admins`. Todas com RLS habilitado — leitura pública dos itens ativos, escrita restrita a administradores. Imagens de produtos ficam no bucket `product-images` (leitura pública, upload restrito a administradores).

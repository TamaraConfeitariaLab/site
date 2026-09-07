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

## Deploy (Netlify)

1. Acesse [app.netlify.com/start](https://app.netlify.com/start) e importe este repositório GitHub (branch `main`).
2. Configuração de build:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
3. Em "Site configuration → Environment variables", adicione `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` (valores no `.env.local` ou enviados junto com as credenciais de acesso).
4. Deploy. Pronto — o site já fica no ar com HTTPS automático.
5. Opcional: conecte um domínio próprio em "Domain management".

O arquivo `public/_redirects` já está incluso no projeto e é essencial para o Netlify: garante que rotas como `/catalogo` ou `/admin/login` funcionem ao acessar/atualizar a página diretamente (o site é uma SPA — sem ele, essas URLs dariam erro 404 no Netlify).

Qualquer outra hospedagem de site estático (Vercel, Cloudflare Pages, etc.) funciona do mesmo jeito: `npm run build` gera a pasta `dist/`, que é o site pronto para publicar.

## Painel administrativo

Acesse `/admin/login` com o e-mail e senha enviados separadamente. No painel é possível:

- Cadastrar, editar, ativar/desativar e excluir **produtos** (com upload de foto, preço, categoria, estoque e marcações como "pronta entrega", "presente", "monte sua caixa" e "destaque na home")
- Gerenciar **categorias**
- Cadastrar **feiras/eventos** (data, horário, local, link do mapa)
- Editar **configurações gerais** do site: número do WhatsApp, Instagram, cidade, textos da página inicial e do "Sobre"

### Segurança

- O login usa autenticação da Supabase (e-mail + senha), com sessão criptografada.
- Só contas explicitamente marcadas como administrador (tabela `admins` no banco) conseguem criar, editar ou excluir dados — todo o resto do banco é somente leitura para visitantes, reforçado por Row Level Security (RLS) no Postgres, com funções auxiliares rodando sob os privilégios mínimos necessários (nunca mais do que o exigido).
- Upload de imagens é restrito a administradores autenticados e validado também no servidor (só imagens, até 5MB), não só no navegador.
- Login com **bloqueio automático**: após 5 tentativas erradas seguidas, o formulário trava por 30 segundos (dificulta ataques de força bruta), além do rate limit que a própria Supabase já aplica no servidor.
- Cabeçalhos de segurança HTTP (`Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`) configurados no `netlify.toml`, reduzindo riscos de clickjacking, sniffing de conteúdo e scripts não autorizados.
- `robots.txt` impede que buscadores indexem as rotas `/admin/*`.
- Regras de integridade no banco (preço e estoque não podem ser negativos, campos obrigatórios não podem ficar vazios).
- Nenhuma credencial fica salva no código-fonte ou no repositório — `.env.local` está no `.gitignore`.
- Troque a senha quando quiser me pedindo, ou diretamente no painel do Supabase (Authentication → Users).

**Recomendação extra (ajuste manual, fora do meu alcance por API):** no painel do Supabase, em Authentication → Policies/Providers, ative "Leaked password protection" (bloqueia senhas vazadas conhecidas) — é uma configuração que só pode ser feita pela interface do Supabase, não por código.

## Banco de dados (Supabase)

Tabelas: `categories`, `products`, `fairs`, `site_settings`, `admins`. Todas com RLS habilitado — leitura pública dos itens ativos, escrita restrita a administradores. Imagens de produtos ficam no bucket `product-images` (leitura pública, upload restrito a administradores, limitado a arquivos de imagem de até 5MB).

# 📊 MoneyTrack Dashboard

Uma interface financeira premium e minimalista construída com **Vue 3** e **Tailwind CSS**. Focada em clareza visual e experiência do usuário.

## ✨ Funcionalidades
- Dashboard financeiro interativo.
- Calendário dinâmico com filtros por Dia, Mês, Ano e Tudo.
- Resumo de saldo, entradas e saídas com badges de performance.
- Gráfico de distribuição por categoria.
- Gerenciamento de transações com scroll infinito e badges de status.

## 🚀 Tecnologias
- **Vue 3**: Composition API & SFCs.
- **Vite**: Build tool ultra-rápida.
- **Tailwind CSS**: Estilização moderna e responsiva.
- **Pinia**: Gerenciamento de estado global.

## 📋 Pré-requisitos
- Node.js (v18+)
- Backend MoneyTrack rodando (Docker ou Local)

## 💻 Configuração Local

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Configure o arquivo `.env` para apontar para a API:
   ```env
   VITE_API_URL=http://localhost:3000
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
4. Acesse `http://localhost:5173` no seu navegador.

## 🏗️ Build e Produção

Para gerar a versão otimizada para produção:
```bash
npm run build
```
Os arquivos serão gerados na pasta `/dist`.

---
Desenvolvido por Antigravity para MoneyTrack.

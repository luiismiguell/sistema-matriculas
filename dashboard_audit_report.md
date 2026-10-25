# Etapa 2 — Auditoria e Melhoria Visual dos Dashboards

Data: 2026-10-25

## Problemas encontrados antes das mudanças

### Dashboard do Aluno (`dashboard-aluno.html` + `dashboard-aluno.css`)
1. **KPIs mal distribuídos**: `grid-template-columns: repeat(2, 1fr)` com 3 KPIs → o 3º ficava sozinho na linha inferior, gerando espaço vazio horizontal.
2. **Layout principal desbalanceado**: `grid-template-columns: 2fr 1fr` (área principal 2/3, sidebar 1/3) — a tabela de cursos ficava apertada.
3. **Gap vertical excessivo**: `.conteudo` com `padding: 2rem 2rem 3rem` e `gap: 1.75rem` entre seções.
4. **Ações rápidas**: 4 itens em `repeat(2, 1fr)` → 2 linhas com 2 itens cada, subaproveitando largura em desktop.
5. **Banner** sem `max-width` do conteúdo — ilustração podia ficar muito afastada.

### Dashboard Admin (`dashboard-admin.html` + `dashboard-admin.css`)
1. **KPIs**: 4 indicadores em `repeat(2, 1fr)` → 2 linhas, espaço horizontal subaproveitado em telas largas.
2. **Ações rápidas**: 3 itens em `repeat(2, 1fr)` → 2 na primeira linha, 1 sozinho na segunda.
3. **Layout principal**: `1fr 1fr` (50/50) — área de ações (3 itens) ficava com espaço ocioso, tabela resumo apertada.
4. **Padding vertical**: mesmo problema do aluno.
5. **HTML**: fechamento `</div>` duplicado linha 194-195.

### Compartilhado (`shared.css`)
1. `.conteudo` sem `max-width` — em telas >1440px conteúdo se esticava até a borda.
2. Espaçamento vertical excessivo padrão.
3. `.secao__titulo` com `margin-bottom: 1rem` dentro de `.cartao` gerava gap duplo com padding do cartão.

## Arquivos modificados e justificativa

| Arquivo | Justificativa |
|---------|---------------|
| `assets/css/shared.css` | `max-width: 1440px` movido para seletor restrito `.layout[data-maxwidth] .conteudo`; reduzido padding vertical e gap; mantido vars de tema. |
| `assets/css/dashboard-aluno.css` | KPIs: `repeat(3, 1fr)` para 3 colunas; Dashboard: `3fr 1fr` (75/25); Ações: `repeat(4, 1fr)`; Breakpoints: 1200px (ações 2 col), 1024px (layout 1 col), 768px (KPIs 1 col); `.secao-header` margin reduzido. |
| `assets/css/dashboard-admin.css` | KPIs: `repeat(4, 1fr)`; Dashboard: `1fr 1.5fr` (40/60); Ações: `repeat(4, 1fr)`; Breakpoints: 1200px (ações 2 col), 1024px (layout 1 col), 768px (KPIs 1 col). |
| `pages/dashboard-aluno.html` | Adicionado `data-maxwidth` ao `.layout` para ativar limitação de largura. |
| `pages/dashboard-admin.html` | Adicionado `data-maxwidth` ao `.layout`; removido `</div>` duplicado (linhas 194-195). |

## Melhorias realizadas em cada dashboard

### Dashboard do Aluno
- **KPIs**: 3 cards lado a lado em desktop, responsivo (3 → 1 col).
- **Ações rápidas**: 4 cards em linha única desktop (4 → 2 → 1).
- **Layout principal**: Tabela ocupa 75% da largura, sidebar 25% — tabela respira melhor.
- **Espaçamento**: Gap geral reduzido de 1.75rem → 1.5rem; headers de seção com menos margem.

### Dashboard Admin
- **KPIs**: 4 cards em linha única desktop, responsivo (4 → 2 → 1).
- **Ações rápidas**: 3 cards + espaço para expansão futura, responsivo (4 → 2 → 1).
- **Layout principal**: Tabela resumo ganha 60% da largura, ações 40% — tabela é o foco admin.
- **Espaçamento**: Mesmo padrão do aluno para consistência.

## Possíveis regressões ou limitações

1. **Sem testes visuais** — Não há ambiente de navegador disponível; não foi possível confirmar renderização real.
2. **Ações rápidas aluno**: 4 itens em 4 colunas podem ficar estreitos em telas ~1024px; breakpoint em 1200px mitiga.
3. **KPIs admin**: 4 cards em desktop podem exigir largura mínima; responsivo em 768px.
4. **Compatibilidade dark/light**: mantida — apenas layout/spacing alterados, sem cores novas.
5. **Shared.css**: alteração global reduzida ao seletor restrito; páginas sem `data-maxwidth` não afetadas.

## Testes realmente executados
1. **Sintaxe CSS** — estrutura validada manualmente.
2. **Sintaxe JS** — `node --check` em `dashboard-aluno.js` e `dashboard-admin.js` — OK.
3. **git diff --check** — sem conflitos de merge markers ou whitespace errors.
4. **Referências cruzadas** — classes HTML (`kpis--dashboard`, `dashboard-main`, `acoes__grid--4`, `secao-header`, `cartao`) conferidas nos HTMLs.
5. **Hierarquia HTML admin** — confirmada após remoção do `</div>` duplicado.
6. **Escopo `data-maxwidth`** — verificado: apenas dashboards têm o atributo; outras 7 páginas não afetadas.

## Testes pendentes
1. **Renderização visual** em desktop (1440px+, 1024px, 768px) e mobile.
2. **Tema claro/escuro** — confirmar contraste e legibilidade.
3. **Interações** — sidebar mobile, botão tema, hover nos cards, scroll tabelas.
4. **Acessibilidade** — foco visível, ordem de tab, skip link.

## Correções na revisão corretiva (2026-10-25)

### 1. HTML Admin — fechamento `</div>` duplicado
- Linhas 194-195 tinham `</div>` duplicado → removido um.
- Hierarquia confirmada: `.layout` > `main.conteudo` > `.dashboard-main` > `section.cartao`... fechamento correto.

### 2. `shared.css` — escopo do `max-width`
- `max-width: 1440px` movido de `.conteudo` global para `.layout[data-maxwidth] .conteudo`.
- Adicionado `data-maxwidth` apenas nos HTMLs dos dashboards (`dashboard-aluno.html`, `dashboard-admin.html`).
- Outras páginas (`perfil.html`, `horario.html`, `matricula.html`, `plano-estudos.html`, `gestao-cursos.html`, `gestao-disciplinas.html`, `reporte-matricula.html`) não afetadas.

### 3. Breakpoints `1200px` simplificados
- **Aluno**: KPIs mantêm 3 colunas até 768px; ações 4→2 colunas em 1200px.
- **Admin**: KPIs mantêm 4 colunas até 768px; ações 4→2 colunas em 1200px.
- Regra redundante de KPIs em 1200px removida de ambos.
- Breakpoints ativos: 1200px (ações), 1024px (layout colunas → 1), 768px (KPIs 1 col, ações 1 col, sidebar stack).
# Portal Vivência — Sistema de Matrículas UATI

Sistema de matrícula e gestão acadêmica desenvolvido em **HTML, CSS e JavaScript puro**, sem frameworks front-end. Projetado para integração futura com API REST.

---

## 🎯 Objetivo

Portal acadêmico para gerenciar:
- **Cadastro e autenticação** de alunos
- **Matrícula em disciplinas** com verificação de vagas
- **Grade de horários** semanal
- **Plano de estudos** com histórico por período
- **Painel administrativo** para gestão de cursos, disciplinas e relatórios

---

## 🛠 Tecnologias

| Camada | Tecnologia |
|--------|------------|
| Estrutura | HTML5 semântico |
| Estilos | CSS3 (Custom Properties, Flexbox, Grid) |
| Comportamento | JavaScript ES6+ (Vanilla) |
| Fontes | Segoe UI / System UI (nativas) |
| Ícones | SVG inline |

Sem dependências externas, bundlers, TypeScript ou frameworks.

---

## 📁 Estrutura de Diretórios

```
matriculas/
├── index.html                 # Landing page pública
├── pages/                     # Páginas da aplicação
│   ├── cadastro.html          # Registro de novo aluno
│   ├── login.html             # Autenticação
│   ├── dashboard-aluno.html   # Dashboard do aluno
│   ├── matricula.html         # Matrícula em disciplinas
│   ├── horario.html           # Grade de horários semanal
│   ├── plano-estudos.html     # Histórico e progresso acadêmico
│   ├── dashboard-admin.html   # Painel administrativo
│   ├── gestao-cursos.html     # CRUD de cursos
│   ├── gestao-disciplinas.html # CRUD de disciplinas
│   └── reporte-matricula.html # Relatórios e BI
├── assets/
│   ├── css/
│   │   ├── shared.css         # Variáveis, utilitários, componentes base
│   │   ├── auth.css           # Estilos de login/cadastro
│   │   ├── dashboard-aluno.css # Layout específico do dashboard aluno
│   │   ├── dashboard-admin.css # Layout específico do dashboard admin
│   │   ├── gestao.css         # Páginas de gestão (cursos/disciplinas)
│   │   ├── matricula.css      # Página de matrícula
│   │   ├── horario.css        # Grade de horários
│   │   ├── plano-estudos.css  # Histórico por período
│   │   ├── home.css           # Landing page
│   │   └── admin-extra.css    # Componentes extras do admin
│   └── js/
│       ├── shared.js          # Utilitários globais (sidebar, validação, feedback)
│       ├── auth.js            # Login e cadastro
│       ├── dashboard-aluno.js # Dados do dashboard do aluno
│       ├── dashboard-admin.js # Dados do dashboard admin
│       ├── matricula.js       # Lógica de matrícula (carrinho, filtros)
│       ├── horario.js         # Grade de horários
│       ├── plano-estudos.js   # Histórico acadêmico
│       ├── gestao-cursos.js   # CRUD de cursos
│       ├── gestao-disciplinas.js # CRUD de disciplinas
│       ├── reporte-matricula.js # Relatórios e gráficos
│       └── api.js             # Camada de comunicação com backend (preparação)
└── README.md                  # Esta documentação
```

---

## 📄 Páginas e Fluxos

### Públicas
| Página | Descrição |
|--------|-----------|
| `index.html` | Landing page com apresentação do sistema e preview do dashboard |
| `cadastro.html` | Registro de aluno (nome, e-mail, curso, senha) |
| `login.html` | Autenticação por e-mail/senha |

### Aluno (requer autenticação)
| Página | Descrição |
|--------|-----------|
| `dashboard-aluno.html` | Visão geral: cursos aprovadas, em andamento, próxima aula, CR, ações rápidas, disciplinas do período, próximas aulas, avisos |
| `matricula.html` | Seleção de disciplinas com filtros, carrinho e confirmação |
| `horario.html` | Grade semanal (Seg–Sex) com legenda de disciplinas |
| `plano-estudos.html` | KPIs de progresso + histórico expansível por período com notas e status |

### Administrativo
| Página | Descrição |
|--------|-----------|
| `dashboard-admin.html` | KPIs (cursos, alunos, ocupação, disciplinas), ações rápidas, tabela de ocupação por curso |
| `gestao-cursos.html` | CRUD completo de cursos (código, nome, duração, status) com modal |
| `gestao-disciplinas.html` | CRUD completo de disciplinas (código, nome, curso, professor, vagas, horário, status) |
| `reporte-matricula.html` | Indicadores, tabela por curso, gráficos de barras e donut |

---

## ⚙️ Como Executar Localmente

```bash
# Opção 1: Servidor estático simples (Python)
cd matriculas
python -m http.server 8080

# Opção 2: Node.js (serve)
npx serve .

# Opção 3: VS Code Live Server
# Clique com botão direito em index.html → "Open with Live Server"
```

Acesse: `http://localhost:8080` (ou porta indicada)

> **Nota**: Por usar `fetch` simulado e caminhos relativos, **não abra os arquivos HTML diretamente no navegador** (`file://`). Use um servidor HTTP local.

---

## 🔗 Relacionamento HTML ↔ CSS ↔ JS

- Cada página HTML carrega `shared.css` + CSS específico da página
- Cada página carrega `shared.js` + JS específico da página
- `shared.js` expõe utilitários globais: `initSidebar()`, `saudacao()`, `exibirFeedback()`, `setCarregando()`, `validarCampo()`, `validarEmail()`, `corOcupacao()`
- Sidebars são **replicadas em cada HTML** (não há include/templating) — o item ativo é marcado com `sidebar__link--ativo` na própria página
- Dados simulados (**mocks**) vivem dentro de cada arquivo JS da página

---

## 📊 Dados Simulados (Mocks)

Atualmente **todo o sistema roda com dados em memória** nos arquivos JS:

| Arquivo | Entidades simuladas |
|---------|---------------------|
| `dashboard-aluno.js` | Perfil do aluno, cursos aprovadas/andamento, próxima aula, CR |
| `dashboard-admin.js` | Lista de cursos, totais de alunos/vagas, ocupação média |
| `matricula.js` | 8 disciplinas com período, vagas, horário |
| `horario.js` | Grade semanal preenchida |
| `plano-estudos.js` | 3 períodos × 4–5 disciplinas com notas/status |
| `gestao-cursos.js` | 5 cursos (código, nome, duração, status) |
| `gestao-disciplinas.js` | 5 disciplinas (curso, professor, vagas, horário, status) |
| `reporte-matricula.js` | Totais para gráficos e tabela por curso |

**Não há persistência** — recarregar a página restaura o estado inicial.

---

## 🔌 Preparação para Integração com Backend

O arquivo **`assets/js/api.js`** fornece a camada base:

```javascript
// Configuração centralizada
const API_CONFIG = {
  baseUrl: '/api',        // Altere para URL real do backend
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
};

// Cliente HTTP com tratamento de erros padronizado
const api = new ApiClient();

// Serviços de domínio prontos para implementar
const AuthService = { login, cadastrar, logout, ... };
const EstudanteService = { obterPerfil, obterDashboard, realizarMatricula, ... };
const AdminService = { obterResumo, listarCursos, criarCurso, listarDisciplinas, ... };

// Uso global
window.API = { client: api, Auth: AuthService, Estudante: EstudanteService, Admin: AdminService };
```

### O que está pronto
- ✅ Cliente `fetch` com timeout, abort, parsing JSON/texto
- ✅ Tratamento de erros HTTP (status ≥ 400) com `ApiError`
- ✅ Suporte a `Authorization: Bearer <token>` via `api.setAuthToken()`
- ✅ Services organizados por domínio (Auth, Estudante, Admin)
- ✅ Endpoints **sugeridos** nos comentários `TODO` de cada JS de página

### O que **não** está implementado (depende do contrato do backend)
- Endpoints reais (URLs, métodos, payloads, respostas)
- Autenticação real (JWT, refresh token, expiração)
- Validações de servidor (vagas, pré-requisitos, permissões)
- Paginação, ordenação, filtros no backend
- Upload/exportação de relatórios (PDF, Excel)

---

## ⚠️ Limitações Conhecidas

| Item | Status |
|------|--------|
| Persistência de dados | ❌ Apenas mocks em memória |
| Autenticação real | ❌ Simulada com `setTimeout` |
| Validação de vagas/pré-req no frontend | ⚠️ Básica (apenas UI), autoridade é do backend |
| Internacionalização (i18n) | ❌ Apenas pt-BR |
| Testes automatizados | ❌ Não configurados |
| PWA / Service Worker | ❌ Não implementado |
| Acessibilidade completa (WCAG 2.1 AA) | ⚠️ Básica (labels, foco, contraste) |

---

## 🚀 Melhorias Futuras Recomendadas

### Prioridade Alta (Pré-requisitos para produção)
1. **Definir contrato da API** (OpenAPI/Swagger) com backend
2. **Implementar autenticação real** (JWT + refresh, interceptor 401)
3. **Substituir mocks** por chamadas `window.API.*` nos JS das páginas
4. **Tratamento de estados** loading/empty/error em todas as listagens
5. **Validação de CSRF** e headers de segurança

### Prioridade Média
6. **Componentizar sidebars** (evitar duplicação de HTML) — via script de build ou SSI
7. **Centralizar mocks** em `assets/js/mock-data.js` para consistência entre páginas
8. **Melhorar acessibilidade**: ARIA live regions, skip links, foco em modais
9. **Testes E2E** (Cypress/Playwright) para fluxos críticos
10. **CI/CD** com lint (ESLint + Stylelint) e build de produção

### Prioridade Baixa (Nice to have)
11. **Tema escuro** (CSS variables já suportam)
12. **Exportação PDF/Excel** real nos relatórios
13. **Notificações push** (Service Worker)
14. **Dashboard admin**: filtros de período, comparativos ano a ano
15. **Documentação técnica** (ADR, diagramas de arquitetura)

---

## 📝 Resumo das Alterações desta Refatoração

| Categoria | Alterações |
|-----------|------------|
| **Remoções** | ✅ Sistema de créditos removido de todas as páginas, CSS e JS<br>✅ Campo "Matrícula Acadêmica" removido do cadastro (`cadastro.html`, `auth.js`)<br>✅ Página `diagrama-fluxo.html` e `diagrama-fluxo.js` excluídas<br>✅ Todos os links/referências ao diagrama removidos das sidebars |
| **Correções Funcionais** | ✅ `gestao-disciplinas.html` agora carrega `gestao-disciplinas.js` (era `gestao-cursos.js`)<br>✅ ID duplicado `val-cursos` corrigido no dashboard admin → `val-disciplinas`<br>✅ Valor fixo `42` movido para o indicador correto<br>✅ Modal de curso: campo "Créditos" removido (consistente com JS) |
| **Layouts (Desktop)** | ✅ Dashboard aluno: KPIs em grid 2×2, área principal em 2 colunas (ações + disciplinas do período | próximas aulas + avisos)<br>✅ Dashboard admin: KPIs em grid 2×2, ações rápidas + tabela lado a lado<br>✅ Plano de estudos: KPIs em grid 2×2, histórico em cards expansíveis<br>✅ CSS específico criado: `dashboard-aluno.css`, `dashboard-admin.css`, `plano-estudos.css` |
| **Organização de Código** | ✅ `api.js` criado como camada HTTP base<br>✅ `gestao-cursos.js` e `gestao-disciplinas.js` limpos (sem créditos)<br>✅ `matricula.js` e `plano-estudos.js` sem referências a créditos<br>✅ Sidebars padronizadas: links corretos, item ativo por página, "Disciplinas" no admin |
| **Documentação** | ✅ `README.md` criado na raiz |

---

## ✅ Checklist de Verificação Final

- [x] Todos os arquivos importados existem (CSS/JS)
- [x] Links internos apontam para páginas existentes
- [x] IDs duplicados eliminados (`val-cursos` → `val-disciplinas`)
- [x] Sintaxe JavaScript válida (sem erros de console evidentes)
- [x] Referências a "créditos" removidas (exceto termo genérico em feature card da home)
- [x] Referências a `diagrama-fluxo` removidas
- [x] Campo "Matrícula Acadêmica" removido do cadastro
- [x] Sidebars consistentes entre aluno/admin
- [x] Layouts desktop otimizados (grid, menos rolagem vertical)
- [x] `api.js` criado e estruturado
- [x] `README.md` documentado

---

**Última atualização**: Outubro 2025  
**Versão**: 1.0.0 (pós-refatoração)
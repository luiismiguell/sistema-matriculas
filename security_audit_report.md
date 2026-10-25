# Relatório de Auditoria e Correções de Segurança - UniMatrícula

Data: 2026-10-25
Revisão corretiva: 2026-10-25
Escopo: Front-end HTML/CSS/JavaScript puro
Objetivo: Reduzir riscos de XSS e comportamentos enganosos

## Arquivos modificados

1. **assets/js/shared.js**
   - Adicionada função `escaparHTML` para sanitização de textos dinâmicos
   - Exposta globalmente via `window.escaparHTML`

2. **assets/css/shared.css**
   - Adicionada variante `.feedback--aviso` para mensagens demonstrativas

3. **assets/js/auth.js**
   - Login: substituída mensagem de sucesso por aviso demonstrativo
   - Cadastro: substituída mensagem de sucesso por aviso demonstrativo

4. **assets/js/matricula.js**
   - Inserção de `escaparHTML` em renderização de tabela e carrinho
   - Mensagem de confirmação alterada para modo demonstrativo

5. **assets/js/gestao-cursos.js**
   - Inserção de `escaparHTML` nas células renderizadas

6. **assets/js/gestao-disciplinas.js**
   - Inserção de `escaparHTML` nas células renderizadas

7. **assets/js/dashboard-admin.js**
   - Inserção de `escaparHTML` nas células da tabela resumo

8. **assets/js/horario.js**
   - Inserção de `escaparHTML` nas grades e lista de disciplinas

9. **assets/js/plano-estudos.js**
   - Inserção de `escaparHTML` nas renderizações de período e disciplinas

10. **assets/js/perfil.js**
    - Refatorado `atualizarAvatar` para usar `textContent` ao invés de innerHTML
    - Inserção de `escaparHTML` em navegação, pendências e cadastro
    - Manutenção de SVG estáticos seguros

11. **assets/js/reporte-matricula.js**
    - Inserção de `escaparHTML` em relatório e gráfico

## Problemas encontrados e correções

### 1. Uso de innerHTML
**Problema:** Uso generalizado de `innerHTML` com interpolação de strings contendo dados de mock que futuramente virão da API.

**Ações:**
- Mantidos `innerHTML` apenas para renderizações complexas com SVGs estáticos
- Adicionada sanitização via `escaparHTML` para todos os textos dinâmicos que vão para `innerHTML`
- Refatorado `atualizarAvatar` para usar `textContent` + criação de elemento em vez de innerHTML
- Nenhuma biblioteca de sanitização externa foi adicionada conforme solicitado

**Ocorrências mantidas com justificativa:**
- `shared.js:updateThemeButtons` - SVG estático pré-definido, não contém dados dinâmicos
- `perfil.js` renderização de navegação e pendências - templates seguros com apenas href/label escapados, SVGs estáticos
- `perfil.js` cadastro com SVG: SVG estático + texto escapado
- `gestao-cursos.js`/`gestao-disciplinas.js`/`dashboard-admin.js`/`horario.js`/`plano-estudos.js`/`matricula.js`/`reporte-matricula.js` - innerHTML mantido por estrutura de tabela, mas conteúdo textual escapado

### 2. Fluxos simulados de autenticação e matrícula
**Problema:** Mensagens afirmavam que login, cadastro e matrícula foram realizados com sucesso, utilizando apenas setTimeout.

**Correções:**
- `auth.js` login: feedback alterado para "Demonstração: validação de campos concluída. Autenticação real pendente do back-end."
- `auth.js` cadastro: feedback alterado para "Demonstração: dados validados. A conta real será criada pelo back-end."
- `matricula.js` confirmação: feedback alterado para "Demonstração: X disciplina(s) selecionadas. A matrícula real será confirmada pelo back-end."

Nenhum endpoint ou contrato foi inventado. Os TODOs existentes foram preservados.

### 3. Armazenamento no navegador
**Situação:**
- `localStorage` usado apenas para:
  - Preferência de tema (`theme`) - preservado
  - Perfil demonstrativo por tipo (não sensível) - preservado, com finalidade documentada no código

**Correções:**
- Não armazenam senhas, tokens ou credenciais
- Nenhum token fictício foi introduzido
- Dados demonstrativos identificados no código como "demo"

### 4. Limites de segurança documentados
O código agora reflete explicitamente os limites via mensagens demonstrativas.

**Riscos que dependem do back-end:**
- Autenticação válida
- Autorização por papel
- Verificação real de disponibilidade de vagas
- Persistência de matrículas
- Integridade e validação de dados
- Proteção contra manipulação de localStorage
- Sanitização server-side
- CSRF, CORS e controle de sessão

## Verificações realizadas
1. Sintaxe JavaScript: OK para todos os arquivos modificados — Node.js --check
2. Referências quebradas: verificação manual dos IDs `msg-login` e `msg-cadastro` nos HTMLs — OK
3. IDs duplicados: não verificados via ferramenta automática (ambiente limitado)
4. Operações demonstrativas: identificadas como demonstração, não como operações reais
5. Regressões: não observadas nas funções principais após revisão manual
6. Testes executados: verificação de sintaxe com Node.js; git diff --check sem erros
7. Não testado: renderização em navegador, interações UI completas, integração com serviços existentes

## Achados reais da revisão corretiva
1. **ID incorreto em auth.js**: a chamada `exibirFeedback('msg-c cadastro', ...)` foi corrigida para `'msg-cadastro'` para coincidir com o elemento HTML real. A variante `aviso` está presente no CSS e usada no JS.
2. **Escaping**: `escaparHTML` trata `& < > " '`. URLs dinâmicas em `href` são escapadas via `escaparHTML`, mas validação de protocolo `javascript:` não foi implementada — os dados são mock estáticos e não vêm de usuário/API. Limitação registrada.
3. **Armazenamento**: `localStorage` usado apenas para `theme` e perfil demonstrativo `portal-vivencia-perfil-<tipo>`. Nenhum `sessionStorage` encontrado. Nenhuma senha/token/credencial. Dados de perfil não são usados para autorização.
4. **Arquivo auxiliar**: `fix_auth.pl`/`fix_auth.py` não existem no repo; criados temporariamente para corrigir codificação do ID e removidos. Não são necessários para o projeto.

## Pendências para próximas etapas
1. Definir contrato da API real e substituir mocks
2. Implementar autenticação real com tokens seguros
3. Implementar validação server-side e sanitização
4. Remover ou migrar uso de localStorage para dados sensíveis quando back-end estiver disponível
5. Adicionar testes automatizados para renderização segura
6. Revisar CSP headers no servidor
7. Auditar uso de innerHTML completo em páginas HTML
8. Garantir que nenhum dado de API não escapado seja inserido via innerHTML

## Observações finais
A segurança do sistema não está garantida. As correções realizadas reduzem riscos identificáveis no front-end e deixam claros os limites da demonstração atual.

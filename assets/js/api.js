/* ── api.js — Camada de comunicação com o backend ── */

/**
 * Configuração base da API.
 * Ajuste API_BASE_URL conforme o ambiente (dev, staging, prod).
 */
const API_CONFIG = {
  baseUrl: '/api',           // Altere para a URL real do backend (ex: 'https://api.exemplo.com')
  timeout: 15000,            // Timeout em ms
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

/**
 * Cliente HTTP simples com fetch.
 * Centraliza tratamento de erros, parsing JSON e autenticação futura.
 */
class ApiClient {
  constructor(config = {}) {
    this.baseUrl = config.baseUrl || API_CONFIG.baseUrl;
    this.defaultHeaders = { ...API_CONFIG.headers };
    this.timeout = config.timeout || API_CONFIG.timeout;
  }

  /**
   * Define o token de autenticação (ex: JWT) para requisições subsequentes.
   */
  setAuthToken(token) {
    if (token) {
      this.defaultHeaders['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.defaultHeaders['Authorization'];
    }
  }

  /**
   * Remove o token de autenticação.
   */
  clearAuthToken() {
    delete this.defaultHeaders['Authorization'];
  }

  /**
   * Faz uma requisição HTTP genérica.
   * @param {string} endpoint - Caminho do endpoint (ex: '/auth/login')
   * @param {RequestInit} options - Opções do fetch
   * @returns {Promise<any>} - Dados da resposta (JSON) ou vazio para 204
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    const fetchOptions = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...(options.headers || {}),
      },
      signal: controller.signal,
    };

    try {
      const response = await fetch(url, fetchOptions);

      clearTimeout(timeoutId);

      // Respostas sem conteúdo (204 No Content)
      if (response.status === 204) {
        return null;
      }

      const contentType = response.headers.get('content-type');
      const isJson = contentType && contentType.includes('application/json');
      const data = isJson ? await response.json() : await response.text();

      if (!response.ok) {
        // Tenta extrair mensagem de erro do backend
        const message = (isJson && data?.message) || data || `Erro HTTP ${response.status}`;
        throw new ApiError(response.status, message, data);
      }

      return data;
    } catch (err) {
      clearTimeout(timeoutId);
      if (err instanceof ApiError) throw err;
      if (err.name === 'AbortError') throw new ApiError(0, 'Tempo de conexão esgotado', null);
      throw new ApiError(0, `Erro de rede: ${err.message}`, null);
    }
  }

  // Métodos de conveniência
  get(endpoint) { return this.request(endpoint, { method: 'GET' }); }
  post(endpoint, body) { return this.request(endpoint, { method: 'POST', body: JSON.stringify(body) }); }
  put(endpoint, body) { return this.request(endpoint, { method: 'PUT', body: JSON.stringify(body) }); }
  patch(endpoint, body) { return this.request(endpoint, { method: 'PATCH', body: JSON.stringify(body) }); }
  delete(endpoint) { return this.request(endpoint, { method: 'DELETE' }); }
}

/**
 * Erro padronizado da API.
 */
class ApiError extends Error {
  constructor(status, message, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Instância singleton para uso em todo o front-end
const api = new ApiClient();

/**
 * Serviços de domínio (exemplos — implemente conforme a API real).
 * Mantenha a separação: cada serviço encapsula endpoints de uma entidade.
 */
const AuthService = {
  async login(email, senha) {
    return api.post('/auth/login', { email, senha });
  },

  async cadastrar(dados) {
    return api.post('/auth/cadastrar', dados);
  },

  async logout() {
    return api.post('/auth/logout');
  },

  async recuperarSenha(email) {
    return api.post('/auth/recuperar-senha', { email });
  },

  async renovarToken() {
    return api.post('/auth/refresh');
  },
};

const EstudanteService = {
  async obterPerfil() {
    return api.get('/estudante/perfil');
  },

  async obterDashboard() {
    return api.get('/estudante/dashboard');
  },

  async obterHistorico() {
    return api.get('/estudante/historico');
  },

  async obterHorario() {
    return api.get('/estudante/horario');
  },

  async realizarMatricula(cursosIds) {
    return api.post('/estudante/matricula', { cursos: cursosIds });
  },
};

const AdminService = {
  async obterResumo() {
    return api.get('/admin/resumo');
  },

  async listarCursos(filtros = {}) {
    const params = new URLSearchParams(filtros).toString();
    return api.get(`/admin/cursos${params ? '?' + params : ''}`);
  },

  async criarCurso(dados) {
    return api.post('/admin/cursos', dados);
  },

  async atualizarCurso(id, dados) {
    return api.put(`/admin/cursos/${id}`, dados);
  },

  async excluirCurso(id) {
    return api.delete(`/admin/cursos/${id}`);
  },

  async listarDisciplinas(filtros = {}) {
    const params = new URLSearchParams(filtros).toString();
    return api.get(`/admin/disciplinas${params ? '?' + params : ''}`);
  },

  async criarDisciplina(dados) {
    return api.post('/admin/disciplinas', dados);
  },

  async atualizarDisciplina(id, dados) {
    return api.put(`/admin/disciplinas/${id}`, dados);
  },

  async excluirDisciplina(id) {
    return api.delete(`/admin/disciplinas/${id}`);
  },

  async obterRelatorios(filtros = {}) {
    const params = new URLSearchParams(filtros).toString();
    return api.get(`/admin/relatorios${params ? '?' + params : ''}`);
  },
};

// Exporta para uso global (ou use módulos ES6 se preferir)
window.API = {
  client: api,
  Auth: AuthService,
  Estudante: EstudanteService,
  Admin: AdminService,
  ApiError,
};
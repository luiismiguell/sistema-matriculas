/* ── api.js — Camada de comunicação com o backend ── */

/**
 * Configuração base da API.
 * Ajuste API_CONFIG.baseUrl conforme o ambiente (dev, staging, prod).
 */
const API_CONFIG = {
  baseUrl: '/api',           // Ajustar após definir a URL-base real do backend
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
   * @param {string} endpoint - Caminho relativo definido pelo contrato real da API
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

      // Respostas sem conteúdo (204 No Content)
      if (response.status === 204) {
        return null;
      }

      const contentType = response.headers.get('content-type');
      const isJson = contentType && contentType.includes('application/json');
      const data = isJson ? await response.json() : await response.text();

      if (!response.ok) {
        // Tenta extrair mensagem de erro do backend
        const message = (isJson && data?.message)
          || (typeof data === 'string' && data)
          || `Erro HTTP ${response.status}`;
        throw new ApiError(response.status, message, data);
      }

      return data;
    } catch (err) {
      if (err instanceof ApiError) throw err;
      if (err.name === 'AbortError') throw new ApiError(0, 'Tempo de conexão esgotado', null);
      throw new ApiError(0, `Erro de rede: ${err.message}`, null);
    } finally {
      clearTimeout(timeoutId);
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
 * Disponibiliza somente o cliente HTTP genérico.
 * Os serviços e endpoints específicos devem ser definidos após acordo com o backend.
 */
window.API = {
  client: api,
  ApiError,
};

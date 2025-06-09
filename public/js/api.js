// public/js/api.js
// ------------------------------------------------------------
// Define BASE_URL, API_URL e apiFetch como variáveis globais
// para uso em todos os scripts sem módulos ES.
// ------------------------------------------------------------
;(function (global) {
  // 1) URL base do seu servidor
  global.BASE_URL = 'http://localhost:3000'

  // 2) API_URL aponta para todas as rotas que começam em "/api"
  global.API_URL  = BASE_URL + '/api'

  // 3) apiFetch: wrapper simples para fetch
  global.apiFetch = async function (url, options = {}) {
    try {
      const res = await fetch(url, options)
      return res
    } catch (err) {
      console.error('apiFetch error:', err)
      throw err
    }
  }
})(window)

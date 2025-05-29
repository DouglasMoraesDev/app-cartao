// public/js/api.js
// =========================
// Configuração de URLs
// =========================
const BASE_URL = 'http://localhost:3000'; // em produção, overrida por process.env.BASE_URL
const API_URL  = `${BASE_URL}/api`;

/**
 * Wrapper para fetch que trata:
 *  - 401 Unauthorized → limpa sessão e redireciona ao login
 *  - 402 Payment Required → ass. expirada, redireciona ao payment.html
 */
async function apiFetch(url, options = {}) {
  const res = await fetch(url, options);

  if (res.status === 401) {
    alert('Sessão expirada. Faça login novamente.');
    localStorage.clear();
    window.location.href = '/';
    return;
  }
  if (res.status === 402) {
    const err = await res.json();
    alert(err.message || 'Assinatura expirada');
    localStorage.clear();
    window.location.href = '/payment.html';
    return;
  }
  return res;
}

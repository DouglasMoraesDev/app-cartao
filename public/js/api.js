const BASE_URL = 'http://localhost:3000';
const API_URL  = `${BASE_URL}/api`;

/**
 * Wrapper fetch que:
 *  - trata 401 → redireciona ao login
 *  - trata 402 → redireciona ao payment
 */
async function apiFetch(url, options = {}) {
  const res = await fetch(url, options);
  if (res.status === 401) {
    alert('Sessão expirada. Faça login novamente.');
    localStorage.clear();
    window.location.href = '/login.html';
    return;
  }
  if (res.status === 402) {
    alert('Assinatura expirada');
    localStorage.clear();
    window.location.href = '/payment.html';
    return;
  }
  return res;
}

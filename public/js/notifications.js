/**
 * notifications.js
 * - loadNotifications: busca todos os clientes,
 *   filtra os que tem 10+ pontos e exibe em lista
 */
async function loadNotifications() {
  const token = localStorage.getItem('authToken');
  const estId = localStorage.getItem('currentEstablishmentId');
  const res = await apiFetch(`${API_URL}/clients?establishmentId=${estId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const clients = await res.json();
  const ul = document.getElementById('clients');
  ul.innerHTML = '';
  clients
    .filter(c => c.points >= 10)
    .forEach(c => {
      const li = document.createElement('li');
      li.textContent = `${c.fullName} — ${c.points} pontos`;
      ul.appendChild(li);
    });
}

// inicia ao carregar a página
document.addEventListener('DOMContentLoaded', loadNotifications);

/**
 * clients.js
 * - loadClients: busca todos os clientes e preenche tabela/lista
 * - renderClientsList: exibe lista + botões de editar/excluir
 * - deleteClient: exclui no servidor e recarrega a lista
 * - editClient: redireciona para cadastrar.html?clientId=<id>
 */

let clientsData = [];

// 1) Busca clientes do estabelecimento
async function loadClients() {
  const token = localStorage.getItem('authToken');
  const estId = localStorage.getItem('currentEstablishmentId');
  const res = await apiFetch(`${API_URL}/clients?establishmentId=${estId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  clientsData = await res.json();
  renderClientsList();
}

// 2) Renderiza lista filtrável
function renderClientsList(filter = '') {
  const ul = document.getElementById('clientsList');
  if (!ul) return;
  ul.innerHTML = '';
  clientsData
    .filter(c => c.fullName.toLowerCase().includes(filter) || c.phone.includes(filter))
    .forEach(c => {
      const li = document.createElement('li');
      li.dataset.id = c.id;
      li.innerHTML = `
        <span>${c.fullName} — ${c.points} pts</span>
        <div class="actions">
          <button class="btn-edit">Editar</button>
          <button class="btn-delete">Excluir</button>
        </div>`;
      ul.appendChild(li);
    });
}

// 3) Excluir cliente
async function deleteClient(id) {
  if (!confirm('Excluir este cliente?')) return;
  const token = localStorage.getItem('authToken');
  await apiFetch(`${API_URL}/clients/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  alert('Cliente excluído!');
  await loadClients();
}

// 4) Redireciona para edição
function editClient(id) {
  window.location.href = `/cadastrar.html?clientId=${id}`;
}

// 5) Listeners
document.addEventListener('DOMContentLoaded', () => {
  // 5.1) Filtro de pesquisa
  const searchInput = document.getElementById('searchClientsInput');
  if (searchInput) {
    searchInput.addEventListener('input', e =>
      renderClientsList(e.target.value.trim().toLowerCase())
    );
  }
  // 5.2) Clicar em “Editar” ou “Excluir”
  const ul = document.getElementById('clientsList');
  if (ul) {
    ul.addEventListener('click', e => {
      const li = e.target.closest('li');
      if (!li) return;
      const id = li.dataset.id;
      if (e.target.classList.contains('btn-edit')) {
        return editClient(id);
      }
      if (e.target.classList.contains('btn-delete')) {
        return deleteClient(id);
      }
    });
    // 5.3) Carrega a lista inicialmente
    loadClients();
  }
});

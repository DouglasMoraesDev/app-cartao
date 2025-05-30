/**
 * clients.js
 * - loadClients: busca todos os clientes e atualiza clientsData
 * - renderClientsList: exibe lista filtrável + botões de editar/excluir
 * - saveClient/editClient/deleteClient: CRUD de clientes
 */

let clientsData = [];
let isEditing = false;
let editingClientId = null;

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

// 3) Salvar ou atualizar cliente
async function saveClient() {
  const fullName = document.getElementById('clientFullName').value.trim();
  const phone = document.getElementById('clientPhone').value.trim();
  const email = document.getElementById('clientEmail').value.trim();
  const points = parseInt(document.getElementById('clientPoints').value, 10) || 0;
  if (!fullName || !phone) return alert('Nome e telefone são obrigatórios!');
  const estId = localStorage.getItem('currentEstablishmentId');
  const token = localStorage.getItem('authToken');
  const url = isEditing
    ? `${API_URL}/clients/${editingClientId}`
    : `${API_URL}/clients`;
  const method = isEditing ? 'PUT' : 'POST';
  const body = { fullName, phone, email, points, establishmentId: estId };
  const res = await apiFetch(url, {
    method, headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const err = await res.json();
    return alert(err.message || 'Erro ao salvar cliente');
  }
  alert(isEditing ? 'Cliente atualizado!' : 'Cliente criado!');
  isEditing = false; editingClientId = null;
  document.getElementById('saveClientBtn').textContent = 'Salvar Cliente';
  ['clientFullName','clientPhone','clientEmail','clientPoints']
    .forEach(id => document.getElementById(id).value = '');
  await loadClients();
}

// 4) Preparar edição
async function editClient(id) {
  const c = clientsData.find(x => x.id == id);
  if (!c) return alert('Cliente não encontrado');
  document.getElementById('clientFullName').value = c.fullName;
  document.getElementById('clientPhone').value = c.phone;
  document.getElementById('clientEmail').value = c.email || '';
  document.getElementById('clientPoints').value = c.points;
  isEditing = true;
  editingClientId = id;
  document.getElementById('saveClientBtn').textContent = 'Atualizar Cliente';
}

// 5) Excluir
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

// 6) Listeners
document.addEventListener('DOMContentLoaded', () => {
  // 1) Botão de salvar cliente
  const saveBtn = document.getElementById('saveClientBtn');
  if (saveBtn) {
    saveBtn.addEventListener('click', saveClient);
  }

  // 2) Lista de clientes (editar / excluir / modal)
  const ul = document.getElementById('clientsList');
  if (ul) {
    ul.addEventListener('click', e => {
      const li = e.target.closest('li');
      if (!li) return;
      const id = li.dataset.id;
      if (e.target.classList.contains('btn-edit')) return editClient(id);
      if (e.target.classList.contains('btn-delete')) return deleteClient(id);
    });
  }

  // 3) Filtro de pesquisa — só registra se o input existir
  const searchInput = document.getElementById('searchClientsInput');
  if (searchInput) {
    searchInput.addEventListener('input', e =>
      renderClientsList(e.target.value.trim().toLowerCase())
    );
  }

  // 4) Carrega inicialmente
  if (ul) loadClients();
});

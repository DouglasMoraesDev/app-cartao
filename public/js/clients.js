// public/js/clients.js
let clientsData   = [];  // cache local dos clientes
let isEditing     = false;
let editingClient = null;

/**
 * Carrega todos os clientes do estabelecimento e armazena em clientsData
 */
async function loadClients() {
  try {
    const token = localStorage.getItem('authToken');
    const estId = localStorage.getItem('currentEstablishmentId');
    const res   = await apiFetch(
      `${API_URL}/clients?establishmentId=${estId}`,
      { headers:{ 'Authorization': `Bearer ${token}` } }
    );
    clientsData = await res.json();
    renderClientsList();
  } catch (err) {
    console.error('Erro ao carregar clientes:', err);
  }
}

/**
 * Renderiza a lista filtrável de clientes
 * @param {string} filter 
 */
function renderClientsList(filter = '') {
  const ul = document.getElementById('clientsList');
  ul.innerHTML = '';
  clientsData
    .filter(c => c.fullName.toLowerCase().includes(filter) || c.phone.includes(filter))
    .forEach(c => {
      const li = document.createElement('li');
      li.dataset.id = c.id;
      li.style.display = 'flex';
      li.style.justifyContent = 'space-between';
      li.style.alignItems = 'center';
      li.style.padding = '0.75rem';
      li.style.borderBottom = '1px solid #ddd';
      li.style.cursor = 'pointer';
      li.innerHTML = `
        <span>${c.fullName} — ${c.points} pts</span>
        <div class="actions">
          <button class="btn-edit">Editar</button>
          <button class="btn-delete">Excluir</button>
        </div>
      `;
      ul.appendChild(li);
    });
}

// Busca ao digitar no filtro
document.getElementById('searchClientsInput')
  .addEventListener('input', e => renderClientsList(e.target.value.trim().toLowerCase()));

/**
 * Setup de listeners de editar/excluir e exibir detalhes
 */
function setupClientsListeners() {
  const ul = document.getElementById('clientsList');
  ul.addEventListener('click', async e => {
    const li = e.target.closest('li');
    if (!li) return;
    const id = li.dataset.id;

    if (e.target.classList.contains('btn-edit')) {
      return editClient(id);
    }
    if (e.target.classList.contains('btn-delete')) {
      if (confirm('Excluir este cliente?')) {
        await deleteClient(id);
        return loadClients();
      }
      return;
    }
    // ao clicar no <li> fora dos botões, abre modal de detalhes
    showClientDetail(id);
  });
}

// Exibe o modal de detalhes
function showClientDetail(id) {
  const c = clientsData.find(x => x.id == id);
  if (!c) return;
  document.getElementById('detailName').textContent   = c.fullName;
  document.getElementById('detailEmail').textContent  = c.email || '—';
  document.getElementById('detailPhone').textContent  = c.phone || '—';
  document.getElementById('detailPoints').textContent = c.points;
  document.getElementById('detailBackdrop').style.display    = 'block';
  document.getElementById('clientDetailCard').style.display = 'block';
}

// Fecha modal de detalhes
document.getElementById('closeDetailCard').addEventListener('click', () => {
  document.getElementById('detailBackdrop').style.display    = 'none';
  document.getElementById('clientDetailCard').style.display = 'none';
});
document.getElementById('detailBackdrop').addEventListener('click', () => {
  document.getElementById('detailBackdrop').style.display    = 'none';
  document.getElementById('clientDetailCard').style.display = 'none';
});

/**
 * Salva (POST) ou Atualiza (PUT) um cliente
 */
async function saveClient() {
  const fullName = document.getElementById('clientFullName').value.trim();
  const phone    = document.getElementById('clientPhone').value.trim();
  const email    = document.getElementById('clientEmail').value.trim();
  const points   = parseInt(document.getElementById('clientPoints').value) || 0;
  if (!fullName || !phone) return alert('Nome e telefone são obrigatórios!');

  const estId  = localStorage.getItem('currentEstablishmentId');
  const token  = localStorage.getItem('authToken');
  const url    = isEditing
    ? `${API_URL}/clients/${editingClient}`
    : `${API_URL}/clients`;
  const method = isEditing ? 'PUT' : 'POST';
  const body   = { fullName, phone, email, points, establishmentId: estId };

  const res = await apiFetch(url, {
    method,
    headers: {
      'Content-Type':'application/json',
      'Authorization':`Bearer ${token}`
    },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const err = await res.json();
    return alert(err.message || 'Erro ao salvar cliente');
  }

  alert(isEditing ? 'Cliente atualizado!' : 'Cliente criado!');
  isEditing = false; editingClient = null;
  document.getElementById('saveClientBtn').textContent = 'Salvar Cliente';
  ['clientFullName','clientPhone','clientEmail','clientPoints']
    .forEach(id => document.getElementById(id).value = '');
  await loadClients();
}
document.getElementById('saveClientBtn').addEventListener('click', saveClient);

/**
 * Carrega os dados de um cliente para edição
 */
async function editClient(id) {
  const token = localStorage.getItem('authToken');
  const estId = localStorage.getItem('currentEstablishmentId');
  const res   = await apiFetch(
    `${API_URL}/clients?establishmentId=${estId}`,
    { headers: { 'Authorization': `Bearer ${token}` } }
  );
  const clients = await res.json();
  const c = clients.find(x => x.id == id);
  if (!c) return alert('Cliente não encontrado');

  document.getElementById('clientFullName').value = c.fullName;
  document.getElementById('clientPhone').value    = c.phone;
  document.getElementById('clientEmail').value    = c.email || '';
  document.getElementById('clientPoints').value   = c.points;
  isEditing     = true;
  editingClient = id;
  document.getElementById('saveClientBtn').textContent = 'Atualizar Cliente';
}

/**
 * Exclui um cliente
 */
async function deleteClient(id) {
  const token = localStorage.getItem('authToken');
  const estId = localStorage.getItem('currentEstablishmentId');
  await apiFetch(
    `${API_URL}/clients/${id}?establishmentId=${estId}`,
    { method:'DELETE', headers:{ 'Authorization':`Bearer ${token}` } }
  );
  alert('Cliente excluído!');
}

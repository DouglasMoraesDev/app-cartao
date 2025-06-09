// public/js/clients.js
// ------------------------------------------------------------
// Carrega, renderiza e gerencia ações na lista de clientes
// Só roda se os elementos #searchClientsInput e #clientsList existirem.
// Usa API_URL e apiFetch globais (definidos em api.js).
// ------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  const token       = localStorage.getItem('authToken');
  const estId       = localStorage.getItem('currentEstablishmentId');
  const searchInput = document.getElementById('searchClientsInput');
  const listEl      = document.getElementById('clientsList');

  // Se não tiver o input ou a lista, não estamos na tabela: sai
  if (!searchInput || !listEl) return;

  // Se não estiver logado, redireciona
  if (!token || !estId) {
    return window.location.href = '/login.html';
  }

  // Carrega e renderiza pela primeira vez
  loadAndRenderClients();

  // Atualiza filtro enquanto digita
  searchInput.addEventListener('input', () => {
    loadAndRenderClients(searchInput.value.trim().toLowerCase());
  });

  // Função que busca + renderiza, opcionalmente filtrando por nome/telefone/email
  async function loadAndRenderClients(filter = '') {
    try {
      const res = await apiFetch(
        `${API_URL}/clients?establishmentId=${estId}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error('Falha ao carregar clientes');
      const clients = await res.json();
      renderClientsList(clients, filter);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  // Renderiza cada cliente dentro de <ul id="clientsList">
  function renderClientsList(clients, filter) {
    listEl.innerHTML = ''; // limpa a lista

    const filtered = clients.filter(c =>
      c.fullName.toLowerCase().includes(filter) ||
      c.phone.toLowerCase().includes(filter) ||
      (c.email || '').toLowerCase().includes(filter)
    );

    if (filtered.length === 0) {
      listEl.innerHTML = '<li class="no-clients">Nenhum cliente encontrado.</li>';
      return;
    }

    for (const c of filtered) {
      const li = document.createElement('li');
      li.className = 'client-item';
      li.innerHTML = `
        <div class="client-info">
          <strong>${c.fullName}</strong><br>
          <small>${c.phone} • ${c.email || '—'}</small><br>
          <span>${c.points} pts</span>
        </div>
        <div class="client-actions">
          <button class="edit-btn" data-id="${c.id}" title="Editar">✏️</button>
          <button class="delete-btn" data-id="${c.id}" title="Excluir">🗑️</button>
        </div>
      `;
      listEl.appendChild(li);
    }

    // Eventos de ação
    listEl.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        window.location.href = `/cadastrar.html?clientId=${id}`;
      });
    });
    listEl.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (!confirm('Tem certeza que deseja excluir este cliente?')) return;
        const id = btn.dataset.id;
        try {
          const res = await apiFetch(
            `${API_URL}/clients/${id}?establishmentId=${estId}`,
            {
              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${token}` }
            }
          );
          if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || 'Falha ao excluir cliente');
          }
          // Recarrega com o filtro atual
          loadAndRenderClients(filter);
        } catch (err) {
          console.error(err);
          alert(err.message);
        }
      });
    });
  }
});

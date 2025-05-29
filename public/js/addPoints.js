// public/js/addPoints.js
/**
 * Configura listener do botão "Buscar" na aba "Adicionar Pontos"
 */
function setupAddPointsListeners() {
  const btn = document.getElementById('searchPointsBtn');
  if (btn) btn.addEventListener('click', onSearchPoints);
}

/**
 * Busca cliente pelo nome/telefone e exibe card para adicionar pontos
 */
async function onSearchPoints() {
  const term = document.getElementById('searchPointsInput').value.trim().toLowerCase();
  if (!term) return;
  const token = localStorage.getItem('authToken');
  const estId = localStorage.getItem('currentEstablishmentId');

  const res = await apiFetch(
    `${API_URL}/clients?establishmentId=${estId}`,
    { headers:{ 'Authorization':`Bearer ${token}` } }
  );
  const clients = await res.json();
  const c = clients.find(c => c.fullName.toLowerCase().includes(term));
  const container = document.getElementById('addPointsCardContainer');
  container.innerHTML = '';

  if (c) {
    // exibe card com input e botão
    container.innerHTML = `
      <div style="background:var(--container-bg);padding:1rem;border-radius:8px;box-shadow:var(--box-shadow);max-width:280px;margin:1rem auto;">
        <h4>${c.fullName}</h4>
        <p>Pontos atuais: ${c.points}</p>
        <input type="number" id="ptsToAdd" placeholder="Pontos a adicionar" min="1" style="width:100%;padding:0.5rem;margin:0.5rem 0;" />
        <button id="savePointsBtn">Salvar</button>
      </div>
    `;
    document.getElementById('savePointsBtn')
      .addEventListener('click', () => addPoints(c.id));
  } else {
    container.textContent = 'Cliente não encontrado.';
  }
}

/**
 * Adiciona pontos ao cliente e recarrega lista
 */
async function addPoints(clientId) {
  const pts = parseInt(document.getElementById('ptsToAdd').value, 10);
  if (!pts || pts < 1) return alert('Insira uma quantidade válida.');

  const token = localStorage.getItem('authToken');
  const estId = localStorage.getItem('currentEstablishmentId');
  await apiFetch(`${API_URL}/clients/${clientId}/points`, {
    method: 'POST',
    headers: {
      'Content-Type':'application/json',
      'Authorization':`Bearer ${token}`
    },
    body: JSON.stringify({ pointsToAdd: pts, establishmentId: estId })
  });

  alert('Pontos adicionados com sucesso!');
  await loadClients();
  document.getElementById('addPointsCardContainer').innerHTML = '';
}

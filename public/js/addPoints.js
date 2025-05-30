/**
 * addPoints.js
 * - onSearchPoints: pesquisa cliente e exibe card
 * - addPoints: envia POST para adicionar pontos
 */

function setupAddPointsListeners() {
  document.getElementById('searchPointsBtn')
    .addEventListener('click', onSearchPoints);
}

async function onSearchPoints() {
  const term = document.getElementById('searchPointsInput').value.trim().toLowerCase();
  if (!term) return;
  const token = localStorage.getItem('authToken');
  const estId = localStorage.getItem('currentEstablishmentId');
  const res = await apiFetch(
    `${API_URL}/clients?establishmentId=${estId}`,
    { headers: { 'Authorization': `Bearer ${token}` } }
  );
  const clients = await res.json();
  const c = clients.find(c => c.fullName.toLowerCase().includes(term) || c.phone.includes(term));
  const container = document.getElementById('addPointsCardContainer');
  container.innerHTML = '';
  if (c) {
    container.innerHTML = `
      <div class="dashboard-container">
        <h4>${c.fullName}</h4>
        <p>Pontos atuais: ${c.points}</p>
        <input type="number" id="ptsToAdd" placeholder="Pontos a adicionar" min="1" />
        <button id="savePointsBtn">Salvar</button>
      </div>`;
    document.getElementById('savePointsBtn')
      .addEventListener('click', () => addPoints(c.id));
  } else {
    container.textContent = 'Cliente não encontrado.';
  }
}

async function addPoints(clientId) {
  const pts = parseInt(document.getElementById('ptsToAdd').value, 10);
  if (!pts || pts < 1) return alert('Insira uma quantidade válida.');
  const token = localStorage.getItem('authToken');
  const estId = localStorage.getItem('currentEstablishmentId');
  await apiFetch(`${API_URL}/clients/${clientId}/points`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ pointsToAdd: pts, establishmentId: estId })
  });
  alert('Pontos adicionados!');
  document.getElementById('addPointsCardContainer').innerHTML = '';
}

// inicia
document.addEventListener('DOMContentLoaded', setupAddPointsListeners);

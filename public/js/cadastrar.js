/**
 * cadastrar.js
 * - Se há ?clientId=<id> na URL, busca GET /api/clients/:clientId e pré-preenche o form.
 * - No clique em “Salvar Cliente”, faz POST /api/clients ou PUT /api/clients/:clientId.
 */

document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('authToken');
  const estId = localStorage.getItem('currentEstablishmentId');
  const params = new URLSearchParams(window.location.search);
  const clientId = params.get('clientId');

  // Se clientId existe, entramos no modo EDIÇÃO
  if (clientId) {
    try {
      // Atenção: agora com /api/clients
      const res = await apiFetch(`${API_URL}/api/clients/${clientId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Cliente não encontrado');
      const c = await res.json();
      // Preenche form com os dados existentes
      document.getElementById('clientFullName').value = c.fullName;
      document.getElementById('clientPhone').value = c.phone;
      document.getElementById('clientEmail').value = c.email || '';
      document.getElementById('clientPoints').value = c.points;
      // Muda texto do botão para “Atualizar Cliente”
      document.getElementById('saveClientBtn').textContent = 'Atualizar Cliente';
    } catch (err) {
      console.error(err);
      alert('Falha ao carregar cliente para edição.');
    }
  }

  // Handler do clique em “Salvar Cliente”
  document.getElementById('saveClientBtn').addEventListener('click', async () => {
    const fullName = document.getElementById('clientFullName').value.trim();
    const phone    = document.getElementById('clientPhone').value.trim();
    const email    = document.getElementById('clientEmail').value.trim();
    const points   = parseInt(document.getElementById('clientPoints').value, 10) || 0;
    if (!fullName || !phone) {
      return alert('Nome e telefone são obrigatórios!');
    }

    let url, method;
    if (clientId) {
      // Atualização → PUT /api/clients/:clientId
      url = `${API_URL}/api/clients/${clientId}`;
      method = 'PUT';
    } else {
      // Novo → POST /api/clients
      url = `${API_URL}/api/clients`;
      method = 'POST';
    }

    const body = { fullName, phone, email, points, establishmentId: estId };

    try {
      const res = await apiFetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Erro ao salvar cliente');
      }
      alert(clientId ? 'Cliente atualizado!' : 'Cliente criado!');
      if (clientId) {
        // Após editar, volta para a tabela
        window.location.href = '/table.html';
      } else {
        // Se for um cliente novo, limpa o form
        ['clientFullName','clientPhone','clientEmail','clientPoints']
          .forEach(id => document.getElementById(id).value = '');
      }
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  });
});

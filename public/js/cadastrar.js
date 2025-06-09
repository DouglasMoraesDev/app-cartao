// public/js/cadastrar.js
// ------------------------------------------------------------
// Agora inclui establishmentId na query ao GET /api/clients/:id
// ------------------------------------------------------------
document.addEventListener('DOMContentLoaded', async () => {
  const token    = localStorage.getItem('authToken');
  const estId    = localStorage.getItem('currentEstablishmentId');
  const params   = new URLSearchParams(window.location.search);
  const clientId = params.get('clientId');

  if (clientId) {
    try {
      const res = await apiFetch(
        `${API_URL}/clients/${clientId}?establishmentId=${estId}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error('Cliente não encontrado');
      const c = await res.json();
      document.getElementById('clientFullName').value = c.fullName;
      document.getElementById('clientPhone').value    = c.phone;
      document.getElementById('clientEmail').value    = c.email || '';
      document.getElementById('clientPoints').value   = c.points;
      document.getElementById('saveClientBtn').textContent = 'Atualizar Cliente';
    } catch (err) {
      console.error(err);
      alert('Falha ao carregar cliente para edição.');
    }
  }

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
      url    = `${API_URL}/clients/${clientId}`;
      method = 'PUT';
    } else {
      url    = `${API_URL}/clients`;
      method = 'POST';
    }

    const body = { fullName, phone, email, points, establishmentId: estId };
    try {
      const res  = await apiFetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erro ao salvar cliente');
      alert(clientId ? 'Cliente atualizado!' : 'Cliente criado!');
      if (clientId) {
        window.location.href = '/table.html';
      } else {
        ['clientFullName','clientPhone','clientEmail','clientPoints']
          .forEach(id => document.getElementById(id).value = '');
      }
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  });
});

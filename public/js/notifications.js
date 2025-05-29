// public/js/notifications.js
/**
 * Carrega e exibe clientes com ≥10 pontos na aba Notificações
 */
async function loadNotifications() {
  const token = localStorage.getItem('authToken');
  const estId = localStorage.getItem('currentEstablishmentId');
  const res   = await apiFetch(
    `${API_URL}/clients?establishmentId=${estId}`,
    { headers:{ 'Authorization':`Bearer ${token}` } }
  );
  const clients = await res.json();

  const ul = document.getElementById('clients');
  ul.innerHTML = '';

  clients
    .filter(c => c.points >= 10)
    .forEach(c => {
      const li = document.createElement('li');
      li.style.display = 'flex';
      li.style.justifyContent = 'space-between';
      li.style.alignItems = 'center';
      li.style.padding = '0.75rem';
      li.style.borderBottom = '1px solid #ddd';
      li.innerHTML = `
        <span>${c.fullName} — ${c.points} pts</span>
        <button onclick="sendVoucher(${c.id})">Enviar Voucher</button>
      `;
      ul.appendChild(li);
    });
}

/**
 * Envia voucher via WhatsApp e zera pontos
 */
async function sendVoucher(clienteId) {
  const token = localStorage.getItem('authToken');
  try {
    const res  = await apiFetch(
      `${API_URL}/voucher/${clienteId}`,
      { headers:{ 'Authorization':`Bearer ${token}` } }
    );
    const data = await res.json();
    if (data.error) throw new Error(data.error);

    // abre WhatsApp com mensagem
    window.open(
      `https://wa.me/${data.numero}?text=${encodeURIComponent(data.mensagem)}`,
      '_blank'
    );

    // zera pontos no backend
    await apiFetch(
      `${API_URL}/voucher/reset-points/${clienteId}`,
      {
        method: 'PUT',
        headers: {
          'Authorization':`Bearer ${token}`
        }
      }
    );
    alert('Voucher enviado e pontos zerados!');
    loadNotifications();
  } catch (err) {
    console.error('Erro no sendVoucher:', err);
    alert(err.message);
  }
}

/**
 * Apenas cria o alias para dashboard.js chamar
 */
function setupNotificationsListeners() {
  // nada extra a configurar por clique está inline
}

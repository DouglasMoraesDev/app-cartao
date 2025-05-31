/**
 * notifications.js
 * - loadNotifications: busca todos os clientes,
 *   filtra os que têm ≥10 pontos, exibe em lista e adiciona botão “Enviar Voucher”
 */

async function loadNotifications() {
  const token = localStorage.getItem('authToken');
  const estId = localStorage.getItem('currentEstablishmentId');

  // 1) Busca todos os clientes deste estabelecimento
  const res = await apiFetch(`${API_URL}/clients?establishmentId=${estId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const clients = await res.json();

  // 2) Pega referência ao <ul id="clients"> e limpa o conteúdo
  const ul = document.getElementById('clients');
  ul.innerHTML = '';

  // 3) Filtra apenas quem tem ≥10 pontos
  clients
    .filter(c => c.points >= 10)
    .forEach(c => {
      // 4) Para cada cliente qualificado, cria <li> com nome e pontos
      const li = document.createElement('li');
      li.classList.add('notification-item');
      li.textContent = `${c.fullName} — ${c.points} ponto(s)`;

      // 5) Cria botão “Enviar Voucher”
      const btn = document.createElement('button');
      btn.textContent = 'Enviar Voucher';
      btn.classList.add('send-voucher-btn');

      // 6) Quando o botão for clicado:
      btn.addEventListener('click', async () => {
        try {
          // 6.1) Gera o voucher (GET /api/voucher/:clienteId)
          const voucherRes = await apiFetch(
            `${API_URL}/voucher/${c.id}`,
            { headers: { 'Authorization': `Bearer ${token}` } }
          );
          if (!voucherRes.ok) {
            const errData = await voucherRes.json();
            throw new Error(errData.error || 'Falha ao gerar voucher.');
          }
          const { numero, mensagem } = await voucherRes.json();

          // 6.2) Abre o WhatsApp Web/Mobile com o texto já preenchido
          const waLink = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
          window.open(waLink, '_blank');

          // 6.3) Após abrir o WhatsApp, reseta os pontos deste cliente (PUT /api/voucher/reset-points/:clienteId)
          const resetRes = await apiFetch(
            `${API_URL}/voucher/reset-points/${c.id}`,
            {
              method: 'PUT',
              headers: { 'Authorization': `Bearer ${token}` }
            }
          );
          if (!resetRes.ok) {
            const errData2 = await resetRes.json();
            console.warn('Não foi possível resetar pontos:', errData2.error);
          }

          // 6.4) Remove a <li> da lista para não exibir mais este cliente
          li.remove();
        } catch (err) {
          console.error(err);
          alert(err.message || 'Erro ao enviar voucher.');
        }
      });

      // 7) Insere o botão dentro do <li> e adiciona o <li> ao <ul>
      li.appendChild(btn);
      ul.appendChild(li);
    });
}

// 8) Chama loadNotifications ao carregar a página
document.addEventListener('DOMContentLoaded', loadNotifications);

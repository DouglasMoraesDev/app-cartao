// public/js/qr.js
// ------------------------------------------------------------
// Extrai establishmentId da URL, carrega dados do estabelecimento,
// preenche logo e nome, depois renderiza o QR e ajusta o link.
// ------------------------------------------------------------
document.addEventListener('DOMContentLoaded', async () => {
  // 1) Pega o ID do estabelecimento
  const params = new URLSearchParams(window.location.search);
  const estId  = params.get('establishmentId')
               || localStorage.getItem('currentEstablishmentId');
  if (!estId) {
    return alert('ID do estabelecimento não informado');
  }

  try {
    // 2) Busca dados do estabelecimento (rota pública GET /api/establishments/:id)
    const resEst = await apiFetch(`${API_URL}/establishments/${estId}`);
    if (!resEst.ok) throw new Error('Falha ao carregar dados do estabelecimento');
    const est = await resEst.json();

    // 3) Preenche logo e nome
    const logoEl = document.getElementById('est-logo');
    if (logoEl && est.logoURL) {
      let logoPath = est.logoURL;
      if (logoPath.startsWith('public/')) logoPath = logoPath.replace(/^public\//, '');
      if (!logoPath.startsWith('/')) logoPath = '/' + logoPath;
      logoEl.src = logoPath;
    }
    const nameEl = document.getElementById('est-name');
    if (nameEl) {
      nameEl.textContent = est.name || 'Consultar Pontos';
    }

    // 4) Renderiza o QR Code no <img id="qrCodeImg">
    if (typeof renderQRCode === 'function') {
      renderQRCode(estId, document.getElementById('qrCodeImg'));
    } else {
      document.getElementById('qrCodeImg').src =
        `${API_URL.replace(/\/$/, '')}/voucher/qr?establishmentId=${estId}`;
    }

    // 5) Ajusta o link para o cartão de pontos
    const link = document.getElementById('pointsLink');
    if (link) link.href = `/points.html?establishmentId=${estId}`;

  } catch (err) {
    console.error(err);
    alert(err.message);
  }
});

// public/js/theme.js
/**
 * Aplica tema recebendo um objeto { "primary-color": "#...", ... }
 */
function applyTheme(vars) {
  Object.entries(vars).forEach(([key, value]) => {
    document.documentElement.style.setProperty(`--${key}`, value);
  });
}

/**
 * Monta e exibe o QR Code para a aba de consulta
 * @param {string|number} estId 
 */
function renderQRCode(estId) {
  const qrImg = document.getElementById('qrCodeImg');
  const link  = document.getElementById('pointsLink');
  qrImg.src  = `${API_URL}/establishments/${estId}/qrcode`;
  link.href = `${BASE_URL}/points.html?establishmentId=${estId}`;
}

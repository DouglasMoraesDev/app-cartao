/**
 * theme.js
 * - applyTheme: aplica variáveis CSS dinâmicas
 * - renderQRCode: monta QR + link (usado em qr.js)
 */

function applyTheme(vars) {
  Object.entries(vars).forEach(([key, val])=>{
    document.documentElement.style.setProperty(`--${key}`, val);
  });
}

// montamos a URL do QR + link
function renderQRCode(estId) {
  const qrImg = document.getElementById('qrCodeImg');
  const link  = document.getElementById('pointsLink');
  if (qrImg) qrImg.src = `${API_URL}/establishments/${estId}/qrcode`;
  if (link)  link.href = `${BASE_URL}/points.html?establishmentId=${estId}`;
}

// opcional: ao inicializar qualquer página, você pode buscar tema do estabelecimento:
// fetch(`${API_URL}/establishments/${estId}`)... e chamar applyTheme(...)

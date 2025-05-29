// public/js/qr.js
/**
 * Se a página tiver elemento de QR Code, renderiza com ID da URL
 */
document.addEventListener('DOMContentLoaded', () => {
  const qrImg = document.getElementById('qrCodeImg');
  if (!qrImg) return;

  // obtém establishmentId de query string
  const params = new URLSearchParams(window.location.search);
  const estId  = params.get('establishmentId');
  if (!estId) return;

  renderQRCode(estId);
});

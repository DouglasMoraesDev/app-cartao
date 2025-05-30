/**
 * qr.js
 * Extrai establishmentId da query string e monta QR + link
 */
document.addEventListener('DOMContentLoaded', () => {
  // obtém estId da URL (?establishmentId=123)
  const params = new URLSearchParams(window.location.search);
  const estId = params.get('establishmentId') || localStorage.getItem('currentEstablishmentId');
  if (!estId) return alert('ID do estabelecimento não informado');
  renderQRCode(estId);
});

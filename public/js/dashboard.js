// public/js/dashboard.js
/**
 * dashboard.js
 * Inicialização comum para todas as páginas de dashboard:
 *  - Verifica token e establishmentId em localStorage e redireciona para login.html se ausentes
 *  - Busca dados do estabelecimento (tema, logo, assinatura)
 *  - Aplica tema dinâmico via applyTheme
 *  - Preenche nome do usuário e logo
 *  - Verifica expiração de assinatura (28 dias) e redireciona para payment.html
 */

document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('authToken');
  const estId = localStorage.getItem('currentEstablishmentId');

  // Se não tiver token ou establishmentId, redireciona para login
  if (!token || !estId) {
    return window.location.href = '/login.html';
  }

  try {
    // 1) Busca dados do estabelecimento
    const resEst = await apiFetch(
      `${API_URL}/establishments/${estId}`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    const establishment = await resEst.json();

    // 2) Verifica validade de assinatura (28 dias)
    if (establishment.lastPaymentDate) {
      const lastPay = new Date(establishment.lastPaymentDate).getTime();
      if (Date.now() - lastPay > 28 * 24 * 60 * 60 * 1000) {
        alert('Assinatura expirou. Renove para continuar.');
        return window.location.href = '/payment.html';
      }
    }

    // 3) Aplica tema dinâmico
    applyTheme({
      'primary-color':    establishment.primaryColor,
      'secondary-color':  establishment.secondaryColor,
      'background-color': establishment.backgroundColor,
      'container-bg':     establishment.containerBg,
      'text-color':       establishment.textColor,
      'header-bg':        establishment.headerBg,
      'footer-bg':        establishment.footerBg,
      'footer-text':      establishment.footerText,
      'input-border':     establishment.inputBorder,
      'button-bg':        establishment.buttonBg,
      'button-text':      establishment.buttonText,
      'section-margin':   establishment.sectionMargin
    });

    // 4) Atualiza meta theme-color
    const meta = document.getElementById('theme-color-meta');
    if (meta) {
      meta.setAttribute('content', establishment.backgroundColor);
    }

    // 5) Preenche nome do usuário
    const nameEl = document.getElementById('user-name');
    if (nameEl) {
      nameEl.textContent = localStorage.getItem('userName') || '';
    }

    // 6) Normaliza e define logo
    const logoEl = document.getElementById('logo');
    if (logoEl) {
      let logoPath = establishment.logoURL || '';
      if (logoPath.startsWith('public/')) {
        logoPath = logoPath.replace(/^public\//, '');
      }
      if (logoPath && !logoPath.startsWith('/')) {
        logoPath = '/' + logoPath;
      }
      logoEl.src = logoPath || '/logo/icon.png';
    }
  } catch (error) {
    console.error('Erro na inicialização:', error);
  }
});

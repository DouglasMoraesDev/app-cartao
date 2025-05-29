// public/js/dashboard.js
/**
 * Inicialização geral após window.onload:
 *  - Verifica token/estId em localStorage
 *  - Busca dados do estabelecimento (tema, assinatura, logo)
 *  - Chama applyTheme, renderQRCode e exibe dashboard
 *  - Configura abas e listeners de cada módulo
 */
window.onload = async () => {
  const token = localStorage.getItem('authToken');
  const estId = localStorage.getItem('currentEstablishmentId');

  if (!token || !estId) {
    // mostra apenas login
    document.getElementById('loginDiv').style.display  = 'flex';
    document.getElementById('dashboard').style.display = 'none';
    return;
  }

  try {
    // 1) busca dados do estabelecimento
    const resEst = await apiFetch(
      `${API_URL}/establishments/${estId}`,
      { headers:{ 'Authorization': `Bearer ${token}` } }
    );
    const establishment = await resEst.json();

    // 2) verifica validade de assinatura (28 dias)
    const lastPay = establishment.lastPaymentDate
      ? new Date(establishment.lastPaymentDate).getTime()
      : 0;
    if (!lastPay || Date.now() - lastPay > 28 * 24*60*60*1000) {
      alert('Assinatura expirou. Renove para continuar.');
      return window.location.href = '/payment.html';
    }

    // 3) aplica tema e logo
applyTheme({
  "primary-color":   establishment.primaryColor,
  "secondary-color": establishment.secondaryColor,
  "background-color": establishment.backgroundColor,
  "container-bg":    establishment.containerBg,
  "text-color":      establishment.textColor,
  "header-bg":       establishment.headerBg,
  "footer-bg":       establishment.footerBg,
  "footer-text":     establishment.footerText,
  "input-border":    establishment.inputBorder,
  "button-bg":       establishment.buttonBg,
  "button-text":     establishment.buttonText,
  "section-margin":  establishment.sectionMargin
});

// Normalizar o caminho do logo
const logoEl = document.getElementById('logo');
if (establishment.logoURL) {
  let logoPath = establishment.logoURL;

// Se começar com "public/", removemos essa parte:
  if (logoPath.startsWith('public/')) {
    logoPath = logoPath.replace(/^public\//, '');
  }

// Se não começar com "/", adicionamos a barra para virar caminho absoluto:
  if (!logoPath.startsWith('/')) {
    logoPath = '/' + logoPath;
  }

// Por fim, atribuímos o src ao <img>:
  logoEl.src = logoPath;
} else {
  // Se não houver logoURL, use um ícone padrão (opcional):
  logoEl.src = '/logo/icon.png';
}
document.getElementById('theme-color-meta').setAttribute('content', establishment.backgroundColor);


    // 4) exibe dashboard
    document.getElementById('loginDiv').style.display  = 'none';
    document.getElementById('dashboard').style.display = 'flex';
    document.getElementById('user-name').textContent   = localStorage.getItem('userName');
    renderQRCode(estId);

    // 5) configura abas
    setupTabListeners();

    // 6) carrega dados iniciais de clientes e demais módulos
    await loadClients();
    setupClientsListeners();
    setupAddPointsListeners();
    setupNotificationsListeners();
  } catch (error) {
    console.error('Erro na inicialização:', error);
  }
};

/**
 * Configura troca de abas (mostra/oculta seções)
 */
function setupTabListeners() {
  const tabs = document.querySelectorAll('.tab-menu button');
  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      // ativa botão
      tabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      // oculta todas as seções
      document.querySelectorAll('.tab-content').forEach(sec => sec.style.display = 'none');
      // exibe a selecionada
      document.getElementById(btn.dataset.section).style.display = 'block';

      // ações pós-troca
      if (btn.dataset.section === 'tab-table') renderClientsList();
      if (btn.dataset.section === 'tab-notify') loadNotifications();
    });
  });
}

/**
 * Logout simples: limpa tudo e mostra login
 */
document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.clear();
  document.getElementById('dashboard').style.display = 'none';
  document.getElementById('loginDiv').style.display  = 'flex';
  alert('Logout realizado.');
});

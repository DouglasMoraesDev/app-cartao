// public/js/dashboard.js
// ------------------------------------------------------------
// Inicialização do dashboard:
// - Verifica token e ID do estabelecimento
// - Busca dados do estabelecimento
// - Aplica tema e logo
// - Preenche nome do usuário
// - Carrega métricas (clientes, pontos, etc.)
// ------------------------------------------------------------
document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('authToken')
  const estId = localStorage.getItem('currentEstablishmentId')

  if (!token || !estId) {
    return window.location.href = '/login.html'
  }

  try {
    // 1) Buscar dados do estabelecimento
    const resEst = await apiFetch(
      `${API_URL}/establishments/${estId}`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    )
    if (!resEst.ok) throw new Error('Falha ao buscar estabelecimento')
    const establishment = await resEst.json()

    // 2) Verificar validade da assinatura (28 dias)
    if (establishment.lastPaymentDate) {
      const lastPay = new Date(establishment.lastPaymentDate).getTime()
      const isExpired = Date.now() - lastPay > 28 * 24 * 60 * 60 * 1000
      if (isExpired) {
        alert('Assinatura expirada. Renove para continuar.')
        return window.location.href = '/payment.html'
      }
    }

    // 3) Aplicar tema
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
    })

    // 4) Atualizar <meta name="theme-color">
    const meta = document.getElementById('theme-color-meta')
    if (meta) meta.setAttribute('content', establishment.backgroundColor)

    // 5) Preencher nome do usuário
    const nameEl = document.getElementById('user-name')
    if (nameEl) nameEl.textContent = localStorage.getItem('userName') || ''

    // 6) Definir logo corretamente
    const logoEl = document.getElementById('logo')
    if (logoEl) {
      let logoPath = establishment.logoURL || ''
      if (logoPath.startsWith('public/')) logoPath = logoPath.replace(/^public\//, '')
      if (logoPath && !logoPath.startsWith('/')) logoPath = '/' + logoPath
      logoEl.src = logoPath || '/logo/icon.png'
    }

    // 7) Carregar métricas de clientes
    try {
      const resClients = await apiFetch(
        `${API_URL}/clients?establishmentId=${estId}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      )
      const clients = await resClients.json()

      const elTotal = document.getElementById('total-clients')
      if (elTotal) elTotal.textContent = clients.length

      const el10pts = document.getElementById('clients-10pts')
      if (el10pts) el10pts.textContent = clients.filter(c => c.points >= 10).length

      const elToday = document.getElementById('added-today')
      if (elToday) {
        const today = new Date().toISOString().slice(0, 10)
        const addedToday = clients.filter(c =>
          c.lastPointDate && c.lastPointDate.startsWith(today)
        ).length
        elToday.textContent = addedToday
      }

    } catch (err) {
      console.error('Erro ao carregar métricas:', err)
    }

  } catch (error) {
    console.error('Erro na inicialização:', error)
    alert('Erro ao carregar o painel. Tente novamente.')
  }
})

/**
 * points.js
 * Controle da página points.html:
 *  - Extrai establishmentId da URL
 *  - Busca dados do estabelecimento (tema, logo, nome)
 *  - Aplica tema (variáveis CSS) e exibe header
 *  - Quando o formulário é enviado, busca pontos e mostra o “cartão virtual”
 */

(async () => {
  // 1. Pega o establishmentId da URL (query string: ?establishmentId=123)
  const params = new URLSearchParams(window.location.search);
  const estId = params.get('establishmentId');
  if (!estId) {
    alert('ID do estabelecimento não informado na URL');
    return;
  }

  // 2. Busca dados de tema + logo do estabelecimento
  let est;
  try {
    const res = await fetch(`${API_URL}/establishments/${estId}`);
    if (!res.ok) throw new Error('Estabelecimento não encontrado');
    est = await res.json();
  } catch (err) {
    console.error(err);
    alert('Não foi possível carregar os dados do estabelecimento.');
    return;
  }

  // 3. Atualiza meta theme-color (barra de status Android/Chrome)
  const meta = document.getElementById('theme-color-meta');
  if (meta && est.backgroundColor) {
    meta.setAttribute('content', est.backgroundColor);
  }

  // 4. Mapeia e aplica variáveis CSS (usar applyTheme do theme.js)
  //    Se theme.js não estiver carregado, definimos diretamente as CSS vars:
  if (typeof applyTheme === 'function') {
    applyTheme({
      'primary-color': est.primaryColor,
      'secondary-color': est.secondaryColor,
      'background-color': est.backgroundColor,
      'container-bg': est.containerBg,
      'text-color': est.textColor,
      'header-bg': est.headerBg,
      'footer-bg': est.footerBg,
      'footer-text': est.footerText,
      'input-border': est.inputBorder,
      'button-bg': est.buttonBg,
      'button-text': est.buttonText,
      'box-shadow': est.boxShadow || '0 4px 6px rgba(0,0,0,0.1)',
      'transition-speed': est.transitionSpeed || '0.3s'
    });
  } else {
    // fallback manual (caso theme.js não tenha sido importado)
    const root = document.documentElement;
    const varsMap = {
      '--primary-color':     est.primaryColor,
      '--secondary-color':   est.secondaryColor,
      '--background-color':  est.backgroundColor,
      '--container-bg':      est.containerBg,
      '--text-color':        est.textColor,
      '--header-bg':         est.headerBg,
      '--footer-bg':         est.footerBg,
      '--footer-text':       est.footerText,
      '--input-border':      est.inputBorder,
      '--button-bg':         est.buttonBg,
      '--button-text':       est.buttonText,
      '--box-shadow':        est.boxShadow || '0 4px 6px rgba(0,0,0,0.1)',
      '--transition-speed':  est.transitionSpeed || '0.3s'
    };
    Object.entries(varsMap).forEach(([k, v]) => {
      if (v) root.style.setProperty(k, v);
    });
  }

  // 5. Insere logo e nome no header
  const logoEl = document.getElementById('est-logo');
  if (est.logoURL) {
    // Normaliza caminho removendo "./"
    const path = est.logoURL.replace(/^\.\//, '');
    logoEl.src = `${window.location.origin}/${path}`;
    logoEl.style.display = 'block';
  }
  document.getElementById('est-name').textContent = est.name;

  // 6. Configura o formulário de consulta de pontos
  document.getElementById('pointsForm').addEventListener('submit', async e => {
    e.preventDefault();
    const phone = document.getElementById('phone').value.trim();
    const out = document.getElementById('cardContainer');

    // Limpa qualquer conteúdo anterior
    out.innerHTML = '';

    if (!phone) {
      return alert('Por favor, digite um telefone válido.');
    }

    try {
      // 7. Chama o endpoint que verifica pontos (POST /api/clients/check-points)
      const r2 = await fetch('/api/clients/check-points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, establishmentId: estId })
      });
      const data2 = await r2.json();
      if (!r2.ok) throw new Error(data2.message || 'Erro ao buscar pontos.');

      const pontos = data2.points;

      // 8. Cria o “cartão virtual” com base na quantidade de pontos
      const card = document.createElement('div');
      card.classList.add('virtual-card');

      // Título dentro do cartão
      const title = document.createElement('h2');
      title.textContent = `Você tem ${pontos} ponto(s)`;
      card.appendChild(title);

      if (pontos > 0) {
        // Grid de “selos” (stamps) — cada selo é o logo do estabelecimento
        const grid = document.createElement('div');
        grid.classList.add('stamps');

        // Se houver muitos pontos, limitar a, por exemplo, 20 selos por linha
        // Aqui só vamos exibir até 10 selos (você pode ajustar conforme quiser)
        const maxSelos = pontos;
        for (let i = 0; i < maxSelos; i++) {
          const img = document.createElement('img');
          // Se est.logoURL existir, usar o mesmo; senão, usar ico fallback
          img.src = logoEl.src || '/logo/icon.png';
          img.alt = 'Selo';
          grid.appendChild(img);
        }

        card.appendChild(grid);
      } else {
        // Se não tiver pontos, mostra mensagem específica
        const noPts = document.createElement('p');
        noPts.classList.add('no-points');
        noPts.textContent = 'Você ainda não tem pontos.';
        card.appendChild(noPts);
      }

      // Insere o cartão no container
      out.appendChild(card);
    } catch (err) {
      console.error(err);
      out.innerHTML = `<p style="color:red;">${err.message || 'Erro ao buscar pontos.'}</p>`;
    }
  });
})();

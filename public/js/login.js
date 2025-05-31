/**
 * login.js
 * -----------
 * 1) faz POST /api/login
 * 2) salva token + establishmentId + userName em localStorage
 * 3) salva em localStorage.themeVars o JSON de cores (já em kebab-case)
 * 4) redireciona para /cadastrar.html
 */
document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById('loginBtn');
  loginBtn.addEventListener('click', async () => {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    if (!username || !password) {
      return alert('Preencha todos os campos!');
    }

    try {
      // 1) POST /api/login
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        // Se login falhar, mostra mensagem e sai
        return alert(data.message || 'Usuário ou senha inválidos');
      }

      // 2) Salva token + establishmentId + userName
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('currentEstablishmentId', data.user.establishmentId);
      localStorage.setItem('userName', data.user.fullName || data.user.username);

      // 3) Salva o tema completo, que já chegou do backend em kebab-case
      //    Exemplo de data.theme (recebido do servidor):
      //    {
      //      "primary-color":   "#FF0000",
      //      "secondary-color": "#00FF00",
      //      "background-color":"#FFFFFF",
      //      "text-color":      "#000000",
      //      "header-bg":       "#333333",
      //      "footer-bg":       "#222222",
      //      "button-bg":       "#007BFF",
      //      "button-text":     "#FFFFFF",
      //      "input-border":    "#CCCCCC",
      //      "section-margin":  "16px",
      //      "logoURL":         "https://.../logo.png"
      //    }
      if (data.theme) {
        localStorage.setItem('themeVars', JSON.stringify(data.theme));
      }

      // 4) Redireciona para a página principal do painel (ex.: cadastrar.html)
      window.location.href = '/dashboard.html';
    } catch (err) {
      console.error(err);
      alert('Erro no login. Tente novamente.');
    }
  });
});

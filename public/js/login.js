/**
 * login.js
 * Controla o fluxo de login:
 *  - faz POST para /api/login
 *  - salva token + dados em localStorage
 *  - redireciona para a página de cadastro (ou dashboard)
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
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) {
        return alert(data.message || 'Usuário ou senha inválidos');
      }
      // salva sessão
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('currentEstablishmentId', data.user.establishmentId);
      localStorage.setItem('userName', data.user.fullName || data.user.username);
      // vai para a página de cadastro
      window.location.href = '/cadastrar.html';
    } catch (err) {
      console.error(err);
      alert('Erro no login. Tente novamente.');
    }
  });
});

// public/js/login.js

document.addEventListener('DOMContentLoaded', () => {
  const loginBtn   = document.getElementById('loginBtn');
  const loginDiv   = document.getElementById('loginDiv');
  const dashboard  = document.getElementById('dashboard');

  // Se não houver dashboard nesta página, apenas oculta o guard
  // (login.html não tem dashboard, então a segunda parte não roda)
  if (!loginBtn || !loginDiv) return;

  loginBtn.addEventListener('click', async () => {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!username || !password) {
      return alert('Preencha todos os campos!');
    }

    try {
      const res  = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 402 && confirm(`${data.message}\nDeseja renovar?`)) {
          return window.location.href = '/payment.html';
        }
        return alert(data.message || 'Usuário ou senha inválidos');
      }

      // Armazena dados para uso geral
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('currentEstablishmentId', data.user.establishmentId);
      localStorage.setItem('userName', data.user.fullName || data.user.username);

      // Redireciona para a dashboard
      window.location.href = '/index.html';
    } catch (err) {
      console.error('Erro no login:', err);
      alert('Erro no login. Tente novamente.');
    }
  });
});

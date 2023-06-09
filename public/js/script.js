// Código JavaScript para interações na página

// Lógica para exibir o conteúdo do painel de controle apenas para usuários autenticados
const panelContainer = document.getElementById('panel-container');
const loginForm = document.getElementById('login-form');

if (panelContainer) {
  const username = localStorage.getItem('username');
  const password = localStorage.getItem('password');

  if (username && password) {
    // Se o usuário estiver autenticado, exiba o conteúdo do painel de controle
    panelContainer.style.display = 'block';
    loginForm.style.display = 'none';
  } else {
    // Se o usuário não estiver autenticado, redirecione para a página de login
    window.location.href = '/login';
  }
}

// Lógica para armazenar o nome de usuário e senha no armazenamento local
if (loginForm) {
  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    const username = usernameInput.value;
    const password = passwordInput.value;

    // Salva o nome de usuário e a senha no armazenamento local
    localStorage.setItem('username', username);
    localStorage.setItem('password', password);

    // Redireciona para o painel de controle
    window.location.href = '/panel';
  });
}

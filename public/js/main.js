const backdrop = document.querySelector('.backdrop');
const sideDrawer = document.querySelector('.mobile-nav');
const menuToggle = document.querySelector('#side-menu-toggle');
const passwordToggleBtn = document.getElementById('toggle-password');
const password = document.getElementById('password');

function backdropClickHandler() {
  backdrop.style.display = 'none';
  sideDrawer.classList.remove('open');
}

function menuToggleClickHandler() {
  backdrop.style.display = 'block';
  sideDrawer.classList.add('open');
}

function togglePassword() {
  if (password.type === 'password') password.type = 'text';
  else password.type = 'password';
}

backdrop.addEventListener('click', backdropClickHandler);
menuToggle.addEventListener('click', menuToggleClickHandler);
passwordToggleBtn.addEventListener('click', togglePassword);

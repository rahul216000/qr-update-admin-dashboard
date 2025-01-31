document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.form-container');
    const registerToggle = document.getElementById('register-toggle');
    const loginToggle = document.getElementById('login-toggle');

    registerToggle.addEventListener('click', (e) => {
        e.preventDefault();
        container.classList.add('active');
    });

    loginToggle.addEventListener('click', (e) => {
        e.preventDefault();
        container.classList.remove('active');
    });
});
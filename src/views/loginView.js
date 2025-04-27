import Api from '../models/api.js';

export default class LoginView {
  constructor(rootElement) {
    this.rootElement = rootElement;
  }

  async render() {
    this.rootElement.innerHTML = `
      <section class="max-w-md mx-auto p-4">
        <h1 class="text-2xl font-bold mb-4">Login</h1>
        <form id="login-form" class="space-y-4" aria-label="Login form">
          <div>
            <label for="email" class="block mb-1 font-semibold">Email</label>
            <input type="email" id="email" name="email" required class="w-full border border-gray-300 rounded px-3 py-2" />
          </div>
          <div>
            <label for="password" class="block mb-1 font-semibold">Password</label>
            <input type="password" id="password" name="password" required minlength="8" class="w-full border border-gray-300 rounded px-3 py-2" />
          </div>
          <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Login</button>
        </form>
        <p class="mt-4">Don't have an account? <a href="#register" class="text-blue-600 underline">Register here</a></p>
        <div id="login-message" class="mt-4 text-red-600" role="alert" aria-live="assertive"></div>
      </section>
    `;

    const form = this.rootElement.querySelector('#login-form');
    const message = this.rootElement.querySelector('#login-message');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      message.textContent = '';
      const email = form.email.value.trim();
      const password = form.password.value;

      try {
        const result = await Api.login(email, password);
        if (!result.error) {
          localStorage.setItem('token', result.loginResult.token);
          localStorage.setItem('userName', result.loginResult.name);
          window.location.hash = '';
        } else {
          message.textContent = result.message || 'Login failed';
        }
      } catch (error) {
        message.textContent = 'Error connecting to server';
      }
    });
  }
}

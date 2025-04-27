import Api from '../models/api.js';

export default class RegisterView {
  constructor(rootElement) {
    this.rootElement = rootElement;
  }

  async render() {
    this.rootElement.innerHTML = `
      <section class="max-w-md mx-auto p-4">
        <h1 class="text-2xl font-bold mb-4">Register</h1>
        <form id="register-form" class="space-y-4" aria-label="Register form">
          <div>
            <label for="name" class="block mb-1 font-semibold">Name</label>
            <input type="text" id="name" name="name" required class="w-full border border-gray-300 rounded px-3 py-2" />
          </div>
          <div>
            <label for="email" class="block mb-1 font-semibold">Email</label>
            <input type="email" id="email" name="email" required class="w-full border border-gray-300 rounded px-3 py-2" />
          </div>
          <div>
            <label for="password" class="block mb-1 font-semibold">Password</label>
            <input type="password" id="password" name="password" required minlength="8" class="w-full border border-gray-300 rounded px-3 py-2" />
          </div>
          <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">Register</button>
        </form>
        <p class="mt-4">Already have an account? <a href="#login" class="text-blue-600 underline">Login here</a></p>
        <div id="register-message" class="mt-4 text-red-600" role="alert" aria-live="assertive"></div>
      </section>
    `;

    const form = this.rootElement.querySelector('#register-form');
    const message = this.rootElement.querySelector('#register-message');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      message.textContent = '';
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const password = form.password.value;

      try {
        const result = await Api.register(name, email, password);
        if (!result.error) {
          message.classList.remove('text-red-600');
          message.classList.add('text-green-600');
          message.textContent = 'User created successfully. Please login.';
          setTimeout(() => {
            window.location.hash = '#login';
          }, 2000);
        } else {
          message.classList.remove('text-green-600');
          message.classList.add('text-red-600');
          message.textContent = result.message || 'Registration failed';
        }
      } catch (error) {
        message.classList.remove('text-green-600');
        message.classList.add('text-red-600');
        message.textContent = 'Error connecting to server';
      }
    });
  }
}

MiniStore — Mini E‑Commerce Demo
=================================

This is a small, vanilla JavaScript demo app demonstrating modern ES6+ features:
- async/await (Fetch API)
- Spread operator (...)
- Arrow functions
- ES Modules (import / export)
- LocalStorage for favorites

It uses the FakeStoreAPI (https://fakestoreapi.com/) as a dummy backend to fetch products.


How to run
----------

1. Start a local server:

   Using Python 3:
   ```bash
   python -m http.server 8000
   ```

   If you don't have Python, alternative servers:

   Using Node (if installed):
   ```bash
   # install http-server once: npm install -g http-server
   http-server -p 8000
   ```

2. Open the app in your browser:

   http://localhost:8000



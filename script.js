(function () {
  const THEME_KEY = "simplesite-theme";
  const SESSION_KEY = "simplesite-session";
  const DEMO_EMAIL = "demo@simplesite.test";
  const DEMO_PASSWORD = "demo123";

  const root = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = themeToggle?.querySelector(".theme-icon");
  const yearEl = document.getElementById("year");
  const surpriseBtn = document.getElementById("surpriseBtn");
  const surpriseMessage = document.getElementById("surpriseMessage");
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");
  const openLoginBtn = document.getElementById("openLoginBtn");
  const userMenu = document.getElementById("userMenu");
  const userGreeting = document.getElementById("userGreeting");
  const logoutBtn = document.getElementById("logoutBtn");
  const loginDialog = document.getElementById("loginDialog");
  const loginForm = document.getElementById("loginForm");
  const loginCancel = document.getElementById("loginCancel");
  const loginError = document.getElementById("loginError");

  const quotes = [
    "Small steps, solid markup.",
    "CSS is design; JS is the sparkle.",
    "Ship the simple version first.",
    "One page can still feel complete.",
  ];

  function getStoredTheme() {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch {
      return null;
    }
  }

  function setStoredTheme(value) {
    try {
      localStorage.setItem(THEME_KEY, value);
    } catch {
      /* ignore */
    }
  }

  function applyTheme(theme) {
    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
      if (themeIcon) themeIcon.textContent = "☀️";
      if (themeToggle) themeToggle.setAttribute("aria-label", "Switch to light mode");
    } else {
      root.removeAttribute("data-theme");
      if (themeIcon) themeIcon.textContent = "🌙";
      if (themeToggle) themeToggle.setAttribute("aria-label", "Switch to dark mode");
    }
  }

  function initTheme() {
    const stored = getStoredTheme();
    if (stored === "dark" || stored === "light") {
      applyTheme(stored);
      return;
    }
    const prefersDark =
      window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(prefersDark ? "dark" : "light");
  }

  function toggleTheme() {
    const isDark = root.getAttribute("data-theme") === "dark";
    const next = isDark ? "light" : "dark";
    applyTheme(next);
    setStoredTheme(next);
  }

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  function getSession() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (data && typeof data.email === "string" && data.email.length > 0) {
        return { email: data.email };
      }
    } catch {
      /* ignore */
    }
    return null;
  }

  function setSession(email) {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify({ email }));
    } catch {
      /* ignore */
    }
  }

  function clearSession() {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch {
      /* ignore */
    }
  }

  function setLoginError(message) {
    if (!loginError) return;
    if (message) {
      loginError.textContent = message;
      loginError.hidden = false;
    } else {
      loginError.textContent = "";
      loginError.hidden = true;
    }
  }

  function updateAuthUI() {
    const session = getSession();
    if (session) {
      if (openLoginBtn) openLoginBtn.hidden = true;
      if (userMenu) userMenu.hidden = false;
      if (userGreeting) {
        userGreeting.textContent = "Signed in as " + session.email;
      }
    } else {
      if (openLoginBtn) openLoginBtn.hidden = false;
      if (userMenu) userMenu.hidden = true;
      if (userGreeting) userGreeting.textContent = "";
    }
  }

  function openLoginModal() {
    if (!loginDialog || typeof loginDialog.showModal !== "function") {
      window.alert("Your browser doesn’t support the login dialog. Try a current browser.");
      return;
    }
    setLoginError("");
    loginForm?.reset();
    loginDialog.showModal();
  }

  function closeLoginModal() {
    loginDialog?.close();
  }

  initTheme();
  updateAuthUI();

  themeToggle?.addEventListener("click", toggleTheme);

  surpriseBtn?.addEventListener("click", function () {
    const line = quotes[Math.floor(Math.random() * quotes.length)];
    if (surpriseMessage) {
      surpriseMessage.textContent = line;
      surpriseMessage.hidden = false;
    }
  });

  contactForm?.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!formStatus) return;

    const name = contactForm.querySelector("#name");
    const email = contactForm.querySelector("#email");
    const message = contactForm.querySelector("#message");

    if (!name?.value.trim() || !email?.value.trim() || !message?.value.trim()) {
      formStatus.textContent = "Please fill in all fields.";
      return;
    }

    formStatus.textContent = "Thanks — this demo doesn’t send mail, but your inputs look good.";
    contactForm.reset();
  });

  openLoginBtn?.addEventListener("click", openLoginModal);

  loginCancel?.addEventListener("click", function () {
    closeLoginModal();
  });

  loginDialog?.addEventListener("close", function () {
    setLoginError("");
    loginForm?.reset();
  });

  loginForm?.addEventListener("submit", function (e) {
    e.preventDefault();
    const emailInput = document.getElementById("loginEmail");
    const passwordInput = document.getElementById("loginPassword");
    const email = emailInput?.value.trim().toLowerCase() || "";
    const password = passwordInput?.value || "";

    if (!email || !password) {
      setLoginError("Please enter email and password.");
      return;
    }

    if (email !== DEMO_EMAIL.toLowerCase() || password !== DEMO_PASSWORD) {
      setLoginError("Unknown email or password. Use the demo account shown above.");
      return;
    }

    setSession(DEMO_EMAIL);
    setLoginError("");
    updateAuthUI();
    closeLoginModal();
  });

  logoutBtn?.addEventListener("click", function () {
    clearSession();
    updateAuthUI();
  });
})();

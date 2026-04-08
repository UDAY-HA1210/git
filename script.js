(function () {
  const THEME_KEY = "simplesite-theme";
  const AUTH_KEY = "simplesite-auth";
  const root = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = themeToggle?.querySelector(".theme-icon");
  const yearEl = document.getElementById("year");
  const surpriseBtn = document.getElementById("surpriseBtn");
  const surpriseMessage = document.getElementById("surpriseMessage");
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");
  const userPill = document.getElementById("userPill");
  const userName = document.getElementById("userName");
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const loginModal = document.getElementById("loginModal");
  const loginForm = document.getElementById("loginForm");
  const loginCloseBtn = document.getElementById("loginCloseBtn");
  const loginStatus = document.getElementById("loginStatus");

  const quotes = [
    "Small steps, solid markup.",
    "CSS is design; JS is the sparkle.",
    "Ship the simple version first.",
    "One page can still feel complete.",
  ];

  function safeJsonParse(value) {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }

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

  function getAuth() {
    try {
      const raw = localStorage.getItem(AUTH_KEY);
      if (!raw) return null;
      const data = safeJsonParse(raw);
      if (!data || typeof data !== "object") return null;
      if (typeof data.email !== "string" || typeof data.name !== "string") return null;
      return { email: data.email, name: data.name };
    } catch {
      return null;
    }
  }

  function setAuth(auth) {
    try {
      localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
    } catch {
      /* ignore */
    }
  }

  function clearAuth() {
    try {
      localStorage.removeItem(AUTH_KEY);
    } catch {
      /* ignore */
    }
  }

  function syncAuthUI() {
    const auth = getAuth();
    const isLoggedIn = !!auth;

    if (userPill) userPill.hidden = !isLoggedIn;
    if (loginBtn) loginBtn.hidden = isLoggedIn;
    if (logoutBtn) logoutBtn.hidden = !isLoggedIn;
    if (userName && auth) userName.textContent = auth.name;
  }

  function openLogin() {
    if (!loginModal) return;
    if (loginStatus) loginStatus.textContent = "";
    if (typeof loginModal.showModal === "function") {
      loginModal.showModal();
    } else {
      // Fallback: if <dialog> unsupported, just jump to contact.
      window.location.hash = "#contact";
    }
  }

  function closeLogin() {
    if (!loginModal) return;
    if (typeof loginModal.close === "function") loginModal.close();
  }

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  initTheme();
  syncAuthUI();

  themeToggle?.addEventListener("click", toggleTheme);

  loginBtn?.addEventListener("click", openLogin);
  loginCloseBtn?.addEventListener("click", closeLogin);

  logoutBtn?.addEventListener("click", function () {
    clearAuth();
    syncAuthUI();
  });

  loginModal?.addEventListener("click", function (e) {
    // Click outside the card closes the dialog.
    if (e.target === loginModal) closeLogin();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeLogin();
  });

  surpriseBtn?.addEventListener("click", function () {
    const line = quotes[Math.floor(Math.random() * quotes.length)];
    if (surpriseMessage) {
      surpriseMessage.textContent = line;
      surpriseMessage.hidden = false;
    }
  });

  loginForm?.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!loginForm || !loginStatus) return;

    const emailEl = loginForm.querySelector("#loginEmail");
    const passwordEl = loginForm.querySelector("#loginPassword");
    const email = emailEl?.value?.trim() ?? "";
    const password = passwordEl?.value?.trim() ?? "";

    if (!email || !password) {
      loginStatus.textContent = "Please enter email and password.";
      return;
    }

    if (!email.includes("@")) {
      loginStatus.textContent = "Please enter a valid email.";
      return;
    }

    // Demo login: derive a display name from email.
    const name = email.split("@")[0].replace(/[._-]+/g, " ").trim() || "User";
    setAuth({ email, name: name.slice(0, 40) });
    syncAuthUI();
    closeLogin();
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

    const auth = getAuth();
    formStatus.textContent = auth
      ? `Thanks, ${auth.name} — this demo doesn’t send mail, but your inputs look good.`
      : "Thanks — this demo doesn’t send mail, but your inputs look good.";
    contactForm.reset();
  });
})();

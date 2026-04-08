(function () {
  const THEME_KEY = "simplesite-theme";
  const root = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = themeToggle?.querySelector(".theme-icon");
  const yearEl = document.getElementById("year");
  const surpriseBtn = document.getElementById("surpriseBtn");
  const surpriseMessage = document.getElementById("surpriseMessage");
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");

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

  initTheme();

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
})();

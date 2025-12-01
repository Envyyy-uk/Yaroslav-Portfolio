// Typing effect
;(function typingEffect() {
  const el = document.querySelector(".dynamic-text")
  if (!el) return
  const phrases = ["Frontend Developer", "London, UK", "Building the Future", "React & JS Enthusiast"]
  let pi = 0,
    ci = 0,
    deleting = false
  function tick() {
    const cur = phrases[pi]
    if (deleting) {
      ci = Math.max(0, ci - 1)
      el.textContent = cur.substring(0, ci)
    } else {
      ci = Math.min(cur.length, ci + 1)
      el.textContent = cur.substring(0, ci)
    }
    let delay = deleting ? 40 : 100
    if (!deleting && ci === cur.length) {
      deleting = true
      delay = 1600
    }
    if (deleting && ci === 0) {
      deleting = false
      pi = (pi + 1) % phrases.length
      delay = 500
    }
    setTimeout(tick, delay)
  }
  tick()
})()

// Theme toggle + header logic
;(function headerAndTheme() {
  const backBtn = document.getElementById("back-btn")
  const themeBtn = document.getElementById("theme-toggle")
  const video = document.getElementById("bg-video")
  const overlay = document.getElementById("bg-overlay")
  const KEY = "jarvis_theme_v1"

  // hide back on hub
  try {
    const path = location.pathname || ""
    const file = path.split("/").pop()
    const isHub = !file || file === "" || file.toLowerCase() === "index.html"
    if (isHub && backBtn) backBtn.style.display = "none"
  } catch (e) {}

  // Sync initial theme from <html> into <body>
  ;(function syncInitialTheme() {
    try {
      if (document.documentElement.classList.contains("light-theme")) document.body.classList.add("light-theme")
      else document.body.classList.remove("light-theme")
    } catch (e) {}
  })()

  function applyTheme(theme) {
    try {
      if (theme === "light") {
        document.documentElement.classList.add("light-theme")
        document.body.classList.add("light-theme")
        if (themeBtn) themeBtn.setAttribute("aria-pressed", "true")
      } else {
        document.documentElement.classList.remove("light-theme")
        document.body.classList.remove("light-theme")
        if (themeBtn) themeBtn.setAttribute("aria-pressed", "false")
      }
      // Update visible icons by CSS (theme-sun/theme-moon are controlled by CSS)
    } catch (e) {}
  }

  // Initialize from storage (if present)
  const saved = localStorage.getItem(KEY)
  if (saved) applyTheme(saved)

  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      const isLight = document.body.classList.contains("light-theme")
      const next = isLight ? "dark" : "light"
      applyTheme(next)
      try {
        localStorage.setItem(KEY, next)
      } catch (e) {}
      // brief inline transition boost
      document.documentElement.style.transition = "background-color 0.36s ease, color 0.36s ease"
      setTimeout(() => (document.documentElement.style.transition = ""), 500)
    })
  }

  // Video fallback: hide if blocked or errors
  if (video) {
    video.addEventListener("error", () => {
      video.style.display = "none"
      if (overlay) overlay.style.opacity = "0.95"
    })
    video.play().catch(() => {
      video.style.display = "none"
      if (overlay) overlay.style.opacity = "0.95"
    })
  }

  // prevent clicks on disabled project buttons
  document.querySelectorAll(".project-card.disabled .launch-btn").forEach(btn => {
    btn.addEventListener("click", e => e.preventDefault())
  })
})()
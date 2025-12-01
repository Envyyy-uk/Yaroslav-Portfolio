// --- 1. TRANSLATIONS ---
const translations = {
  en: {
    app_title: "Yaroslav Global",
    btn_login: "Enter Dashboard",
    label_income: "Total Income",
    label_balance: "Global Remaining",
    tab_main: "Main",
    title_breakdown: "Main Expenses",
    col_name: "Name",
    col_plan: "Plan",
    col_local: "Spent",
    col_rem: "Rem.",
    modal_settings: "Settings",
    set_currency: "Currency",
    set_tab_name: "Second Tab Name",
    set_lang: "Language",
    btn_logout: "Log Out",
  },
  ua: {
    app_title: "Yaroslav Global",
    btn_login: "Увійти",
    label_income: "Дохід",
    label_balance: "Загальний Залишок",
    tab_main: "Головна",
    title_breakdown: "Основні витрати",
    col_name: "Назва",
    col_plan: "План",
    col_local: "Витрата",
    col_rem: "Зал.",
    modal_settings: "Налаштування",
    set_currency: "Валюта",
    set_tab_name: "Назва вкладки",
    set_lang: "Мова",
    btn_logout: "Вийти",
  },
  pl: {
    app_title: "Yaroslav",
    btn_login: "Zaloguj",
    label_income: "Dochód",
    label_balance: "Pozostało",
    tab_main: "Główne",
    title_breakdown: "Wydatki",
    col_name: "Nazwa",
    col_plan: "Plan",
    col_local: "Wydano",
    col_rem: "Reszta",
    modal_settings: "Ustawienia",
    set_currency: "Waluta",
    set_tab_name: "Nazwa zakładki",
    set_lang: "Język",
    btn_logout: "Wyloguj",
  },
  de: {
    app_title: "Yaroslav",
    btn_login: "Eintreten",
    label_income: "Einkommen",
    label_balance: "Restbetrag",
    tab_main: "Haupt",
    title_breakdown: "Ausgaben",
    col_name: "Name",
    col_plan: "Plan",
    col_local: "Ausgabe",
    col_rem: "Rest",
    modal_settings: "Einstellungen",
    set_currency: "Währung",
    set_tab_name: "Tab-Name",
    set_lang: "Sprache",
    btn_logout: "Abmelden",
  },
  fr: {
    app_title: "Yaroslav",
    btn_login: "Entrer",
    label_income: "Revenu",
    label_balance: "Reste Global",
    tab_main: "Principal",
    title_breakdown: "Dépenses",
    col_name: "Nom",
    col_plan: "Plan",
    col_local: "Dépensé",
    col_rem: "Reste",
    modal_settings: "Paramètres",
    set_currency: "Devise",
    set_tab_name: "Nom de l'onglet",
    set_lang: "Langue",
    btn_logout: "Déconnexion",
  },
  es: {
    app_title: "Yaroslav",
    btn_login: "Entrar",
    label_income: "Ingresos",
    label_balance: "Restante Global",
    tab_main: "Principal",
    title_breakdown: "Gastos",
    col_name: "Nombre",
    col_plan: "Plan",
    col_local: "Gasto",
    col_rem: "Resto",
    modal_settings: "Ajustes",
    set_currency: "Moneda",
    set_tab_name: "Nombre pestaña",
    set_lang: "Idioma",
    btn_logout: "Cerrar Sesión",
  },
}

const Storage = {
  get: (key, def) => {
    const d = localStorage.getItem("jarvis_v4_" + key)
    return d ? JSON.parse(d) : def
  },
  set: (key, val) => localStorage.setItem("jarvis_v4_" + key, JSON.stringify(val)),
}

const Auth = {
  isLoggedIn: () => Storage.get("auth", false),
  login: () => {
    Storage.set("auth", true)
    location.reload()
  },
  logout: () => {
    Storage.set("auth", false)
    location.reload()
  },
}

const App = {
  data: {
    income: 0,
    mainItems: [],
    secondItems: [],
  },

  init() {
    const loginView = document.getElementById("view-login")
    const dashView = document.getElementById("view-dashboard")

    if (Auth.isLoggedIn()) {
      loginView.style.display = "none"
      dashView.style.display = "flex"
      this.startApp()
    } else {
      loginView.style.display = "flex"
      dashView.style.display = "none"
      const form = document.getElementById("login-form")
      if (form)
        form.onsubmit = e => {
          e.preventDefault()
          Auth.login()
        }
    }
  },

  startApp() {
    const saved = Storage.get("budget_data", { income: 0, mainItems: [], secondItems: [] })
    this.data = saved

    if (!Array.isArray(this.data.mainItems)) this.data.mainItems = []
    if (!Array.isArray(this.data.secondItems)) this.data.secondItems = []

    this.initSettings()
    this.initTabs()
    this.renderAll()

    const incInp = document.getElementById("income-input")
    if (incInp) {
      incInp.value = this.data.income || ""
      incInp.oninput = e => {
        this.data.income = parseFloat(e.target.value) || 0
        this.save()
      }
    }

    document.getElementById("btn-logout").onclick = () => Auth.logout()
  },

  initSettings() {
    const modal = document.getElementById("modal-settings")
    const settings = Storage.get("settings", { currency: "$", customTabName: "Ukraine", lang: "en" })

    const els = {
      curr: document.getElementById("set-currency"),
      tab: document.getElementById("set-tab-name"),
      lang: document.getElementById("set-lang"),
    }

    if (els.curr) els.curr.value = settings.currency
    if (els.tab) els.tab.value = settings.customTabName
    if (els.lang) els.lang.value = settings.lang

    document.getElementById("btn-open-settings").onclick = () => modal.classList.remove("hidden")
    document.getElementById("btn-close-settings").onclick = () => modal.classList.add("hidden")

    const update = (k, v) => {
      settings[k] = v
      Storage.set("settings", settings)
      this.applyUI(settings)
    }

    els.curr.onchange = e => update("currency", e.target.value)
    els.tab.oninput = e => update("customTabName", e.target.value)
    els.lang.onchange = e => update("lang", e.target.value)

    this.applyUI(settings)
  },

  applyUI(settings) {
    document.querySelectorAll(".currency-symbol").forEach(el => (el.textContent = settings.currency))

    const tabLabel = document.getElementById("custom-tab-label")
    const titleLabel = document.querySelector(".custom-name-display")

    if (tabLabel) tabLabel.textContent = settings.customTabName
    if (titleLabel) titleLabel.textContent = settings.customTabName

    const t = translations[settings.lang]
    if (t) {
      document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.dataset.i18n
        if (t[key]) {
          if (el.tagName === "INPUT") el.placeholder = t[key]
          else el.innerText = t[key]
        }
      })
    }
    this.renderAll()
  },

  initTabs() {
    const btns = document.querySelectorAll(".tab-btn")
    btns.forEach(btn => {
      btn.onclick = () => {
        btns.forEach(b => b.classList.remove("active"))
        btn.classList.add("active")

        document.querySelectorAll(".tab-content").forEach(c => {
          c.classList.remove("active")
          c.style.display = "none"
        })

        const target = document.getElementById(btn.dataset.tab)
        if (target) {
          target.classList.add("active")
          target.style.display = "block"
        }
      }
    })
  },

  // --- CRUD ---
  addMainRow() {
    this.data.mainItems.push({ id: Date.now(), name: "", plan: 0, spent: 0 })
    this.save()
    this.renderTable("tbody-main", this.data.mainItems, "mainItems")
  },

  addSecondRow() {
    this.data.secondItems.push({ id: Date.now(), name: "", plan: 0, spent: 0 })
    this.save()
    this.renderTable("tbody-second", this.data.secondItems, "secondItems")
  },

  deleteRow(arrName, id) {
    this.data[arrName] = this.data[arrName].filter(i => i.id !== id)
    this.save()
    this.renderAll()
  },

  updateItem(arrName, id, key, val, inputEl) {
    const item = this.data[arrName].find(i => i.id === id)
    if (item) {
      if (key === "name") {
        item.name = val
      } else {
        try {
          const clean = val
            .toString()
            .replace(",", ".")
            .replace(/[^0-9+\-*/.]/g, "")
          if (clean) {
            let calcVal = parseFloat(new Function("return " + clean)()) || 0
            // FIX: Check for Infinity (division by zero)
            if (!isFinite(calcVal)) calcVal = 0
            item[key] = calcVal
          } else {
            item[key] = 0
          }
        } catch {
          item[key] = 0
        }
      }

      Storage.set("budget_data", this.data)

      const row = inputEl.closest("tr")
      const bal = item.plan - item.spent
      const cell = row.querySelector(".balance-cell")
      if (cell) {
        cell.textContent = bal.toFixed(2)
        cell.className = `balance-cell ${bal < 0 ? "text-danger" : "text-success"}`
      }
      this.updateHeaderTotals()
    }
  },

  formatInput(inputEl, arrName, id, key) {
    const item = this.data[arrName].find(i => i.id === id)
    if (item && key !== "name") {
      if (item[key] === 0) {
        inputEl.value = ""
      } else {
        inputEl.value = item[key]
      }
    }
  },

  save() {
    Storage.set("budget_data", this.data)
    this.updateHeaderTotals()
  },

  renderAll() {
    this.renderTable("tbody-main", this.data.mainItems, "mainItems")
    this.renderTable("tbody-second", this.data.secondItems, "secondItems")
    this.updateHeaderTotals()
  },

  renderTable(tbodyId, items, arrName) {
    const tbody = document.getElementById(tbodyId)
    if (!tbody) return

    tbody.innerHTML = items
      .map(item => {
        const bal = item.plan - item.spent
        const planVal = item.plan === 0 ? "" : item.plan
        const spentVal = item.spent === 0 ? "" : item.spent

        return `
            <tr>
                <td>
                    <input value="${item.name}" 
                           oninput="App.updateItem('${arrName}', ${item.id}, 'name', this.value, this)" 
                           placeholder="Name">
                </td>
                <td>
                    <input type="tel" value="${planVal}" 
                           oninput="App.updateItem('${arrName}', ${item.id}, 'plan', this.value, this)" 
                           onblur="App.formatInput(this, '${arrName}', ${item.id}, 'plan')"
                           placeholder="0">
                </td>
                <td>
                    <input type="tel" value="${spentVal}" 
                           oninput="App.updateItem('${arrName}', ${item.id}, 'spent', this.value, this)" 
                           onblur="App.formatInput(this, '${arrName}', ${item.id}, 'spent')"
                           placeholder="0">
                </td>
                <td class="balance-cell ${bal < 0 ? "text-danger" : "text-success"}">${bal.toFixed(2)}</td>
                <td>
                    <button class="delete-btn" onclick="App.deleteRow('${arrName}', ${item.id})">&times;</button>
                </td>
            </tr>`
      })
      .join("")
  },

  updateHeaderTotals() {
    let totalMain = 0
    this.data.mainItems.forEach(i => (totalMain += i.spent))

    let totalSecond = 0
    this.data.secondItems.forEach(i => (totalSecond += i.spent))

    const grandTotalSpent = totalMain + totalSecond
    const remaining = this.data.income - grandTotalSpent

    const curr = Storage.get("settings", { currency: "$" }).currency

    // 1. Global Rem
    const balEl = document.getElementById("global-balance")
    if (balEl) {
      balEl.textContent = curr + " " + remaining.toFixed(2)
      balEl.className = `balance-text ${remaining < 0 ? "text-danger" : "text-success"}`
    }

    // 2. Main Tab Total
    const mainTotalEl = document.getElementById("main-total-display")
    if (mainTotalEl) mainTotalEl.textContent = totalMain.toFixed(2)

    // 3. Second Tab Total
    const secTotalEl = document.getElementById("custom-total-display")
    if (secTotalEl) secTotalEl.textContent = totalSecond.toFixed(2)
  },
}

window.App = App
window.addEventListener("DOMContentLoaded", () => App.init())
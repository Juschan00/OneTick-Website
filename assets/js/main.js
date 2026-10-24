/* ==========================================================================
   OneTick website: shared behaviour
   ========================================================================== */

// Site settings. Change these in one place.
const ONETICK = {
  // Paste the App Store link here once it is live, e.g. "https://apps.apple.com/app/id0000000000".
  // While empty, every "Download" button opens a short "coming soon" dialog instead.
  appStoreUrl: "",
  supportEmail: "support@onetick.com",
  instagramUrl: "https://www.instagram.com/onetick.app/",
};

document.documentElement.classList.add("js");
window.addEventListener("load", () => {
  setTimeout(() => document.documentElement.classList.add("smooth"), 100);
});

const ICONS = {
  check: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
  star: '<svg class="icon" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" aria-hidden="true"><path d="m12 2.8 2.85 5.78 6.38.93-4.62 4.5 1.09 6.35L12 17.36l-5.7 3 1.09-6.35-4.62-4.5 6.38-.93z"/></svg>',
  close: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
};

/* ---------- Header: scrolled state + mobile menu ---------- */

(function header() {
  const header = document.querySelector("[data-header]");
  if (!header) return;
  const toggle = header.querySelector(".nav-toggle");
  const menu = document.getElementById("mobile-menu");

  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const setOpen = (open) => {
    header.toggleAttribute("data-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.classList.toggle("menu-open", open);
  };

  toggle.addEventListener("click", () => setOpen(!header.hasAttribute("data-open")));
  menu.addEventListener("click", (e) => {
    if (e.target.closest("a")) setOpen(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && header.hasAttribute("data-open")) {
      setOpen(false);
      toggle.focus();
    }
  });
  window.matchMedia("(min-width: 900px)").addEventListener("change", (e) => {
    if (e.matches) setOpen(false);
  });
})();

/* ---------- Footer year ---------- */

document.querySelectorAll("[data-year]").forEach((el) => {
  el.textContent = new Date().getFullYear();
});

/* ---------- App Store links ---------- */

(function appStore() {
  const links = document.querySelectorAll("[data-appstore]");
  if (!links.length) return;

  if (ONETICK.appStoreUrl) {
    links.forEach((a) => {
      a.href = ONETICK.appStoreUrl;
      a.target = "_blank";
      a.rel = "noopener";
    });
    return;
  }

  let dialog;
  links.forEach((a) =>
    a.addEventListener("click", (e) => {
      e.preventDefault();
      dialog ??= buildLaunchDialog();
      dialog.showModal();
    })
  );
})();

function buildLaunchDialog() {
  const subject = encodeURIComponent("Notify me when OneTick is on the App Store");
  const body = encodeURIComponent("Hi OneTick team,\n\nPlease let me know as soon as OneTick is available to download.\n\nThanks!");
  const logo = document.querySelector(".brand img")?.getAttribute("src") || "assets/img/logo-180.png";

  const dialog = document.createElement("dialog");
  dialog.className = "launch-dialog";
  dialog.setAttribute("aria-labelledby", "launch-title");
  dialog.innerHTML = `
    <div class="launch-inner">
      <button class="dialog-close" type="button" data-close aria-label="Close">${ICONS.close}</button>
      <img src="${logo}" alt="" width="64" height="64">
      <h2 id="launch-title">Coming to the App Store</h2>
      <p>The download link will be here very soon. Want a heads-up? Send us a quick note and we'll email you the moment OneTick is ready.</p>
      <div class="btn-row">
        <a class="btn btn-primary" href="mailto:${ONETICK.supportEmail}?subject=${subject}&body=${body}">Email me when it's live</a>
        <a class="btn btn-ghost" href="${ONETICK.instagramUrl}" target="_blank" rel="noopener">Follow @onetick.app</a>
      </div>
    </div>`;
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog || e.target.closest("[data-close]")) dialog.close();
  });
  document.body.append(dialog);
  return dialog;
}

/* ---------- Scroll reveal ---------- */

(function reveal() {
  const items = document.querySelectorAll(".reveal");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!("IntersectionObserver" in window) || reduce) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.1 }
  );
  items.forEach((el) => io.observe(el));
})();

/* ---------- Screenshot gallery arrows ---------- */

(function gallery() {
  document.querySelectorAll("[data-gallery]").forEach((track) => {
    const nav = document.querySelector(`[data-gallery-nav="${track.dataset.gallery}"]`);
    if (!nav) return;
    const [prev, next] = nav.querySelectorAll("button");
    const step = () => (track.querySelector("figure")?.offsetWidth ?? 240) + 32;
    const update = () => {
      prev.disabled = track.scrollLeft <= 4;
      next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    };
    prev.addEventListener("click", () => track.scrollBy({ left: -step(), behavior: "smooth" }));
    next.addEventListener("click", () => track.scrollBy({ left: step(), behavior: "smooth" }));
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  });
})();

/* ---------- Live to-do demo (home page) ---------- */

(function demo() {
  const root = document.querySelector("[data-demo]");
  if (!root) return;

  const listEl = root.querySelector("[data-demo-list]");
  const countEl = root.querySelector("[data-demo-count]");
  const search = root.querySelector("[data-demo-search]");
  const sortBtn = root.querySelector("[data-demo-sort]");
  const hideBtn = root.querySelector("[data-demo-hide]");
  const form = root.querySelector("[data-demo-form]");

  const PRIORITIES = ["urgent", "high", "medium", "low", "none"];
  const LABELS = { urgent: "Urgent", high: "High", medium: "Medium", low: "Low", none: "None" };
  const SORTS = [
    ["due", "Due Date"],
    ["priority", "Importance"],
    ["title", "Title"],
  ];

  // Dates are relative to today so the demo never looks stale.
  const at = (days, h, m) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    d.setHours(h, m, 0, 0);
    return d;
  };

  let tasks = [
    { title: "Refine portfolio", due: at(-1, 15, 30), priority: "urgent", done: true },
    { title: "Develop CAD model", due: at(1, 16, 0), priority: "high", done: false },
    { title: "Write documentation", due: at(4, 18, 0), priority: "medium", done: false },
    { title: "Create PowerPoint presentation", due: at(8, 9, 0), priority: "low", done: false },
  ].map((t, i) => ({ id: i + 1, ...t }));
  let nextId = tasks.length + 1;
  let sort = 0;
  let hideDone = false;
  let popId = null;

  const fmtDate = new Intl.DateTimeFormat(undefined, { weekday: "short", month: "short", day: "numeric" });
  const fmtTime = new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" });

  const compare = {
    due: (a, b) => (a.due ?? Infinity) - (b.due ?? Infinity) || a.id - b.id,
    priority: (a, b) => PRIORITIES.indexOf(a.priority) - PRIORITIES.indexOf(b.priority) || a.id - b.id,
    title: (a, b) => a.title.localeCompare(b.title),
  };

  function taskEl(t) {
    const li = document.createElement("li");
    li.className = "task" + (t.done ? " is-done" : "") + (t.id === popId ? " pop" : "");
    li.dataset.id = t.id;
    li.dataset.priority = t.priority;

    const tick = document.createElement("button");
    tick.type = "button";
    tick.className = "tick";
    tick.dataset.action = "tick";
    tick.setAttribute("aria-pressed", String(t.done));
    tick.setAttribute("aria-label", `Mark "${t.title}" as ${t.done ? "not done" : "done"}`);
    tick.innerHTML = ICONS.check;

    const body = document.createElement("div");
    body.className = "task-body";
    const title = document.createElement("p");
    title.className = "task-title";
    title.textContent = t.title;
    const meta = document.createElement("p");
    meta.className = "task-meta";
    meta.textContent = t.due ? `${fmtDate.format(t.due)} • ${fmtTime.format(t.due)}` : "No Due Date";
    body.append(title, meta);

    const star = document.createElement("button");
    star.type = "button";
    star.className = "task-star";
    star.dataset.action = "priority";
    star.title = `Priority: ${LABELS[t.priority]}`;
    star.setAttribute("aria-label", `Priority ${LABELS[t.priority]}. Change priority`);
    star.innerHTML = ICONS.star;

    li.append(tick, body, star);
    return li;
  }

  function render() {
    const q = search.value.trim().toLowerCase();
    const visible = tasks
      .filter((t) => !q || t.title.toLowerCase().includes(q))
      .filter((t) => !(hideDone && t.done))
      .sort(compare[SORTS[sort][0]]);

    if (visible.length) {
      listEl.replaceChildren(...visible.map(taskEl));
    } else {
      const empty = document.createElement("li");
      empty.className = "task-empty";
      empty.textContent = q ? `No tasks match "${search.value.trim()}"` : "All done. Enjoy your clear mind ✨";
      listEl.replaceChildren(empty);
    }

    countEl.textContent = `${tasks.filter((t) => t.done).length}/${tasks.length}`;
    sortBtn.querySelector("span").textContent = `Sorted by ${SORTS[sort][1]}`;
    hideBtn.setAttribute("aria-pressed", String(hideDone));
    hideBtn.querySelector("span").textContent = hideDone ? "Show completed" : "Hide completed";
    popId = null;
  }

  listEl.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    const id = Number(btn.closest("li").dataset.id);
    const t = tasks.find((x) => x.id === id);
    const action = btn.dataset.action;
    if (action === "tick") {
      t.done = !t.done;
      if (t.done) popId = id;
    } else {
      t.priority = PRIORITIES[(PRIORITIES.indexOf(t.priority) + 1) % PRIORITIES.length];
    }
    render();
    listEl.querySelector(`li[data-id="${id}"] [data-action="${action}"]`)?.focus();
  });

  search.addEventListener("input", render);
  sortBtn.addEventListener("click", () => {
    sort = (sort + 1) % SORTS.length;
    render();
  });
  hideBtn.addEventListener("click", () => {
    hideDone = !hideDone;
    render();
  });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = form.querySelector("input");
    const title = input.value.trim().slice(0, 80);
    if (!title) return;
    tasks.push({ id: nextId++, title, due: null, priority: "none", done: false });
    input.value = "";
    search.value = "";
    render();
  });

  render();
})();

/* ---------- Contact form (support page) ---------- */
// No server needed: the form composes an email in the visitor's mail app.

(function contactForm() {
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;
  const status = form.querySelector("[data-form-status]");

  const topic = new URLSearchParams(location.search).get("topic");
  if (topic && [...form.elements.topic.options].some((o) => o.value === topic)) {
    form.elements.topic.value = topic;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const device = data.get("device")?.trim();
    const subject = `[OneTick] ${data.get("topic")}: ${data.get("name")}`;
    const body = [
      data.get("message"),
      "",
      "—",
      `Name: ${data.get("name")}`,
      `Email: ${data.get("email")}`,
      device ? `Device / iOS: ${device}` : null,
    ]
      .filter((line) => line !== null)
      .join("\n");

    window.location.href = `mailto:${ONETICK.supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    status.hidden = false;
    status.querySelector("[data-form-status-text]").innerHTML =
      `Your email app should open with the message ready to send. If nothing happened, email us directly at <a href="mailto:${ONETICK.supportEmail}">${ONETICK.supportEmail}</a>.`;
  });
})();

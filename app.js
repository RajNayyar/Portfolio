/* JSON-driven portfolio (v3). */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

const ICONS = {
  locationPin: () => `
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 22s7-4.35 7-12a7 7 0 1 0-14 0c0 7.65 7 12 7 12Z" stroke="currentColor" stroke-width="1.8"/>
      <circle cx="12" cy="10" r="2.2" stroke="currentColor" stroke-width="1.8"/>
    </svg>`,
  link: () => `
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M10 14a5 5 0 0 1 0-7l1-1a5 5 0 0 1 7 7l-1 1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      <path d="M14 10a5 5 0 0 1 0 7l-1 1a5 5 0 0 1-7-7l1-1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    </svg>`,
  phone: () => `
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6.5 3.5h3l1.1 4.2-2 1.4c1.5 3 3.9 5.4 6.9 6.9l1.4-2 4.2 1.1v3c0 1-0.8 1.8-1.8 1.8C10 20.9 3.1 14 3.1 4.9c0-1 .8-1.8 1.8-1.8Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
    </svg>`,
  email: () => `
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 6h16v12H4V6Z" stroke="currentColor" stroke-width="1.8" />
      <path d="m4 7 8 6 8-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
  github: () => `
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2.6c-5.25 0-9.5 4.1-9.5 9.2 0 4.1 2.7 7.6 6.5 8.8.5.1.7-.2.7-.5v-1.9c-2.6.6-3.2-1-3.2-1-.4-1-1-1.3-1-1.3-.9-.5.1-.5.1-.5 1 .1 1.5 1 1.5 1 .9 1.4 2.3 1 2.8.8.1-.6.3-1 .6-1.2-2.1-.2-4.4-1-4.4-4.5 0-1 .4-1.8 1-2.4-.1-.2-.4-1.1.1-2.3 0 0 .8-.2 2.6.9.8-.2 1.6-.3 2.4-.3s1.6.1 2.4.3c1.8-1.1 2.6-.9 2.6-.9.5 1.2.2 2.1.1 2.3.6.6 1 1.4 1 2.4 0 3.5-2.3 4.3-4.4 4.5.3.3.7.9.7 1.8v2.6c0 .3.2.6.7.5 3.8-1.2 6.5-4.7 6.5-8.8 0-5.1-4.3-9.2-9.5-9.2Z" fill="currentColor" opacity="0.9"/>
    </svg>`,
  linkedin: () => `
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6.5 9.5V19" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      <path d="M6.5 6.6a1.35 1.35 0 1 0 0-2.7 1.35 1.35 0 0 0 0 2.7Z" fill="currentColor" opacity="0.9"/>
      <path d="M10 19v-5.4c0-2 1.2-3.2 3-3.2 1.7 0 2.7 1.2 2.7 3.2V19" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      <path d="M10 9.5V19" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    </svg>`,
  instagram: () => `
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 3.8h10A3.2 3.2 0 0 1 20.2 7v10A3.2 3.2 0 0 1 17 20.2H7A3.2 3.2 0 0 1 3.8 17V7A3.2 3.2 0 0 1 7 3.8Z" stroke="currentColor" stroke-width="1.8"/>
      <path d="M12 16.2a4.2 4.2 0 1 0 0-8.4 4.2 4.2 0 0 0 0 8.4Z" stroke="currentColor" stroke-width="1.8"/>
      <circle cx="17.3" cy="6.7" r="1" fill="currentColor" opacity="0.9"/>
    </svg>`,
  globe: () => `
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/>
      <path d="M3.5 12h17" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      <path d="M12 3c2.7 2.6 4.2 5.8 4.2 9s-1.5 6.4-4.2 9c-2.7-2.6-4.2-5.8-4.2-9S9.3 5.6 12 3Z" stroke="currentColor" stroke-width="1.8"/>
    </svg>`
};

function safeText(s){ return (s ?? "").toString(); }
function el(tag, cls, html){
  const n = document.createElement(tag);
  if(cls) n.className = cls;
  if(html !== undefined) n.innerHTML = html;
  return n;
}

function ratingDots(value, max=5){
  const wrap = el("div", "rating");
  const v = Math.max(0, Math.min(max, Number(value) || 0));
  for(let i=1;i<=max;i++){
    const d = el("span", "dot" + (i<=v ? " dot--on": ""));
    wrap.appendChild(d);
  }
  return wrap;
}

/* Theme toggle (dark/light) with localStorage + prefers-color-scheme */
function setupTheme(){
  const root = document.documentElement;
  const btn = document.getElementById("themeToggle");
  const label = document.getElementById("themeToggleLabel");

  const stored = localStorage.getItem("theme");
  const prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
  const initial = stored || (prefersLight ? "light" : "dark");
  root.setAttribute("data-theme", initial);

  const setLabel = () => {
    const t = root.getAttribute("data-theme") || "dark";
    if(label) label.textContent = t === "light" ? "Light" : "Dark";
  };
  setLabel();

  if(btn){
    btn.addEventListener("click", () => {
      const current = root.getAttribute("data-theme") || "dark";
      const next = current === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
      setLabel();
    });
  }
}

function osmEmbedUrl(lat, lon, zoom=11){
  const z = Math.max(2, Math.min(18, Number(zoom) || 11));
  const span = Math.max(0.02, 0.25 / z);
  const left = lon - span, right = lon + span;
  const top = lat + span, bottom = lat - span;

  const params = new URLSearchParams({
    bbox: `${left},${bottom},${right},${top}`,
    layer: "mapnik",
    marker: `${lat},${lon}`
  });

  return `https://www.openstreetmap.org/export/embed.html?${params.toString()}`;
}

function buildTimeline(items){
  const host = $("#workTimeline");
  host.innerHTML = "";

  items.forEach((it, idx) => {
    const row = el("div", "tRow" + (idx % 2 === 1 ? " is-even" : ""));
    const left = el("div", "tCol tCol--text");
    const mid = el("div", "tMid");
    const right = el("div", "tCol tCol--map");

    const pin = el("div", "tPin", ICONS.locationPin());
    mid.appendChild(pin);

    // Text card
    const card = el("div", "tCard");
    const header = el("div", "tHeader");
    const brand = el("div", "tBrand");

    const logoWrap = el("div", "tLogo");
    const logo = document.createElement("img");
    logo.alt = safeText(it.company || "Company");
    logo.loading = "lazy";
    logo.src = safeText(it.companyLogo || "");
    logo.onerror = () => { logo.style.opacity = "0.25"; };
    logoWrap.appendChild(logo);

    const titleWrap = el("div", "");
    titleWrap.appendChild(el("div", "tMeta", `${safeText(it.period)} • ${safeText(it.location)}`));
    titleWrap.appendChild(el("h3", "tRole", safeText(it.role)));

    brand.appendChild(logoWrap);
    brand.appendChild(titleWrap);

    header.appendChild(brand);
    card.appendChild(header);

    card.appendChild(el("p", "tCompany", `${safeText(it.company)} • ${safeText(it.team || "")}`.replace(/\s•\s$/,"")));

    const ul = el("ul", "tBullets");
    (it.achievements || []).forEach(a => ul.appendChild(el("li", "", safeText(a))));
    card.appendChild(ul);

    // Map block
    const mapFrame = el("div", "mapFrame");
    const mapInner = el("div", "mapInner");

    if(it.map && typeof it.map.lat === "number" && typeof it.map.lon === "number"){
      const iframe = document.createElement("iframe");
      iframe.loading = "lazy";
      iframe.referrerPolicy = "no-referrer-when-downgrade";
      iframe.setAttribute("title", `Map — ${safeText(it.location)}`);
      iframe.src = osmEmbedUrl(it.map.lat, it.map.lon, it.map.zoom || 11);

      const caption = el("div", "mapCaption");
      caption.appendChild(el("span","", safeText(it.map.caption || it.location)));

      const open = document.createElement("a");
      open.href = `https://www.openstreetmap.org/?mlat=${it.map.lat}&mlon=${it.map.lon}#map=${it.map.zoom || 11}/${it.map.lat}/${it.map.lon}`;
      open.target = "_blank";
      open.rel = "noopener";
      open.className = "pill";
      open.innerHTML = `${ICONS.link()}<span>Open map</span>`;
      caption.appendChild(open);

      mapInner.appendChild(iframe);
      mapInner.appendChild(caption);
    }else{
      const placeholder = el("div", "mapCaption", "Add <code>map.lat</code> and <code>map.lon</code> in content.json to enable a map.");
      mapInner.appendChild(placeholder);
    }

    mapFrame.appendChild(mapInner);

    left.appendChild(card);
    right.appendChild(mapFrame);

    row.appendChild(left);
    row.appendChild(mid);
    row.appendChild(right);

    host.appendChild(row);
  });
}

function buildSkills(groups){
  const host = $("#skillsGrid");
  host.innerHTML = "";
  groups.forEach((g) => {
    const box = el("div", "skillGroup");
    box.appendChild(el("h3", "skillGroup__title", safeText(g.title)));
    (g.items || []).forEach((s) => {
      const row = el("div", "skillRow");
      row.appendChild(el("div", "skillName", safeText(s.name)));
      row.appendChild(ratingDots(s.rating, g.maxRating || 5));
      box.appendChild(row);
    });
    host.appendChild(box);
  });
}

function buildProjects(items){
  const host = $("#projectsGrid");
  host.innerHTML = "";
  items.forEach((p) => {
    const card = el("article", "card");
    const imgWrap = el("div", "card__img");
    const img = document.createElement("img");
    img.alt = safeText(p.title);
    img.loading = "lazy";
    img.src = safeText(p.image || "");
    imgWrap.appendChild(img);

    const body = el("div", "card__body");
    body.appendChild(el("h3", "card__title", safeText(p.title)));
    if(p.tagline) body.appendChild(el("p", "card__subtitle", safeText(p.tagline)));
    body.appendChild(el("p", "card__desc", safeText(p.description)));

    const links = el("div", "card__links");
    (p.links || []).forEach((l) => {
      const a = el("a", "pill");
      a.href = safeText(l.url);
      a.target = "_blank";
      a.rel = "noopener";
      a.innerHTML = `${ICONS.link()}<span>${safeText(l.label)}</span>`;
      links.appendChild(a);
    });
    if((p.links || []).length) body.appendChild(links);

    card.appendChild(imgWrap);
    card.appendChild(body);
    host.appendChild(card);
  });
}

function buildEducation(items){
  const host = $("#educationGrid");
  host.innerHTML = "";
  items.forEach((e) => {
    const row = el("div", "eduItem");
    const logo = el("div", "eduLogo");
    const img = document.createElement("img");
    img.alt = safeText(e.org);
    img.loading = "lazy";
    img.src = safeText(e.logo || "");
    logo.appendChild(img);

    const content = el("div", "");
    content.appendChild(el("h3", "eduTitle", safeText(e.title)));
    content.appendChild(el("p", "eduMeta", `${safeText(e.org)} • ${safeText(e.year)}`));
    if(e.description) content.appendChild(el("p", "eduDesc", safeText(e.description)));

    row.appendChild(logo);
    row.appendChild(content);
    host.appendChild(row);
  });
}

function iconFor(type){
  switch(type){
    case "phone": return ICONS.phone();
    case "email": return ICONS.email();
    case "github": return ICONS.github();
    case "linkedin": return ICONS.linkedin();
    case "instagram": return ICONS.instagram();
    case "website": return ICONS.globe();
    default: return ICONS.link();
  }
}

function buildContact(details){
  const host = $("#contactCards");
  host.innerHTML = "";
  details.forEach((d) => {
    const card = el("div", "contactCard");
    const icon = el("div", "contactIcon", iconFor(d.type));
    const content = el("div", "");
    content.appendChild(el("p", "contactLabel", safeText(d.label)));
    const value = el("p", "contactValue");
    if(d.url){
      const a = document.createElement("a");
      a.href = safeText(d.url);
      a.target = d.url.startsWith("mailto:") || d.url.startsWith("tel:") ? "_self" : "_blank";
      if(a.target === "_blank") a.rel = "noopener";
      a.textContent = safeText(d.value);
      value.appendChild(a);
    }else{
      value.textContent = safeText(d.value);
    }
    content.appendChild(value);
    card.appendChild(icon);
    card.appendChild(content);
    host.appendChild(card);
  });
}

function buildQuickLinks(links){
  const host = $("#heroQuickLinks");
  host.innerHTML = "";
  (links || []).forEach((l) => {
    const a = el("a", "pill");
    a.href = safeText(l.url);
    a.target = l.url.startsWith("mailto:") || l.url.startsWith("tel:") ? "_self" : "_blank";
    if(a.target === "_blank") a.rel = "noopener";
    a.innerHTML = `${iconFor(l.type)}<span>${safeText(l.label)}</span>`;
    host.appendChild(a);
  });
}

function setupContactForm(toEmail){
  const form = $("#contactForm");
  const hint = $("#contactHint");
  hint.textContent = `Tip: this opens a draft email to ${toEmail}.`;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("#fromName").value.trim();
    const fromEmail = $("#fromEmail").value.trim();
    const msg = $("#message").value.trim();

    const subject = encodeURIComponent(`Portfolio inquiry${name ? " — " + name : ""}`);
    const bodyLines = [
      msg || "(Write your message here)",
      "",
      "—",
      name ? `Name: ${name}` : null,
      fromEmail ? `Email: ${fromEmail}` : null
    ].filter(Boolean);

    const body = encodeURIComponent(bodyLines.join("\n"));
    window.location.href = `mailto:${toEmail}?subject=${subject}&body=${body}`;
  });
}

/* Smooth scrolling + active highlight + hide-on-scroll header */
function setupNav(){
  const header = $("#siteHeader");
  const toggle = $("#navToggle");
  const list = $("#navList");

  let lastY = window.scrollY;
  let ticking = false;

  const onScroll = () => {
    const y = window.scrollY;
    const down = y > lastY;
    if(y > 60 && down) header.classList.add("header--hidden");
    else header.classList.remove("header--hidden");
    lastY = y;

    if(!ticking){
      window.requestAnimationFrame(() => {
        highlightActive();
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });

  const closeMobile = () => {
    list.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const isOpen = list.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  $$(".nav__link").forEach(a => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href") || "";
      if(!href.startsWith("#")) return;

      e.preventDefault();
      const id = href.slice(1);
      const target = document.getElementById(id);
      if(!target) return;

      closeMobile();
      const top = target.getBoundingClientRect().top + window.scrollY - header.offsetHeight + 10;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });

  function highlightActive(){
    const sections = ["about","work","skills","projects","education","contact"]
      .map(id => document.getElementById(id))
      .filter(Boolean);

    const headerOffset = header.offsetHeight + 16;
    const y = window.scrollY + headerOffset;

    let current = sections[0]?.id;
    for(const s of sections){
      if(y >= s.offsetTop) current = s.id;
    }

    $$(".nav__link").forEach(a => {
      const href = a.getAttribute("href");
      a.classList.toggle("nav__link--active", href === "#" + current);
    });
  }

  highlightActive();
}

async function loadContent(){
  const res = await fetch("content.json", { cache: "no-store" });
  if(!res.ok) throw new Error("Failed to load content.json");
  return await res.json();
}

function applyContent(c){
  $("#brandName").textContent = safeText(c.brand?.name || c.about?.name || "Portfolio");

  $("#aboutName").textContent = safeText(c.about?.name);
  $("#aboutTitle").textContent = safeText(c.about?.title);
  $("#aboutBio").textContent = safeText(c.about?.bio);
  $("#aboutKicker").textContent = safeText(c.about?.kicker || "Hello, I'm");

  const img = $("#aboutImage");
  img.src = safeText(c.about?.image || "");
  img.onerror = () => { img.style.opacity = "0.25"; };

  const resume = $("#resumeBtn");
  resume.href = safeText(c.about?.resumeUrl || "#");
  resume.setAttribute("download", safeText(c.about?.resumeFileName || "Resume.pdf"));

  buildQuickLinks(c.quickLinks || []);
  buildTimeline(c.work?.timeline || []);
  buildSkills(c.skills?.groups || []);
  buildProjects(c.projects?.items || []);
  buildEducation(c.educationAndCertifications?.items || []);
  buildContact(c.contact?.details || []);

  setupContactForm(c.contact?.emailTo || (c.contact?.details || []).find(x => x.type==="email")?.value || "");
  $("#year").textContent = String(new Date().getFullYear());
  $("#footerText").textContent = safeText(c.footerText || `© ${new Date().getFullYear()} ${c.about?.name || ""}`.trim());
}

(async function init(){
  try{
    setupTheme();
    const content = await loadContent();
    applyContent(content);
    setupNav();
  }catch(err){
    console.error(err);
    $("#aboutBio").textContent = "Edit content.json and reload. (Failed to load JSON.)";
    setupTheme();
    setupNav();
  }
})();

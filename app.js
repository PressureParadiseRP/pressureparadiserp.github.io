(function(){
  // ================================
  // ONE-PLACE CONFIG (EDIT THIS)
  // ================================

  const SITE = {
    name: "Pressure in Paradise RP",
    emoji: "🌴🏝️🌞", // You can change the emoji here
    tagline: "Florida Based • Semi-serious RP",

    // online | maintenance | offline | custom
    let statusMode = "online"; // Change to "online", "offline", or "maintenance" depending on server status

    let statusText = ""; // This will store the emoji and text for the status

    // Check the server status mode and set the correct text and emoji
    if (statusMode === "online") {
      statusText = "Server Status: 🟢"; // Emoji for online
    } else if (statusMode === "offline") {
      statusText = "Server Status: 🔴"; // Emoji for offline
    } else if (statusMode === "maintenance") {
      statusText = "Server Status: 🛠️"; // Emoji for maintenance
    } else {
      statusText = "Server Status: Custom"; // Default custom message (optional)
    }

    // Your server links
    discordUrl: "https://discord.gg/4ZY3d5MAh",
    connectUrl: "https://cfx.re/join/3my9mr",
    tebexUrl: "https://www.youtube.com/watch?v=xvFzjo5PzgG0"
  };
})();

  // ==============================
  // HOME/SUBPAGE CLASSES (CSS-only design hooks)
  // ==============================
  function setPageClasses(){
    const p = window.location.pathname || "/";
    const normalized = p.endsWith("/") ? p : (p + "/");
    if(normalized === "/"){
      document.body.classList.add("is-home");
      document.body.classList.remove("is-subpage");
    }else{
      document.body.classList.add("is-subpage");
      document.body.classList.remove("is-home");
    }
  }

  // ==============================
  // STATUS PILL (mode support, non-breaking)
  // ==============================
  function getStatus(){
    const mode = (SITE.statusMode || "custom").toLowerCase();
    if(mode === "online") return { mode: "online", text: "Online" };
    if(mode === "maintenance") return { mode: "maintenance", text: "Maintenance" };
    if(mode === "offline") return { mode: "offline", text: "Offline" };
    return { mode: "custom", text: SITE.statusText || "Status" };
  }

  // ==============================
  // GLOBAL HEADER (auto-injected)
  // ==============================
  function injectHeader(){
    if (document.querySelector(".globalHeader")) return;

    const st = getStatus();

    const header = document.createElement("header");
    header.className = "globalHeader";
    header.innerHTML = `
      <div class="headerInner">
        <div class="headerLeft">
          <div class="headerTitle">${SITE.emoji} ${SITE.name}</div>
          <div class="headerSub">${SITE.tagline}</div>
        </div>
        <div class="headerRight">
          <span class="headerPill headerPill--${st.mode}">${st.text}</span>
          ${SITE.discordUrl ? `<a class="headerBtn" href="${SITE.discordUrl}" target="_blank" rel="noopener">Discord</a>` : ``}
          ${SITE.connectUrl ? `<a class="headerBtn" href="${SITE.connectUrl}" target="_blank" rel="noopener">Connect</a>` : ``}
          ${SITE.tebexUrl ? `<a class="headerBtn" href="${SITE.tebexUrl}" target="_blank" rel="noopener">Tebex</a>` : ``}
        </div>
      </div>
    `;
    document.body.prepend(header);
  }

  // ==============================
  // AUTO-UPDATE SIDEBAR BRAND TEXT
  // ==============================
  function syncBrand(){
    document.querySelectorAll(".brand").forEach(el => {
      el.textContent = `${SITE.name}`;
    });
  }

  // ==============================
  // TOC (optional) + scrollspy (only runs if #tocNav exists)
  // ==============================
  function slugify(str){
    return (str || "")
      .toLowerCase()
      .trim()
      .replace(/['"]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function enableTocIfPresent(){
    const tocNav = document.getElementById("tocNav");
    const tocWrap = document.querySelector(".toc");

    if(!tocNav || !tocWrap) return;

    // enable 3-col layout safely
    document.body.classList.add("has-toc");

    const scope = document.querySelector("main.main") || document.body;

    const headings = Array.from(scope.querySelectorAll("h2, h3"))
      .filter(h => (h.innerText || "").trim().length > 0);

    if(headings.length === 0){
      tocNav.innerHTML = `<div class="tocEmpty">No sections</div>`;
      return;
    }

    // Ensure ids exist and are unique
    const used = new Set(Array.from(document.querySelectorAll("[id]")).map(el => el.id));
    headings.forEach(h => {
      if(!h.id){
        let base = slugify(h.innerText);
        if(!base) base = "section";
        let id = base;
        let i = 2;
        while(used.has(id)){
          id = `${base}-${i++}`;
        }
        h.id = id;
        used.add(id);
      }
    });

    const items = headings.map(h => ({
      id: h.id,
      level: h.tagName.toLowerCase(),
      text: (h.innerText || "").trim()
    }));

    tocNav.innerHTML = items.map(it => `
      <a class="tocLink tocLink--${it.level}" href="#${it.id}">
        <span class="tocIndicator"></span>
        <span class="tocText">${it.text}</span>
      </a>
    `).join("");

    // Smooth scroll
    tocNav.addEventListener("click", (e) => {
      const a = e.target.closest("a.tocLink");
      if(!a) return;

      const id = (a.getAttribute("href") || "").slice(1);
      const el = document.getElementById(id);
      if(!el) return;

      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.pushState(null, "", `#${id}`);
    }, { passive: false });

    // Scrollspy
    const map = items.map(it => document.getElementById(it.id)).filter(Boolean);
    const links = Array.from(tocNav.querySelectorAll("a.tocLink"));

    function setActive(id){
      links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === `#${id}`));
    }

    let ticking = false;
    function onScroll(){
      if(ticking) return;
      ticking = true;

      window.requestAnimationFrame(() => {
        ticking = false;

        const y = window.scrollY || document.documentElement.scrollTop || 0;
        const offset = 110; // accounts for header height

        let currentId = map[0]?.id;
        for(const h of map){
          const top = h.getBoundingClientRect().top + y;
          if(top - offset <= y) currentId = h.id;
        }
        if(currentId) setActive(currentId);
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    onScroll();
  }

  // ==============================
  // MOBILE MENU + SEARCH (unchanged)
  // ==============================
  const sidebar = document.querySelector(".sidebar");
  const menuBtn = document.getElementById("menuBtn");
  const searchInput = document.getElementById("searchInput");

  if(menuBtn && sidebar){
    menuBtn.addEventListener("click",(e)=>{
      e.stopPropagation();
      sidebar.classList.toggle("open");
    });
  }

  document.addEventListener("click",(e)=>{
    if(
      sidebar &&
      sidebar.classList.contains("open") &&
      !sidebar.contains(e.target) &&
      e.target !== menuBtn
    ){
      sidebar.classList.remove("open");
    }
  });

  document.addEventListener("click",(e)=>{
    if(e.target.closest(".nav a") && sidebar){
      sidebar.classList.remove("open");
    }
  });

  // ==============================
// PAGE FILTER (existing behavior kept)
// ==============================
function filterPage(query){
  const q = (query||"").toLowerCase().trim();
  const items = document.querySelectorAll("[data-search-item]");
  const dropdowns = document.querySelectorAll("details");

  if(!q){
    items.forEach(el => el.style.display = "");
    dropdowns.forEach(d => d.open = false);
    return;
  }

  items.forEach(el => {
    const text = (el.innerText||"").toLowerCase();
    el.style.display = text.includes(q) ? "" : "none";
  });

  dropdowns.forEach(d => {
    const t = (d.innerText||"").toLowerCase();
    if(t.includes(q)) d.open = true;
  });
}

// ==============================
// SITE-WIDE SEARCH (NEW)
// ==============================

const SITE_PAGES = [
  { title: "Home", path: "/" },
  { title: "Server Bible", path: "/server-bible/" },
  { title: "Faction ROE", path: "/faction-roe/" },
  { title: "Families ROE", path: "/families-roe/" },
  { title: "LEO", path: "/leo/" },
  { title: "EMS", path: "/ems/" }
];

const siteCache = new Map();
let siteLoading = false;

function ensureSearchBox(){
  let box = document.getElementById("searchResults");
  if(box) return box;

  box = document.createElement("div");
  box.id = "searchResults";
  box.className = "searchResults";
  box.style.display = "none";

  const wrap = searchInput.closest(".search");
  wrap.appendChild(box);

  document.addEventListener("click",(e)=>{
    if(e.target === searchInput || box.contains(e.target)) return;
    box.style.display = "none";
  });

  return box;
}

async function fetchPage(path){
  if(siteCache.has(path)) return siteCache.get(path);

  const res = await fetch(path);
  const html = await res.text();
  const doc = new DOMParser().parseFromString(html,"text/html");

  const nodes = doc.querySelectorAll("[data-search-item]");
  const text = Array.from(nodes).map(n=>n.textContent.trim()).join(" ");

  const record = { path, text };
  siteCache.set(path, record);
  return record;
}

async function buildCache(){
  if(siteLoading) return;
  siteLoading = true;
  await Promise.all(SITE_PAGES.map(p=>fetchPage(p.path)));
  siteLoading = false;
}

async function searchSite(query){
  const q = query.toLowerCase().trim();
  if(q.length < 2) return [];

  await buildCache();

  const results = [];
  for(const p of SITE_PAGES){
    const rec = siteCache.get(p.path);
    if(rec && rec.text.toLowerCase().includes(q)){
      results.push(p);
    }
  }
  return results;
}

function renderResults(results, query){
  const box = ensureSearchBox();
  if(!results.length){
    box.innerHTML = `<div class="searchResultMeta">No results found</div>`;
    box.style.display = "block";
    return;
  }

  box.innerHTML = results.map(r=>`
    <a class="searchResultItem" href="${r.path}?q=${encodeURIComponent(query)}">
      <div class="searchResultTitle">${r.title}</div>
    </a>
  `).join("");

  box.style.display = "block";
}

function applyIncomingQuery(){
  const params = new URLSearchParams(window.location.search);
  const q = params.get("q");
  if(q && searchInput){
    searchInput.value = q;
    filterPage(q);
  }
}

if(searchInput){
  ensureSearchBox();

  searchInput.addEventListener("input", async (e)=>{
    const val = e.target.value;
    filterPage(val);
    const results = await searchSite(val);
    renderResults(results, val);
  });

  searchInput.addEventListener("keydown", async (e)=>{
    if(e.key === "Enter"){
      const results = await searchSite(searchInput.value);
      if(results.length){
        window.location.href = `${results[0].path}?q=${encodeURIComponent(searchInput.value)}`;
      }
    }
  });

  document.addEventListener("keydown",(e)=>{
    if((e.ctrlKey||e.metaKey) && e.key.toLowerCase()==="k"){
      e.preventDefault();
      searchInput.focus();
    }
    if(e.key==="Escape"){
      searchInput.value="";
      filterPage("");
      sidebar?.classList.remove("open");
    }
  });

  applyIncomingQuery();
}

  // ==============================
  // INIT
  // ==============================
  setPageClasses();
  injectHeader();
  syncBrand();
  enableTocIfPresent();

})();

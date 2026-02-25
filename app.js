(function(){
  // ================================
  // ONE-PLACE CONFIG (EDIT THIS)
  // ================================

  const SITE = {
    name: "Pressure in Paradise RP",
    emoji: "🌴🏝️🌞",  // Change emoji if needed
    tagline: "Florida Based • Semi-serious RP",
    discordUrl: "YOUR_DISCORD_URL",  // Add actual Discord URL here
    connectUrl: "YOUR_CONNECT_URL",  // Add actual Connect URL here
    tebexUrl: "YOUR_TEBEX_URL"  // Add actual Tebex URL here
  };

  // ==============================
  // SEARCH FUNCTIONALITY (MODIFIED)
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

    const wrap = document.querySelector(".search");
    wrap.appendChild(box);

    document.addEventListener("click", (e) => {
      if(e.target === searchInput || box.contains(e.target)) return;
      box.style.display = "none";
    });

    return box;
  }

  async function fetchPage(path){
    if(siteCache.has(path)) return siteCache.get(path);

    const res = await fetch(path);
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, "text/html");

    const nodes = doc.querySelectorAll("[data-search-item]");
    const text = Array.from(nodes).map(n => n.textContent.trim()).join(" ");

    const record = { path, text };
    siteCache.set(path, record);
    return record;
  }

  async function buildCache(){
    if(siteLoading) return;
    siteLoading = true;
    await Promise.all(SITE_PAGES.map(p => fetchPage(p.path)));
    siteLoading = false;
  }

  async function searchSite(query, category){
    const q = query.toLowerCase().trim();
    if(q.length < 2) return [];

    await buildCache();

    const results = [];
    for(const p of SITE_PAGES){
      if(category && !p.title.toLowerCase().includes(category.toLowerCase())) continue;
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

    box.innerHTML = results.map(r => `
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

    searchInput.addEventListener("input", async (e) => {
      const val = e.target.value;
      filterPage(val);
      const results = await searchSite(val, categorySelect.value);
      renderResults(results, val);
    });

    const categorySelect = document.getElementById("categoryFilter");
    categorySelect.addEventListener("change", async () => {
      const results = await searchSite(searchInput.value, categorySelect.value);
      renderResults(results, searchInput.value);
    });

    document.addEventListener("keydown", async (e) => {
      if(e.key === "Enter"){
        const results = await searchSite(searchInput.value, categorySelect.value);
        if(results.length){
          window.location.href = `${results[0].path}?q=${encodeURIComponent(searchInput.value)}`;
        }
      }
    });

    document.addEventListener("keydown", (e) => {
      if((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k"){
        e.preventDefault();
        searchInput.focus();
      }
      if(e.key === "Escape"){
        searchInput.value = "";
        filterPage("");
        sidebar?.classList.remove("open");
      }
    });

    applyIncomingQuery();
  }

  // ==============================
  // HEADER INJECTION (Unchanged)
  // ==============================
  function injectHeader(){
    if (document.querySelector(".globalHeader")) return;  // Prevent multiple injections

    const header = document.createElement("header");
    header.className = "globalHeader";
    header.innerHTML = `
      <div class="headerInner">
        <div class="headerLeft">
          <div class="headerTitle">${SITE.emoji} ${SITE.name}</div>
          <div class="headerSub">${SITE.tagline}</div>
        </div>
        <div class="headerRight">
          ${SITE.discordUrl ? `<a class="headerBtn" href="${SITE.discordUrl}" target="_blank" rel="noopener">Discord</a>` : ``}
          ${SITE.connectUrl ? `<a class="headerBtn" href="${SITE.connectUrl}" target="_blank" rel="noopener">Connect</a>` : ``}
          ${SITE.tebexUrl ? `<a class="headerBtn" href="${SITE.tebexUrl}" target="_blank" rel="noopener">Tebex</a>` : ``}
        </div>
      </div>
    `;
    document.body.prepend(header);
  }

  // ==============================
  // INIT
  // ==============================
  setPageClasses();
  injectHeader();
  syncBrand();
  enableTocIfPresent();
})();

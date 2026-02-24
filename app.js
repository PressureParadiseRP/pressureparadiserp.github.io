(function(){
  // ==============================
  // ONE-PLACE CONFIG (EDIT THIS)
  // ==============================
  const SITE = {
    name: "Pressure in Paradise RP",
    emoji: "🌴🌊☀️",
    tagline: "Florida Beach • Semi-serious RP",

    // online | maintenance | offline | custom
    statusMode: "maintenance",
    statusText: "Docs Live", // used only when statusMode = "custom"

    discordUrl: "https://discord.gg/4ZJY3d5MAh",
    connectUrl: "https://cfx.re/join/3m8ymr",
    rulesUrl: "/server-bible/"
  };

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
          ${SITE.rulesUrl ? `<a class="headerBtn" href="${SITE.rulesUrl}">Rules</a>` : ``}
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

  if(searchInput){
    searchInput.addEventListener("input", (e)=> filterPage(e.target.value));

    document.addEventListener("keydown",(e)=>{
      if((e.ctrlKey||e.metaKey) && e.key.toLowerCase()==="k"){
        e.preventDefault();
        searchInput.focus();
      }
      if(e.key==="Escape"){
        searchInput.value="";
        filterPage("");
        if(sidebar) sidebar.classList.remove("open");
      }
    });
  }

  // ==============================
  // INIT
  // ==============================
  setPageClasses();
  injectHeader();
  syncBrand();
  enableTocIfPresent();

})();

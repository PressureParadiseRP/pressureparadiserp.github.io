(function(){
  // ==============================
  // ONE-PLACE CONFIG (EDIT THIS)
  // ==============================
  const SITE = {
  name: "Pressure in Paradise RP",
  emoji: "🌴🌊☀️",
  tagline: "Florida Beach • Semi-serious RP",
    statusMode: "maintenance",         // online | maintenance | offline | custom
statusText: "Docs Live",      // used only when statusMode = "custom"

  discordUrl: "https://discord.gg/4ZJY3d5MAh",
  connectUrl: "https://cfx.re/join/3m8ymr",
  rulesUrl: "/server-bible/"
};
  
  // ==============================
  // GLOBAL HEADER (auto-injected)
  // ==============================
  function injectHeader(){
    // Avoid double-inject
    if (document.querySelector(".globalHeader")) return;

    const header = document.createElement("header");
    header.className = "globalHeader";
    header.innerHTML = `
      <div class="headerInner">
        <div class="headerLeft">
          <div class="headerTitle">${SITE.emoji} ${SITE.name}</div>
          <div class="headerSub">${SITE.tagline}</div>
        </div>
        <div class="headerRight">
          <span class="headerPill">${SITE.statusText}</span>
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
  // MOBILE MENU + SEARCH
  // ==============================
  const sidebar = document.querySelector(".sidebar");
  const menuBtn = document.getElementById("menuBtn");
  const searchInput = document.getElementById("searchInput");

  // Toggle sidebar (mobile)
  if(menuBtn && sidebar){
    menuBtn.addEventListener("click",(e)=>{
      e.stopPropagation();
      sidebar.classList.toggle("open");
    });
  }

  // Close when clicking outside
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

  // Close when nav link clicked
  document.addEventListener("click",(e)=>{
    if(e.target.closest(".nav a") && sidebar){
      sidebar.classList.remove("open");
    }
  });

  // Search filter (hides non-matching items)
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

    // Auto-open dropdowns that match
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
  injectHeader();
  syncBrand();

})();

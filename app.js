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
  // GLOBAL HEADER (auto-injected)
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
    document.body.prepend(header);  // Adds the header to the top of the body
  }

  // ==============================
  // INIT
  // ==============================
  setPageClasses();
  injectHeader();  // Ensure header is injected
  syncBrand();
  enableTocIfPresent();
})();

(function(){
  // ================================
  // ONE-PLACE CONFIG (EDIT THIS)
  // ================================

  const SITE = {
    name: "Pressure in Paradise RP",
    emoji: "🌴🏝️🌞", // You can change the emoji here
    tagline: "Florida Based • Semi-serious RP",

    // online | maintenance | offline | custom
    statusMode: "online", // Correct property assignment

    // The status text will be defined outside the object
  };

  // ==============================
  // Set Status Text Based on Status Mode
  // ==============================
  let statusText = ""; // This will store the emoji and text for the status
  if (SITE.statusMode === "online") {
    statusText = "Server Status: 🟢"; // Emoji for online
  } else if (SITE.statusMode === "offline") {
    statusText = "Server Status: 🔴"; // Emoji for offline
  } else if (SITE.statusMode === "maintenance") {
    statusText = "Server Status: 🛠️"; // Emoji for maintenance
  } else {
    statusText = "Server Status: Custom"; // Default custom message (optional)
  }

  // ==============================
  // GLOBAL HEADER (auto-injected)
  // ==============================
  function injectHeader(){
    if (document.querySelector(".globalHeader")) return;  // Prevent multiple injections

    const st = { mode: SITE.statusMode, text: statusText };

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
    document.body.prepend(header); // Add the header to the top of the body
  }

  // ==============================
  // INIT
  // ==============================
  setPageClasses();
  injectHeader();  // Ensures header is injected
  syncBrand();
  enableTocIfPresent();
})();

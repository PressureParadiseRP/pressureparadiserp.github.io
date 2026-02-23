(function(){
  const sidebar = document.querySelector(".sidebar");
  const menuBtn = document.getElementById("menuBtn");
  const searchInput = document.getElementById("searchInput");

  // Mobile menu toggle
  if (menuBtn && sidebar) {
    menuBtn.addEventListener("click", () => {
      sidebar.classList.toggle("open");
    });
  }

  // Search filter (hides non-matching items)
  function filterPage(query) {
    const q = (query || "").toLowerCase().trim();
    const items = document.querySelectorAll("[data-search-item]");
    const dropdowns = document.querySelectorAll("details");

    if (!q) {
      items.forEach(el => el.style.display = "");
      dropdowns.forEach(d => d.open = false);
      return;
    }

    items.forEach(el => {
      const text = (el.innerText || "").toLowerCase();
      el.style.display = text.includes(q) ? "" : "none";
    });

    // Auto-open dropdowns that match
    dropdowns.forEach(d => {
      const t = (d.innerText || "").toLowerCase();
      if (t.includes(q)) d.open = true;
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", (e) => filterPage(e.target.value));

    // Ctrl/Cmd + K focuses search
    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInput.focus();
      }
      if (e.key === "Escape") {
        searchInput.value = "";
        filterPage("");
        if (sidebar) sidebar.classList.remove("open");
      }
    });
  }
})();

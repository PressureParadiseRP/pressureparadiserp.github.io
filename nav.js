(function(){

const links = [
  {
    group: "Core",
    items: [
      { href: "/", label: "Home" },
      { href: "/server-bible/", label: "Server Bible" }
    ]
  },

  {
    group: "Rules of Engagement",
    items: [
      { href: "/faction-roe/", label: "Faction ROE" },
      { href: "/families-roe/", label: "Families ROE" }
    ]
  },

  {
    group: "Departments",
    items: [
      { href: "/leo/", label: "LEO" },
      { href: "/ems/", label: "EMS" }
    ]
  }
];

const sidebar = document.getElementById("sidebarNav");
if(!sidebar) return;

let current = window.location.pathname;
if(!current.endsWith("/")) current += "/";

let html = "";

links.forEach(section => {

  html += `<p style="color:#888;font-size:12px;margin:15px 10px 5px;">
  ${section.group}
  </p>`;

  section.items.forEach(link => {

    const active =
      current === link.href ? "active" : "";

    html += `
      <a class="${active}" href="${link.href}">
        ${link.label}
      </a>
    `;
  });

});

sidebar.innerHTML = html;

})();

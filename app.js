(function(){

const sidebar = document.querySelector(".sidebar");
const menuBtn = document.getElementById("menuBtn");
const searchInput = document.getElementById("searchInput");

/* Toggle sidebar */
if(menuBtn){
  menuBtn.addEventListener("click",(e)=>{
    e.stopPropagation();
    sidebar.classList.toggle("open");
  });
}

/* Close when clicking outside */
document.addEventListener("click",(e)=>{
  if(
    sidebar.classList.contains("open") &&
    !sidebar.contains(e.target) &&
    e.target !== menuBtn
  ){
    sidebar.classList.remove("open");
  }
});

/* Close when link clicked (mobile UX) */
document.addEventListener("click",(e)=>{
  if(e.target.closest(".nav a")){
    sidebar.classList.remove("open");
  }
});

/* SEARCH SYSTEM */
function filterPage(query){
  const q=(query||"").toLowerCase().trim();
  const items=document.querySelectorAll("[data-search-item]");
  const dropdowns=document.querySelectorAll("details");

  if(!q){
    items.forEach(el=>el.style.display="");
    dropdowns.forEach(d=>d.open=false);
    return;
  }

  items.forEach(el=>{
    const text=(el.innerText||"").toLowerCase();
    el.style.display=text.includes(q)?"":"none";
  });

  dropdowns.forEach(d=>{
    const t=(d.innerText||"").toLowerCase();
    if(t.includes(q)) d.open=true;
  });
}

if(searchInput){
  searchInput.addEventListener("input",
    e=>filterPage(e.target.value)
  );

  document.addEventListener("keydown",(e)=>{
    if((e.ctrlKey||e.metaKey)&&e.key==="k"){
      e.preventDefault();
      searchInput.focus();
    }

    if(e.key==="Escape"){
      searchInput.value="";
      filterPage("");
      sidebar.classList.remove("open");
    }
  });
}

})();

let pages=document.querySelectorAll(".page");

function showPage(id){
    pages.forEach(page=>{
        page.classList.remove("active");
    });

    document
    .getElementById(id)
    .classList.add("active");
}

document
.getElementById("dashboard-btn")
.onclick=()=>showPage("dashboard-page");

document
.getElementById("scores-btn")
.onclick=()=>showPage("scores-page");

document
.getElementById("progress-btn")
.onclick=()=>showPage("progress-page");

document
.getElementById("news-btn")
.onclick=()=>showPage("news-page");

document
.getElementById("profile-btn")
.oncick=()=>showPage("profile-page");


document
.getElementById("game1")
.addEventListener("click", function () {
    window.location.href="../missions/game1.html";
});
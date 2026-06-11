const verifyBtn = document.getElementById("verifyBtn");
const closeBtn = document.getElementById("closeBtn");

verifyBtn.addEventListener("click", function(e) {
    e.preventDefault();
    window.location.href = "../mission1_html/mission_failed.html";
});

closeBtn.addEventListener("click", function(){
    window.location.href = "../mission1_html/mission_success.html";
})
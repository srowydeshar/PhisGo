let signup = document.querySelector(".signup");
let login = document.querySelector(".login");
let slider = document.querySelector(".slider");
let formSection = document.querySelector(".form-section");

signup.addEventListener("click", function() {
    slider.classList.add("moveslider");
    formSection.classList.add("form-section-move");
});

login.addEventListener("click", function() {
    slider.classList.remove("moveslider");
    formSection.classList.remove("form-section-move");
});

document.querySelectorAll(".clkbtn").forEach(button => {
    button.addEventListener("click", function () {
        window.location.href = "dashboard.html";
    });
});
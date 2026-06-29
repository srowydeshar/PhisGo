let pages = document.querySelectorAll(".page");
let navButtons = document.querySelectorAll(".nav-option");

// Global switch handler that switches visible view spaces and highlights menu options
function showPage(pageId, buttonElement) {
    // Hide all tab screens
    pages.forEach(page => {
        page.classList.remove("active");
    });

    // Remove highlighters from all navigation menu items
    navButtons.forEach(btn => {
        btn.classList.remove("active");
    });

    // Toggle active targets
    document.getElementById(pageId).classList.add("active");
    if (buttonElement) {
        buttonElement.classList.add("active");
    }
}

// Map side-panel navigation routes
document.getElementById("dashboard-btn").onclick = (e) => showPage("dashboard-page", e.currentTarget);
document.getElementById("scores-btn").onclick = (e) => showPage("scores-page", e.currentTarget);
document.getElementById("progress-btn").onclick = (e) => showPage("progress-page", e.currentTarget);
document.getElementById("news-btn").onclick = (e) => showPage("news-page", e.currentTarget);
document.getElementById("profile-btn").onclick = (e) => showPage("profile-page", e.currentTarget);


// Execution router redirect targets for Mission 1
function launchMission1() {
    window.location.href = "../missions/game1.html";
}

// Trigger launch on standard grid window area block click
document.getElementById("game1").addEventListener("click", launchMission1);

// Trigger launch on top layout terminal action banner click
document.getElementById("game1-direct-btn").addEventListener("click", launchMission1);

document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            // Hits the backend /logout route we built in app.py
            window.location.href = '/logout'; 
        });
    }
});
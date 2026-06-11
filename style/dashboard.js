const messages = [
    "Hey Cipher!!",
    "One Click Decides Reality.",
    "Trust is your greatest VULNERABILITY.",
    "Get Ready ツ",
    "3",
    "2",
    "1"
];

let messageIndex = 0;
let charIndex = 0;

const typingElement = document.getElementById("typing");

function typeText() {
    if (charIndex < messages[messageIndex].length) {
        typingElement.textContent += messages[messageIndex].charAt(charIndex);

        charIndex++;

        setTimeout(typeText, 100);
    } else {
        setTimeout(nextMessage, 1500);
    }
}

function nextMessage() {
    typingElement.textContent = "";
    charIndex = 0;
    messageIndex++;

    if (messageIndex < messages.length) {
        typeText();
    } else {
        setTimeout(() => {
            window.location.href = "../mission1_html/mission1.html";
        }, 1500);
    }
}

typeText();
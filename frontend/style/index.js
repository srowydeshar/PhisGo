let signup = document.querySelector(".signup");
let login = document.querySelector(".login");

let slider = document.querySelector(".slider");
let formSection = document.querySelector(".form-section");

const buttons = document.querySelectorAll(".clkbtn");


// SWITCH PANELS
signup.addEventListener("click", () => {
    slider.classList.add("moveslider");
    formSection.classList.add("form-section-move");
});

login.addEventListener("click", () => {
    slider.classList.remove("moveslider");
    formSection.classList.remove("form-section-move");
});


// HANDLE LOGIN + SIGNUP
buttons.forEach(button => {

    button.addEventListener("click", async function () {

        // LOGIN
        if (
            button.innerText
            === "Login"
        ) {

            const email =
                document.querySelector(
                    ".login-box .email"
                ).value;

            const password =
                document.querySelector(
                    ".login-box .password"
                ).value;

            const response =
                await fetch(
                    "/api/login",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                            "application/json"
                        },

                        body: JSON.stringify({
                            email,
                            password
                        })
                    }
                );

            const data =
                await response.json();

            if (data.success) {

                window.location.href =
                    data.redirect;

            } else {

                alert(data.message);

            }

        }


        // SIGNUP
        else {

            const fields =
                document.querySelectorAll(
                    ".signup-box input"
                );

            const username =
                fields[0].value;

            const email =
                fields[1].value;

            const password =
                fields[2].value;

            const confirm_password =
                fields[3].value;

            const response =
                await fetch(
                    "/api/signup",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                            "application/json"
                        },

                        body: JSON.stringify({
                            username,
                            email,
                            password,
                            confirm_password
                        })
                    }
                );

            const data =
                await response.json();

            if (data.success) {

                window.location.href =
                    data.redirect;

            } else {

                alert(
                    data.message
                );

            }

        }

    });

});
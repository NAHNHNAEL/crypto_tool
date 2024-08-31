// execute when the DOM is fully loaded
$(document).ready(function () {
    const pageElement = document.querySelector("[data-page]");
    const page = pageElement ? pageElement.getAttribute("data-page") : null;

    // If the page is sidebar
    if (page === "user-sidebar") {
        // Get ID of button logout
        const btnLogout = document.getElementById("logoutButton");
        // Get ID of popup logout
        const popupLogout = document.getElementById("confirmLogoutPopup");
        // Get ID of button confirm logout
        const btnYesConfirmLogout = document.getElementById("confirmLogoutYes");
        // Get ID of button cancel logout
        const btnCancelLogout = document.getElementById("confirmLogoutCancel");

        // Check if button logout clicked
        if (btnLogout) {
            btnLogout.addEventListener("click", async (e) => {
                // Prevent default action
                e.preventDefault();

                // Remove class hide from popup logout
                popupLogout.classList.remove("hidden");
            });
        }

        // Check if button cancel logout clicked
        if (btnCancelLogout) {
            btnCancelLogout.addEventListener("click", (e) => {
                console.log("Cancel button clicked");
                // Add class hide to popup logout
                popupLogout.classList.add("hidden");
            });
        }

        // Check if button confirm logout clicked
        if (btnYesConfirmLogout) {
            btnYesConfirmLogout.addEventListener("click", (e) => {
                console.log("Confirm button clicked");
                // Logout user using fetch API
                fetch("/user/logout", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({}),
                })
            });
        }
    }
});

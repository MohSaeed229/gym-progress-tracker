document.addEventListener("DOMContentLoaded", function () {
    const darkModeToggle = document.getElementById("dark-mode-toggle");
    const darkModeIcon = document.getElementById("dark-mode-icon");

    // Check if dark mode is enabled in localStorage
    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark-mode");

        // If the page has the toggle button, update the icon
        if (darkModeIcon) {
            darkModeIcon.classList.replace("fa-moon", "fa-sun");
        }
    }

    // Toggle dark mode only if the button exists (index.html only)
    if (darkModeToggle) {
        darkModeToggle.addEventListener("click", function () {
            document.body.classList.toggle("dark-mode");

            // Switch icon if button exists
            if (document.body.classList.contains("dark-mode")) {
                darkModeIcon.classList.replace("fa-moon", "fa-sun");
                localStorage.setItem("darkMode", "enabled"); // Save preference
            } else {
                darkModeIcon.classList.replace("fa-sun", "fa-moon");
                localStorage.setItem("darkMode", "disabled");
            }
        });
    }
});

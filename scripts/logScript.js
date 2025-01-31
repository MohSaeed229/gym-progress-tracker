//  Select Elements
const addExerciseBtn = document.querySelector("#add-exercise-btn"); // + Add Exercise button
const exercisePopup = document.querySelector("#exercise-popup"); // The popup container
const closePopupBtn = document.querySelector("#close-popup"); //  Close button inside the popup
const overlay = document.querySelector("#overlay"); // The dimmed background overlay

//  Function to Show Popup
const showPopup = () => {
    exercisePopup.classList.add("show"); // Make the popup visible
    overlay.classList.add("active"); // Show overlay
};

//  Function to Hide Popup
const hidePopup = () => {
    exercisePopup.classList.remove("show"); // Hide popup
    overlay.classList.remove("active"); // Hide overlay
};

//  Event Listeners
addExerciseBtn.addEventListener("click", showPopup); // Open popup when + Add Exercise is clicked
closePopupBtn.addEventListener("click", hidePopup); // Close popup when  is clicked
overlay.addEventListener("click", hidePopup); // Close popup when clicking outside

//  Close Popup on ESC Key
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        hidePopup(); // Hide popup when ESC is pressed
    }
});

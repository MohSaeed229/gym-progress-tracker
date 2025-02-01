/* ---------- Exercise Popup ---------- */
// Select Elements
const addExerciseBtn = document.querySelector("#add-exercise-btn"); // + Add Exercise button
const exercisePopup = document.querySelector("#exercise-popup"); // The popup container
const closePopupBtn = document.querySelector("#close-popup"); // Close button inside the popup
const overlay = document.querySelector("#overlay"); // The dimmed background overlay
const logForm = document.querySelector("#log-form"); // Form
const exerciseList = document.querySelector("#exercise-list"); // Logged Exercises List
/* ---------- Restrict Future Dates for Adding & Editing ---------- */

// Get the workout date input
const workoutDateInput = document.querySelector("#date");

// Set the max date to today
const today = new Date().toISOString().split("T")[0];
workoutDateInput.setAttribute("max", today);

// Prevent users from selecting a future date manually
workoutDateInput.addEventListener("change", () => {
    if (workoutDateInput.value > today) {
        alert("You cannot select a future date.");
        workoutDateInput.value = today; // Reset to today if a future date is selected
    }
});

// Variable to track the exercise being edited
let editingExercise = null;

// Function to Show Popup
const showPopup = () => {
    exercisePopup.classList.add("show"); // Make the popup visible
    overlay.classList.add("active"); // Show overlay
};

// Function to Hide Popup
const hidePopup = () => {
    exercisePopup.classList.remove("show"); // Hide popup
    overlay.classList.remove("active"); // Hide overlay

    // Reset editing mode when popup closes
    if (editingExercise) {
        editingExercise.classList.remove("editing");
        editingExercise = null;
    }
    logForm.reset();
};

// Popup Event Listeners
addExerciseBtn.addEventListener("click", showPopup); // Open popup when + Add Exercise is clicked
closePopupBtn.addEventListener("click", hidePopup); // Close popup when  is clicked
overlay.addEventListener("click", hidePopup); // Close popup when clicking outside

// Close Popup on ESC Key
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        hidePopup();
    }
});

/* ---------- Exercise Logging (Adding & Editing) ---------- */

// Function to Add or Edit Exercise
const addOrEditExercise = (event) => {
    event.preventDefault(); // Prevent form from refreshing the page

    // Get Form Values
    const date = document.querySelector("#date").value;
    const muscle = document.querySelector("#muscle-trained").value;
    const exerciseName = document.querySelector("#exercise").value;
    const weights = document.querySelector("#weights").value;
    const sets = document.querySelector("#sets").value;
    const reps = document.querySelector("#reps").value;
    const notes = document.querySelector("#notes").value.trim();

    // If editing, update the existing exercise
    if (editingExercise) {
        editingExercise.innerHTML = `
            <div class="d-flex flex-column">
                <span class="fw-bold">${exerciseName}</span>
                <small>📅 <strong>Date:</strong> ${date}</small>
                <small>💪 <strong>Muscle Trained:</strong> ${muscle}</small>
                <small>🏋️‍♂️ <strong>Weights Used:</strong> ${weights}</small>
                <small>🔢 <strong>Sets:</strong> ${sets} | 🔄 <strong>Reps:</strong> ${reps}</small>
                ${notes ? `<small>📝 <strong>Notes:</strong> ${notes}</small>` : ""}
                <div class="d-flex gap-2 mt-2">
                    <button class="btn btn-sm btn-edit">Edit</button>
                    <button class="btn btn-sm btn-delete">Delete</button>
                </div>
            </div>
        `;

        // Reattach event listeners for edit and delete buttons
        attachExerciseListeners(editingExercise);
        editingExercise.classList.remove("editing"); // Remove highlight
        editingExercise = null; // Reset editing mode

    } else {
        // Create New Exercise Entry
        const exerciseItem = document.createElement("li");
        exerciseItem.classList.add("list-group-item");

        // Set HTML for New Exercise
        exerciseItem.innerHTML = `
            <div class="d-flex flex-column">
                <span class="fw-bold">${exerciseName}</span>
                <small>📅 <strong>Date:</strong> ${date}</small>
                <small>💪 <strong>Muscle Trained:</strong> ${muscle}</small>
                <small>🏋️‍♂️ <strong>Weights Used:</strong> ${weights}</small>
                <small>🔢 <strong>Sets:</strong> ${sets} | 🔄 <strong>Reps:</strong> ${reps}</small>
                ${notes ? `<small>📝 <strong>Notes:</strong> ${notes}</small>` : ""}
                <div class="d-flex gap-2 mt-2">
                    <button class="btn btn-sm btn-edit">Edit</button>
                    <button class="btn btn-sm btn-delete">Delete</button>
                </div>
            </div>
        `;

        // Add New Exercise to List
        exerciseList.appendChild(exerciseItem);
        attachExerciseListeners(exerciseItem);
    }

    // Clear Form & Close Popup
    logForm.reset();
    hidePopup();
};

// Attach event listeners to edit and delete buttons dynamically
const attachExerciseListeners = (exerciseItem) => {
    exerciseItem.querySelector(".btn-edit").addEventListener("click", () => editExercise(exerciseItem));
    exerciseItem.querySelector(".btn-delete").addEventListener("click", () => deleteExercise(exerciseItem));
};

// Edit Exercise Function
const editExercise = (exerciseItem) => {
    // Populate form with existing data
    const details = exerciseItem.querySelectorAll("small");
    document.querySelector("#date").value = details[0].innerText.replace("📅 Date: ", "");
    document.querySelector("#muscle-trained").value = details[1].innerText.replace("💪 Muscle Trained: ", "");
    document.querySelector("#exercise").value = exerciseItem.querySelector("span").innerText;
    document.querySelector("#weights").value = details[2].innerText.replace("🏋️‍♂️ Weights Used: ", "");
    document.querySelector("#sets").value = details[3].innerText.replace("🔢 Sets: ", "").split("|")[0].trim();
    document.querySelector("#reps").value = details[3].innerText.replace("🔢 Sets: ", "").split("| 🔄 Reps: ")[1];
    document.querySelector("#notes").value = details.length > 4 ? details[4].innerText.replace("📝 Notes: ", "") : "";

    // Set editing mode
    editingExercise = exerciseItem;
    editingExercise.classList.add("editing"); // Highlight the selected exercise
    showPopup();
};

/* ---------- Exercise Deleting ---------- */

// Delete Exercise Function
const deleteExercise = (exerciseItem) => {
    if (confirm("Are you sure you want to delete this exercise?")) {
        exerciseItem.remove();
    }
};

// Attach submit event to form
logForm.addEventListener("submit", addOrEditExercise);

/* ---------- Exercise Filtering ---------- */




// // Prevent dropdown from closing when clicking inside
// document.querySelectorAll('.dropdown-menu').forEach(menu => {
//     menu.addEventListener('click', (event) => {
//         event.stopPropagation(); // Stops the dropdown from closing
//     });
// });

// // Clear checkboxes without closing the dropdown
// document.getElementById("clear-muscle-selection").addEventListener("click", () => {
//     document.querySelectorAll(".dropdown-menu .form-check-input").forEach(checkbox => {
//         checkbox.checked = false; // Uncheck all
//     });
// });
